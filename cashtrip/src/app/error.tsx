'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1E293B] to-[#0f172a] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-black text-white mb-4">Algo deu errado!</h2>
        <p className="text-white/80 mb-6">
          {error.message || 'Ocorreu um erro inesperado'}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[#FF5F38] hover:bg-[#FF7A5C] text-white rounded-full font-bold transition-colors"
          >
            Tentar novamente
          </button>
          <a
            href="/quiz/travel-purpose"
            className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full font-bold transition-colors"
          >
            Ir para o quiz
          </a>
        </div>
      </div>
    </div>
  );
}


