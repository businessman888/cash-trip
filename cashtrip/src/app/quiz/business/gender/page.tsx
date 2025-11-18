"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuiz } from "@/contexts/QuizContext";

type Gender = "male" | "female" | "non-binary" | null;

export default function QuizGenderPage() {
  const router = useRouter();
  const { responses, saveResponse } = useQuiz();
  const [selected, setSelected] = useState<Gender>(null);

  // Load existing response
  useEffect(() => {
    if (responses.gender) {
      setSelected(responses.gender as Gender);
    }
  }, [responses]);

  const handleContinue = async () => {
    if (!selected) return;
    
    // Save to Supabase via Context
    await saveResponse("gender", selected);
    
    // Redirect to next question
    router.push("/quiz/business/location");
  };

  const options = [
    {
      id: "male" as Gender,
      label: "Homem",
      icon: "/icons/icon-homem.svg"
    },
    {
      id: "female" as Gender,
      label: "Mulher",
      icon: "/icons/icon-mulher.svg"
    },
    {
      id: "non-binary" as Gender,
      label: "Não-binário",
      icon: "/icons/icon-não-binário.svg"
    }
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
              style={{ width: '4%' }} // 1 de 25 perguntas = 4%
            />
          </div>
        </div>

        {/* Textos */}
        <div className="flex flex-col items-center gap-[10px] py-[11px]">
          <h1 className="text-[32px] font-roboto-condensed font-bold text-[#FF5F38] leading-[1.17em] text-center">
            Como você se<br />
            identifica?
          </h1>
          <p className="text-[16px] font-inria-sans font-bold text-[#64748B] leading-[1.2em] text-center">
            Escolha uma opção que melhor te representa
          </p>
        </div>
      </div>

      {/* Opções de Gênero */}
      <div className="w-full max-w-md flex justify-center items-center py-[15px] px-[81px] mb-5">
        <div className="flex flex-col gap-[19px] w-[212px]">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelected(option.id)}
              className={`
                relative w-full h-[116px] rounded-[15px] flex items-center justify-center
                transition-all duration-200
                ${selected === option.id
                  ? "bg-[#FF5F38]/25 border-2 border-[#FF5F38] shadow-[2px_2px_9px_0px_rgba(255,95,56,1)]"
                  : "bg-[#FBFDFF] shadow-[0.9px_0.9px_4px_0px_rgba(0,0,0,0.25)] hover:shadow-lg"
                }
              `}
            >
              <Image
                src={option.icon}
                alt={option.label}
                width={80}
                height={80}
                className={`object-contain transition-all duration-200 ${
                  selected === option.id ? "brightness-0 saturate-100 hue-rotate-[345deg]" : ""
                }`}
                style={selected === option.id ? { filter: "invert(48%) sepia(79%) saturate(2476%) hue-rotate(346deg) brightness(118%) contrast(119%)" } : {}}
              />
            </button>
          ))}
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

