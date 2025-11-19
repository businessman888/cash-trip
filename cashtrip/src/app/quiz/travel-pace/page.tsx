"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { NavigationButton } from "@/components/quiz/NavigationButton";
import { QUIZ_ICONS } from "@/lib/quiz-icons";
import { useQuiz } from "@/contexts/QuizContext";

type TravelPace = "agitado" | "equilibrado" | "tranquilo";

export default function QuizTravelPacePage() {
  const router = useRouter();
  const { responses, saveResponse } = useQuiz();
  const [selected, setSelected] = useState<TravelPace | null>(null);

  // Load existing response
  useEffect(() => {
    if (responses.travelPace) {
      setSelected(responses.travelPace as TravelPace);
    }
  }, [responses]);

  const handleSelect = (pace: TravelPace) => {
    setSelected(pace);
  };

  const handleContinue = async () => {
    if (!selected) return;
    
    // Save to Supabase via Context
    await saveResponse("travelPace", selected);
    
    // Redirect to next question
    router.push("/quiz/daytime-places");
  };

  const options = [
    { 
      id: "agitado" as TravelPace, 
      label: "Agitado",
      description: "(Máximo de atividades por dia)",
      icon: `/icons/${QUIZ_ICONS.estiloViagem.agitado}.svg`
    },
    { 
      id: "equilibrado" as TravelPace, 
      label: "Equilibrado",
      description: "(Mescla atividades e pausas)",
      icon: `/icons/${QUIZ_ICONS.estiloViagem.equilibrado}.svg`
    },
    { 
      id: "tranquilo" as TravelPace, 
      label: "Tranquilo/zen",
      description: "(Tempo livre, poucas atividades)",
      icon: `/icons/${QUIZ_ICONS.estiloViagem.tranquilo}.svg`
    },
  ];

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex flex-col gap-[23px] py-[36px]">
      {/* Barra de Progresso Superior */}
      <div className="w-full flex flex-col items-center justify-center gap-[10px] py-5 px-[25px]">
        <div className="relative w-[325px] h-[41px]">
          {/* Texto e Porcentagem */}
          <span className="absolute left-0 top-[3px] text-[#64748B] font-roboto font-normal text-[15px] leading-[1.17em]">
            Conhecimento sobre você
          </span>
          <span className="absolute right-0 top-[3px] text-[#E6502C] font-roboto font-bold text-[10px] leading-[1.17em]">
            40%
          </span>
          {/* Barra de Progresso */}
          <div className="absolute left-0 top-[26px] w-full h-[4px] bg-[rgba(100,116,139,0.1)] rounded-[5px]">
            {/* 90px de 325px = ~27.7% */}
            <div 
              className="h-full bg-gradient-to-r from-[#FF896F] via-[#FF5F38] to-[#E6502C] rounded-[5px] transition-all duration-300"
              style={{ width: '27.7%' }}
            />
          </div>
        </div>
      </div>

      {/* Textos da Pergunta */}
      <div className="w-full flex flex-col items-center justify-center gap-[30px] py-[10px] px-[39px] h-[204px]">
        <h1 className="text-[36px] font-roboto-condensed font-bold text-[#FF5F38] leading-[1.17em] text-center">
          Qual é o ritmo<br />
          ideal das suas<br />
          viagens?
        </h1>
        <p className="text-[24px] font-roboto-condensed font-semibold text-[#64748B] leading-[1.17em]">
          Escolha a que melhor define
        </p>
      </div>

      {/* Opções de Ritmo */}
      <div className="w-full flex flex-col items-center justify-center gap-[17px] py-[21px] px-4 pb-[80px]">
        {options.map((option) => {
          const isSelected = selected === option.id;
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`
                relative w-[355px] h-[64px] rounded-[20px] border-[3px]
                transition-all duration-200 flex items-center
                ${isSelected
                  ? "bg-[#E6502C]/30 border-[#FF5F38] shadow-[2px_2px_9px_0px_rgba(255,95,56,1)]"
                  : "bg-white border-[#1E293B] hover:shadow-lg"
                }
              `}
            >
              {/* Badge de seleção no topo direito */}
              {isSelected && (
                <div className="absolute right-[8px] top-[8px] z-10">
                  <div className="w-[32px] h-[32px] rounded-full bg-[#E6502C] shadow-[0.6px_0.6px_4px_0px_rgba(230,80,44,1)] flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              )}

              {/* Container do Ícone e Textos */}
              <div className="flex items-center gap-4 pl-5 pr-12 flex-1">
                {/* Ícone */}
                <div className="flex items-center justify-center flex-shrink-0">
                  <Image
                    src={option.icon}
                    alt={option.label}
                    width={35}
                    height={37.5}
                    className={`object-contain transition-all duration-200`}
                    style={isSelected ? { 
                      filter: "invert(48%) sepia(79%) saturate(2476%) hue-rotate(346deg) brightness(118%) contrast(119%)"
                    } : {}}
                  />
                </div>

                {/* Textos */}
                <div className="flex flex-col">
                  <span className={`font-roboto-condensed font-bold text-[20px] leading-[1.17em] ${
                    isSelected ? "text-[#E6502C]" : "text-[#1E293B]"
                  }`}>
                    {option.label}
                  </span>
                  <span className={`font-roboto-condensed font-normal text-[15px] leading-[1.17em] ${
                    isSelected ? "text-[#E6502C]" : "text-[#1E293B]"
                  }`}>
                    {option.description}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Botão Flutuante - Círculo no canto direito */}
      {selected && (
        <NavigationButton
          onClick={handleContinue}
          variant="white-background"
        />
      )}
    </div>
  );
}

