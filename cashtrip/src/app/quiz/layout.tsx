import { QuizProvider } from '@/contexts/QuizContext';
import { ReactNode } from 'react';

export default function QuizLayout({ children }: { children: ReactNode }) {
  return <QuizProvider>{children}</QuizProvider>;
}

