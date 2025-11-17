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
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 1. Fetch all quiz responses for this user
    const { data: responses, error: fetchError } = await supabase
      .from('quiz_responses')
      .select('question_key, answer_value')
      .eq('user_id', user.id);

    if (fetchError) {
      throw new Error(`Error fetching responses: ${fetchError.message}`);
    }

    // 2. Transform responses into object
    const responsesObj = responses?.reduce((acc, item) => {
      acc[item.question_key] = item.answer_value;
      return acc;
    }, {} as Record<string, any>) || {};

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

    // 7. Save to Supabase
    const { data: savedProfile, error: saveError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        profile_data: profileData.user_profile,
        version: 1,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (saveError) {
      throw new Error(`Error saving profile: ${saveError.message}`);
    }

    // 8. Return profile
    return NextResponse.json({
      success: true,
      profile: profileData.user_profile,
    });

  } catch (error: any) {
    console.error('Error processing quiz:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process quiz' },
      { status: 500 }
    );
  }
}

