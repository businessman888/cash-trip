'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';

interface QuizContextType {
  responses: Record<string, any>;
  saveResponse: (key: string, value: any) => Promise<void>;
  isLoading: boolean;
  loadResponses: () => Promise<void>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);
const STORAGE_KEY = 'quiz_responses_dev';
const IS_DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

export function QuizProvider({ children }: { children: ReactNode }) {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  // Load existing responses on mount
  useEffect(() => {
    loadResponses();
  }, []);

  const loadResponses = async () => {
    try {
      if (IS_DEV_MODE) {
        // Modo dev: carregar do localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setResponses(JSON.parse(stored));
        }
        return;
      }

      // Produção: carregar do Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('quiz_responses')
        .select('question_key, answer_value')
        .eq('user_id', user.id);

      if (error) throw error;

      const responsesObj = data?.reduce((acc, item) => {
        acc[item.question_key] = item.answer_value;
        return acc;
      }, {} as Record<string, any>) || {};

      setResponses(responsesObj);
    } catch (error) {
      console.error('Error loading responses:', error);
    }
  };

  const saveResponse = async (key: string, value: any) => {
    setIsLoading(true);
    
    try {
      const newResponses = { ...responses, [key]: value };
      setResponses(newResponses);
      
      // Em modo dev, sempre salvar no localStorage
      if (IS_DEV_MODE) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newResponses));
        setIsLoading(false);
        return;
      }
      
      // Produção: salvar no Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase.from('quiz_responses').upsert({
          user_id: user.id,
          question_key: key,
          answer_value: value,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,question_key'
        });

        if (error) {
          console.error('Error saving response:', error);
        }
      }
    } catch (error) {
      console.error('Error in saveResponse:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <QuizContext.Provider value={{ responses, saveResponse, isLoading, loadResponses }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider');
  }
  return context;
}

