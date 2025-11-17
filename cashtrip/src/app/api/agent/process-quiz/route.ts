import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { geminiModel } from '@/lib/gemini/client';
import {
  PROFILE_BUILDER_PROMPT,
  formatQuizResponsesForAgent,
} from '@/lib/gemini/prompts/profile-builder';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const IS_DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
    
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

    // 3. Format for agent
    const formattedQuiz = formatQuizResponsesForAgent(responsesObj);

    // 4. Call Gemini with FASE 1 prompt
    const result = await geminiModel.generateContent(
      `${PROFILE_BUILDER_PROMPT}\n\n${formattedQuiz}`
    );

    const responseText = result.response.text();

    // 5. Extract JSON
    let profileData;
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      profileData = JSON.parse(jsonMatch[1]);
    } else {
      profileData = JSON.parse(responseText);
    }

    // 6. Validate structure
    if (!profileData.user_profile) {
      throw new Error('Invalid profile structure returned by agent');
    }

    // 7. Save to Supabase apenas se usuário autenticado
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

    // 8. Return profile
    return NextResponse.json({
      success: true,
      profile: profileData.user_profile,
      devMode: IS_DEV_MODE,
    });

  } catch (error: any) {
    console.error('Error processing quiz:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process quiz' },
      { status: 500 }
    );
  }
}

