"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import { useQuiz } from "@/contexts/QuizContext";

export default function QuizPreparingAgentPage() {
  const router = useRouter();
  const { responses } = useQuiz();
  const lottieRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Preparando seu agente de viagens...");
  const [error, setError] = useState<string | null>(null);
  
  const IS_DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

  useEffect(() => {
    processQuiz();
  }, []);

  async function processQuiz() {
    try {
      // Simulate progress
      setProgress(20);
      setStatus("Analisando suas respostas...");
      
      await new Promise(r => setTimeout(r, 1000));
      setProgress(40);
      setStatus("Entendendo seu estilo...");
      
      const body = IS_DEV_MODE ? { responses } : undefined;
      
      // Call agent API
      const response = await fetch('/api/agent/process-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      
      setProgress(70);
      setStatus("Criando perfil perfeito...");
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process quiz');
      }
      
      const { profile } = await response.json();
      
      // Em modo dev, salvar no localStorage
      if (IS_DEV_MODE) {
        localStorage.setItem('user_profile_dev', JSON.stringify(profile));
      }
      
      setProgress(100);
      setStatus("Perfil completo!");
      
      // Wait a bit then redirect
      await new Promise(r => setTimeout(r, 1500));
      router.push("/quiz/all-ready");
      
    } catch (err: any) {
      console.error('Error processing quiz:', err);
      setError(err.message || 'Erro ao processar quiz');
      setStatus("Ocorreu um erro. Tentando novamente...");
      
      // Retry after 3 seconds
      setTimeout(() => {
        processQuiz();
      }, 3000);
    }
  }

  return (
    <div className="min-h-screen bg-[#FF5F38] flex flex-col gap-5 py-[58px]">
      {/* Progress Bar Section */}
      <div className="w-full flex flex-col justify-center items-center gap-[18px] px-[41px] h-[133px]">
        {/* Progress Component */}
        <div className="relative w-[307px] h-[31px]">
          {/* Progress Bar Background */}
          <div className="absolute left-0 top-[5px] w-[307px] h-[5px] bg-[rgba(100,116,139,0.1)] rounded-[20px]">
            {/* Progress Fill - 100% */}
            <div className="absolute left-0 top-0 w-[291px] h-[5px] bg-white rounded-[20px]" />
          </div>

          {/* Nível 1 */}
          <div className="absolute left-[38px] top-0 w-[15px] h-[15px]">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="7.5" cy="7.5" r="7.5" fill="white" filter="drop-shadow(1px 1px 9px rgba(0,0,0,0.25))"/>
              <path d="M4 7.97L6 9.97L11 4.97" stroke="#FF5F38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="absolute left-[29px] top-[17px] text-white font-roboto-condensed font-black text-xs leading-[14px]">
            Nível 1
          </span>

          {/* Nível 2 */}
          <div className="absolute left-[104px] top-0 w-[15px] h-[15px]">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="7.5" cy="7.5" r="7.5" fill="white" filter="drop-shadow(1px 1px 4px rgba(0,0,0,0.25))"/>
              <path d="M4 7.97L6 9.97L11 4.97" stroke="#FF5F38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="absolute left-[95px] top-[17px] text-white font-roboto-condensed font-black text-xs leading-[14px]">
            Nível 2
          </span>

          {/* Nível 3 */}
          <div className="absolute left-[171px] top-0 w-[15px] h-[15px]">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="7.5" cy="7.5" r="7.5" fill="white" filter="drop-shadow(1px 1px 4px rgba(0,0,0,0.25))"/>
              <path d="M4 7.97L6 9.97L11 4.97" stroke="#FF5F38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="absolute left-[162px] top-[17px] text-white font-roboto-condensed font-black text-xs leading-[14px]">
            Nível 3
          </span>

          {/* Nível 4 */}
          <div className="absolute left-[237px] top-0 w-[15px] h-[15px]">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="7.5" cy="7.5" r="7.5" fill="white" filter="drop-shadow(1px 1px 4px rgba(0,0,0,0.25))"/>
              <path d="M4 7.97L6 9.97L11 4.97" stroke="#FF5F38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="absolute left-[227px] top-[17px] text-white font-roboto-condensed font-black text-xs leading-[14px]">
            Nível 4
          </span>

          {/* Bônus */}
          <div className="absolute left-[284px] top-[3px] w-[10px] h-[10px]">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="5" cy="5" r="5" fill="white" filter="drop-shadow(1px 1px 4px rgba(0,0,0,0.25))"/>
              <path d="M3 5L4.5 6.5L7 3.5" stroke="#FF5F38" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="absolute left-[274px] top-[17px] text-white font-roboto-condensed font-black text-xs leading-[14px]">
            Bônus
          </span>
        </div>

        {/* Title */}
        <h1 className="text-white font-roboto-condensed font-bold text-[36px] leading-[42px] text-center whitespace-pre-line">
          {status}
        </h1>
        
        {/* Progress Percentage */}
        <p className="text-white font-roboto-condensed font-semibold text-[20px]">
          {progress}%
        </p>
        
        {/* Error Message */}
        {error && (
          <p className="text-white/80 font-roboto-condensed text-[14px] px-4 text-center">
            {error}
          </p>
        )}
      </div>

      {/* Loading Illustration - Airplane Flying Lottie Animation */}
      <div className="w-full flex justify-center items-center px-[87px] py-8">
        <div 
          ref={lottieRef}
          className="w-[300px] h-[300px] flex items-center justify-center"
          style={{ backgroundColor: "transparent" }}
        >
          <Lottie
            path="/animations/airplane-loading.json"
            loop={true}
            autoplay={true}
            style={{ 
              width: "300px", 
              height: "300px",
              backgroundColor: "transparent",
            }}
            rendererSettings={{
              preserveAspectRatio: "xMidYMid meet",
              clearCanvas: true,
            }}
          />
        </div>
      </div>

      {/* Floating Button (non-interactive) */}
      <div className="fixed bottom-5 right-5 w-[73px] h-[73px] rounded-full bg-white border-[3px] border-[#1E293B] shadow-[2px_2px_9px_0px_rgba(30,41,59,0.4)] flex items-center justify-center opacity-50">
        <svg
          width="42"
          height="24"
          viewBox="0 0 42 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.875 10.667h26.25M24.938 1.277l11.844 21.389"
            stroke="#E6502C"
            strokeWidth="2.667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

