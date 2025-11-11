"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AgeRange = "18-25" | "26-35" | "36-45" | "46-55" | "56+" | null;

export default function QuizAgePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<AgeRange>(null);

  const handleContinue = () => {
    if (!selected) return;
    
    // Salvar escolha (localStorage temporário, depois Supabase)
    localStorage.setItem("age", selected);
    
    // Redirecionar para próxima pergunta do quiz
    router.push("/quiz/income");
  };

  const options = [
    { id: "18-25" as AgeRange, label: "18 a 25 anos" },
    { id: "26-35" as AgeRange, label: "26 a 35 anos" },
    { id: "36-45" as AgeRange, label: "36 a 45 anos" },
    { id: "46-55" as AgeRange, label: "46 a 55 anos" },
    { id: "56+" as AgeRange, label: "Acima de 56 anos" }
  ];

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex flex-col items-center px-4 py-[25px] pb-20">
      {/* Header com Progresso e Textos */}
      <div className="w-full max-w-md flex flex-col items-center gap-[21px] mb-3">
        {/* Barra de Progresso */}
        <div className="w-full flex justify-center items-center p-2">
          <div className="w-[325px] h-[31px] bg-white rounded-full overflow-hidden shadow-sm">
            <div 
              className="h-full bg-gradient-to-r from-[#FF5F38] to-[#FF896F] rounded-full transition-all duration-300"
              style={{ width: '12%' }} // 3 de 25 perguntas = 12%
            />
          </div>
        </div>

        {/* Textos */}
        <div className="flex flex-col items-center gap-[10px] py-[11px]">
          <h1 className="text-[32px] font-roboto-condensed font-bold text-[#FF5F38] leading-[1.17em] text-center">
            Qual a sua<br />
            idade?
          </h1>
          <p className="text-[16px] font-inria-sans font-bold text-[#64748B] leading-[1.2em] text-center">
            Escolha uma opção que melhor te representa
          </p>
        </div>
      </div>

      {/* Opções de Idade em Grid */}
      <div className="w-full max-w-md flex flex-col items-center py-[15px] px-[2px] h-[416px] gap-[10px]">
        {/* Linha 1 */}
        <div className="w-full h-[124px] relative">
          <button
            onClick={() => setSelected(options[0].id)}
            className={`
              absolute left-[11px] top-0 w-[156px] h-[124px] rounded-[20px]
              flex items-center justify-center text-center
              transition-all duration-200 border-2
              ${selected === options[0].id
                ? "bg-[#FF5F38]/25 border-[#E6502C] shadow-[0.9px_0.9px_9px_0px_rgba(255,95,56,0.6)]"
                : "bg-white border-[#1E293B] hover:shadow-lg"
              }
            `}
          >
            <span className={`font-inria-sans font-bold text-[18px] ${selected === options[0].id ? "text-[#E6502C]" : "text-[#1E293B]"}`}>
              {options[0].label}
            </span>
          </button>
          
          <button
            onClick={() => setSelected(options[1].id)}
            className={`
              absolute left-[172px] top-0 w-[156px] h-[124px] rounded-[20px]
              flex items-center justify-center text-center
              transition-all duration-200 border-2
              ${selected === options[1].id
                ? "bg-[#FF5F38]/25 border-[#E6502C] shadow-[0.9px_0.9px_9px_0px_rgba(255,95,56,0.6)]"
                : "bg-white border-[#1E293B] hover:shadow-lg"
              }
            `}
          >
            <span className={`font-inria-sans font-bold text-[18px] ${selected === options[1].id ? "text-[#E6502C]" : "text-[#1E293B]"}`}>
              {options[1].label}
            </span>
          </button>
        </div>

        {/* Linha 2 */}
        <div className="w-full h-[124px] relative">
          <button
            onClick={() => setSelected(options[2].id)}
            className={`
              absolute left-[11px] top-0 w-[156px] h-[124px] rounded-[20px]
              flex items-center justify-center text-center
              transition-all duration-200 border-2
              ${selected === options[2].id
                ? "bg-[#FF5F38]/25 border-[#E6502C] shadow-[0.9px_0.9px_9px_0px_rgba(255,95,56,0.6)]"
                : "bg-white border-[#1E293B] hover:shadow-lg"
              }
            `}
          >
            <span className={`font-inria-sans font-bold text-[18px] ${selected === options[2].id ? "text-[#E6502C]" : "text-[#1E293B]"}`}>
              {options[2].label}
            </span>
          </button>
          
          <button
            onClick={() => setSelected(options[3].id)}
            className={`
              absolute left-[172px] top-0 w-[156px] h-[124px] rounded-[20px]
              flex items-center justify-center text-center
              transition-all duration-200 border-2
              ${selected === options[3].id
                ? "bg-[#FF5F38]/25 border-[#E6502C] shadow-[0.9px_0.9px_9px_0px_rgba(255,95,56,0.6)]"
                : "bg-white border-[#1E293B] hover:shadow-lg"
              }
            `}
          >
            <span className={`font-inria-sans font-bold text-[18px] ${selected === options[3].id ? "text-[#E6502C]" : "text-[#1E293B]"}`}>
              {options[3].label}
            </span>
          </button>
        </div>

        {/* Linha 3 - Opção Maior */}
        <div className="w-full h-[124px] relative">
          <button
            onClick={() => setSelected(options[4].id)}
            className={`
              absolute left-[12px] top-0 w-[316px] h-[124px] rounded-[20px]
              flex items-center justify-center text-center
              transition-all duration-200 border-2
              ${selected === options[4].id
                ? "bg-[#FF5F38]/25 border-[#E6502C] shadow-[0.9px_0.9px_9px_0px_rgba(255,95,56,0.6)]"
                : "bg-white border-[#1E293B] hover:shadow-lg"
              }
            `}
          >
            <span className={`font-inria-sans font-bold text-[18px] ${selected === options[4].id ? "text-[#E6502C]" : "text-[#1E293B]"}`}>
              {options[4].label}
            </span>
          </button>
        </div>
      </div>

      {/* Botão Próxima Pergunta */}
      <div className="w-full max-w-md flex justify-center items-center py-[28px] px-[67px]">
        <button
          onClick={handleContinue}
          disabled={!selected}
          className={`
            relative w-[240px] h-[51px] rounded-[30px] flex items-center justify-center gap-2
            transition-all duration-200
            ${selected
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

