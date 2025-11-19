"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { QUIZ_ICONS } from "@/lib/quiz-icons";
import { NavigationButton } from "@/components/quiz/NavigationButton";
import { SelectionIcon } from "@/components/quiz/SelectionIcon";
import { useQuiz } from "@/contexts/QuizContext";

type TravelerType = "adventurer" | "cultural" | "relax" | "luxury" | "economic" | "balanced" | "gastronomic";

export default function QuizTravelerTypePage() {
  const router = useRouter();
  const { responses, saveResponse } = useQuiz();
  const [selected, setSelected] = useState<TravelerType[]>([]);

  // Load existing response
  useEffect(() => {
    if (responses.travelerType) {
      setSelected(responses.travelerType as TravelerType[]);
    }
  }, [responses]);

  const handleToggle = (type: TravelerType) => {
    if (selected.includes(type)) {
      // Remove se já estiver selecionado
      setSelected(selected.filter(t => t !== type));
    } else if (selected.length < 2) {
      // Adiciona se ainda não atingiu o limite de 2
      setSelected([...selected, type]);
    } else {
      // Se já tem 2, substitui o primeiro pela nova seleção
      setSelected([selected[1], type]);
    }
  };

  const handleContinue = async () => {
    if (selected.length === 0) return;
    
    // Save to Supabase via Context
    await saveResponse("travelerType", selected);
    
    // Redirect to next question
    router.push("/quiz/travel-pace");
  };

  const options = [
    { 
      id: "adventurer" as TravelerType, 
      label: "Aventureiro",
      icon: `/icons/${QUIZ_ICONS.estiloViagem.aventureiro}.svg`
    },
    { 
      id: "cultural" as TravelerType, 
      label: "Cultural",
      icon: `/icons/${QUIZ_ICONS.estiloViagem.cultural}.svg`
    },
    { 
      id: "relax" as TravelerType, 
      label: "Relax",
      icon: `/icons/${QUIZ_ICONS.estiloViagem.relax}.svg`
    },
    { 
      id: "luxury" as TravelerType, 
      label: "Luxo",
      icon: `/icons/${QUIZ_ICONS.estiloViagem.luxo}.svg`
    },
    { 
      id: "economic" as TravelerType, 
      label: "Econômico",
      icon: `/icons/${QUIZ_ICONS.estiloViagem.economico}.svg`
    },
    { 
      id: "balanced" as TravelerType, 
      label: "Equilibrado",
      icon: `/icons/${QUIZ_ICONS.estiloViagem.equilibrado}.svg`
    },
  ];

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex flex-col gap-[11px] py-[36px]">
      {/* Barra de Progresso Superior */}
      <div className="w-full flex flex-col items-center justify-center gap-[10px] py-5 px-[25px]">
        <div className="relative w-[325px] h-[41px]">
          {/* Texto e Porcentagem */}
          <span className="absolute left-0 top-[3px] text-[#64748B] font-roboto font-normal text-[15px] leading-[1.17em]">
            Conhecimento sobre você
          </span>
          <span className="absolute right-0 top-[3px] text-[#E6502C] font-roboto font-bold text-[10px] leading-[1.17em]">
            10%
          </span>
          {/* Barra de Progresso */}
          <div className="absolute left-0 top-[26px] w-full h-[4px] bg-[rgba(100,116,139,0.1)] rounded-[5px]">
            <div 
              className="h-full bg-gradient-to-r from-[#FF896F] via-[#FF5F38] to-[#E6502C] rounded-[5px] transition-all duration-300"
              style={{ width: '10%' }}
            />
          </div>
        </div>
      </div>

      {/* Textos da Pergunta */}
      <div className="w-full flex flex-col items-center justify-center gap-[30px] py-[10px] px-[39px]">
        <h1 className="text-[36px] font-roboto-condensed font-bold text-[#FF5F38] leading-[1.17em] text-center">
          Qual tipo de viajante<br />
          você se considera?
        </h1>
        <p className="text-[24px] font-roboto-condensed font-semibold text-[#64748B] leading-[1.17em]">
          Escolha até 2:
        </p>
      </div>

      {/* Opções de Estilo */}
      <div className="w-full flex flex-col items-center justify-center gap-[17px] py-[21px] px-5 pb-20">
        {options.map((option) => {
          const isSelected = selected.includes(option.id);
          return (
            <button
              key={option.id}
              onClick={() => handleToggle(option.id)}
              className={`
                relative w-[355px] h-[64px] rounded-[20px] border-[3px]
                transition-all duration-200 flex items-center
                ${isSelected
                  ? "bg-[#E6502C]/30 border-[#E6502C] shadow-[2px_2px_9px_0px_rgba(255,95,56,1)]"
                  : "bg-white border-[#1E293B] hover:shadow-lg"
                }
              `}
            >
              {/* Ícone de Seleção */}
              <div className="absolute right-[8px] top-[8px] z-10">
                <SelectionIcon isSelected={isSelected} />
              </div>

              {/* Container do Ícone e Texto */}
              <div className="flex items-center gap-4 pl-5 pr-12 flex-1">
                {/* Ícone */}
                <div className="flex items-center justify-center flex-shrink-0">
                  <Image
                    src={option.icon}
                    alt={option.label}
                    width={35}
                    height={37.5}
                    className={`object-contain transition-all duration-200 ${
                      isSelected ? "brightness-0 saturate-100" : ""
                    }`}
                    style={isSelected ? { filter: "invert(48%) sepia(79%) saturate(2476%) hue-rotate(346deg) brightness(118%) contrast(119%)" } : {}}
                  />
                </div>

                {/* Texto */}
                <span className={`font-roboto-condensed font-bold text-[20px] ${
                  isSelected ? "text-[#E6502C]" : "text-[#1E293B]"
                }`}>
                  {option.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Botão Flutuante - Círculo no canto direito */}
      {selected.length > 0 && (
        <NavigationButton
          onClick={handleContinue}
          variant="white-background"
        />
      )}
    </div>
  );
}

