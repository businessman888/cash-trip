import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateUserProfile } from '@/lib/profile/profile-calculator';

export async function POST(request: NextRequest) {
  const IS_DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
  
  try {
    const supabase = await createClient();
    
    let responsesObj: Record<string, any> = {};
    let user = null;
    
    // Verificar autenticação
    const { data: { user: authUser } } = await supabase.auth.getUser();
    user = authUser;
    
    if (user) {
      // Usuário autenticado: buscar respostas do banco
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
    } else {
      // Usuário não autenticado: aceitar respostas do body
      try {
        const body = await request.json();
        responsesObj = body.responses || {};
      } catch (e) {
        responsesObj = {};
      }
      
      if (Object.keys(responsesObj).length === 0) {
        return NextResponse.json(
          { error: 'No quiz responses provided' }, 
          { status: 400 }
        );
      }
    }

    // Calcular perfil usando lógica determinística
    console.log('[API] Calculating profile using deterministic logic...');
    const profileData = calculateUserProfile(responsesObj);
    console.log('[API] Profile calculated successfully');

    // Salvar no banco se usuário autenticado
    if (user) {
      const { error: saveError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          profile_data: profileData,
          version: 1,
          updated_at: new Date().toISOString(),
        });

      if (saveError) {
        throw new Error(`Error saving profile: ${saveError.message}`);
      }
    }

    // Retornar perfil
    return NextResponse.json({
      success: true,
      profile: profileData,
      devMode: IS_DEV_MODE,
    });

  } catch (error: any) {
    console.error('[API] Error processing quiz:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to process quiz',
        retryable: false, // Não é mais necessário retry
      },
      { status: 500 }
    );
  }
}
