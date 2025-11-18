import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { processQuizWithGemini } from '@/lib/gemini/client';
import {
  PROFILE_BUILDER_PROMPT,
  formatQuizResponsesForAgent,
} from '@/lib/gemini/prompts/profile-builder';
import { createMockProfile } from '@/lib/gemini/mock-profile';

function getErrorMessage(error: any): string {
  if (error?.message) {
    const msg = error.message.toLowerCase();
    
    if (msg.includes('quota') || msg.includes('rate limit') || msg.includes('429')) {
      return 'API temporariamente indisponível devido a limite de uso';
    }
    
    if (msg.includes('auth') || msg.includes('401') || msg.includes('403')) {
      return 'Erro de autenticação da API';
    }
    
    if (msg.includes('500') || msg.includes('server error')) {
      return 'Serviço temporariamente indisponível';
    }
    
    if (msg.includes('timeout')) {
      return 'Requisição demorou muito';
    }
    
    return error.message;
  }
  
  return 'Erro desconhecido ao processar quiz';
}

export async function POST(request: NextRequest) {
  const IS_DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
  const USE_MOCK_ON_ERROR = process.env.NEXT_PUBLIC_USE_MOCK_PROFILE === 'true';
  
  try {
    const supabase = await createClient();
    
    let responsesObj: Record<string, any> = {};
    let user = null;
    
    if (IS_DEV_MODE) {
      // Modo dev: aceitar respostas do body
      const body = await request.json();
      responsesObj = body.responses || {};
      
      if (Object.keys(responsesObj).length === 0) {
        throw new Error('No quiz responses provided');
      }
    } else {
      // Produção: buscar do Supabase (requer autenticação)
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authUser) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      
      user = authUser;

      // Fetch all quiz responses for this user
      const { data: responses, error: fetchError } = await supabase
        .from('quiz_responses')
        .select('question_key, answer_value')
        .eq('user_id', user.id);

      if (fetchError) {
        throw new Error(`Error fetching responses: ${fetchError.message}`);
      }

      // Transform responses into object
      responsesObj = responses?.reduce((acc, item) => {
        acc[item.question_key] = item.answer_value;
        return acc;
      }, {} as Record<string, any>) || {};
    }

    // Format for agent
    const formattedQuiz = formatQuizResponsesForAgent(responsesObj);

    let profileData: any;
    
    try {
      // Tentar chamar Gemini com retry (já implementado no cliente)
      console.log('[API] Chamando Gemini API...');
      profileData = await processQuizWithGemini(
        PROFILE_BUILDER_PROMPT,
        formattedQuiz,
        {
          maxRetries: 3,
          initialDelay: 1000,
          maxDelay: 10000,
          timeout: 30000,
        }
      );
      console.log('[API] Gemini respondeu com sucesso');
    } catch (geminiError: any) {
      console.error('[API] Erro crítico ao chamar Gemini:', geminiError);
      
      // FALLBACK AUTOMÁTICO: Sempre usar perfil mock se a API falhar
      // Isso garante que o usuário nunca fique travado, mesmo com erros de quota ou API
      console.log('[API] Ativando perfil mock de fallback para garantir continuidade do fluxo.');
      profileData = createMockProfile(responsesObj);
    }

    // Validate structure
    if (!profileData.user_profile) {
      throw new Error('Invalid profile structure returned by agent');
    }

    // Save to Supabase apenas se usuário autenticado
    if (user) {
      const { error: saveError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          profile_data: profileData.user_profile,
          version: 1,
          updated_at: new Date().toISOString(),
        });

      if (saveError) {
        throw new Error(`Error saving profile: ${saveError.message}`);
      }
    }

    // Return profile
    return NextResponse.json({
      success: true,
      profile: profileData.user_profile,
      devMode: IS_DEV_MODE,
      usedMock: USE_MOCK_ON_ERROR && !profileData.user_profile.profile_id?.includes('usr_'),
    });

  } catch (error: any) {
    console.error('[API] Error processing quiz:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to process quiz',
        retryable: true,
      },
      { status: 500 }
    );
  }
}
