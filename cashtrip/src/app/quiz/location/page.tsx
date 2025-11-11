"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function QuizLocationPage() {
  const router = useRouter();
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const handleContinue = () => {
    if (!state.trim() || !city.trim()) return;
    
    // Salvar escolha (localStorage temporário, depois Supabase)
    localStorage.setItem("location", JSON.stringify({ state: state.trim(), city: city.trim() }));
    
    // Redirecionar para próxima pergunta do quiz
    router.push("/quiz/age");
  };

  const isValid = state.trim().length > 0 && city.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex flex-col items-center px-4 py-[30px] pb-20">
      {/* Header com Progresso e Textos */}
      <div className="w-full max-w-md flex flex-col items-center gap-[21px] mb-3">
        {/* Barra de Progresso */}
        <div className="w-full flex justify-center items-center p-2 px-[25px]">
          <div className="w-[325px] h-[31px] bg-white rounded-full overflow-hidden shadow-sm">
            <div 
              className="h-full bg-gradient-to-r from-[#FF5F38] to-[#FF896F] rounded-full transition-all duration-300"
              style={{ width: '8%' }} // 2 de 25 perguntas = 8%
            />
          </div>
        </div>

        {/* Textos */}
        <div className="flex flex-row justify-center items-center gap-[10px] py-[11px] px-[88px]">
          <h1 className="text-[32px] font-roboto-condensed font-bold text-[#FF5F38] leading-[1.17em] text-center">
            Onde você<br />
            mora?
          </h1>
        </div>
      </div>

      {/* Campos de Input */}
      <div className="flex flex-col items-center gap-10 py-[60px] mb-5">
        {/* Campo Estado */}
        <div className="relative w-[344px] h-[86px]">
          <label 
            htmlFor="state"
            className="absolute left-[23px] top-0 text-[16px] font-roboto font-normal text-[#E6502C] leading-[1.17em] bg-[#F1F1F1] px-1 z-10"
          >
            Estado:
          </label>
          <input
            id="state"
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="Digite seu estado"
            className="absolute top-[25px] w-full h-[61px] rounded-[30px] border border-[#E6502C] bg-white px-6 text-gray-700 outline-none focus:border-[#FF5F38] focus:border-2 transition-all"
          />
        </div>

        {/* Campo Cidade */}
        <div className="relative w-[344px] h-[86px]">
          <label 
            htmlFor="city"
            className="absolute left-[23px] top-0 text-[16px] font-roboto font-normal text-[#E6502C] leading-[1.17em] bg-[#F1F1F1] px-1 z-10"
          >
            Cidade:
          </label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Digite sua cidade"
            className="absolute top-[25px] w-full h-[61px] rounded-[30px] border border-[#E6502C] bg-white px-6 text-gray-700 outline-none focus:border-[#FF5F38] focus:border-2 transition-all"
          />
        </div>
      </div>

      {/* Botão Próxima Pergunta */}
      <div className="w-full max-w-md flex justify-center items-center py-10 px-[67px]">
        <button
          onClick={handleContinue}
          disabled={!isValid}
          className={`
            relative w-[240px] h-[51px] rounded-[30px] flex items-center justify-center gap-2
            transition-all duration-200
            ${isValid
              ? "bg-[#FF896F] hover:bg-[#FF7A5C] cursor-pointer shadow-md"
              : "bg-[#FF896F]/50 cursor-not-allowed"
            }
          `}
        >
          <span className="text-white font-inria-sans font-bold text-[20px] leading-[1.2em]">
            Próxima pergunta
          </span>
          {/* Arrow Icon */}
          <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.5 1.5L22 9M22 9L14.5 16.5M22 9H2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

