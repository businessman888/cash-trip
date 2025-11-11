"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { QUIZ_ICONS } from "@/lib/quiz-icons";

type TravelerType = "adventurer" | "cultural" | "relax" | "luxury" | "economic" | "balanced" | "gastronomic";

export default function QuizTravelerTypePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<TravelerType[]>([]);

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

  const handleContinue = () => {
    if (selected.length === 0) return;
    
    // Salvar escolhas (localStorage temporário, depois Supabase)
    localStorage.setItem("travelerType", JSON.stringify(selected));
    
    // Redirecionar para próxima pergunta do quiz
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
      <div className="w-full flex flex-col items-center justify-center gap-[12px] py-[21px] px-5 pb-20">
        {options.map((option) => {
          const isSelected = selected.includes(option.id);
          return (
            <button
              key={option.id}
              onClick={() => handleToggle(option.id)}
              className={`
                relative w-[334px] h-[172px] rounded-[20px] border-[3px]
                transition-all duration-200
                ${isSelected
                  ? "bg-[#E6502C]/30 border-[#E6502C] shadow-[2px_2px_9px_0px_rgba(255,95,56,1)]"
                  : "bg-white border-[#1E293B] hover:shadow-lg"
                }
              `}
            >
              {/* Área do Ícone */}
              <div className="absolute left-[18px] top-[63px] w-[297px] h-[90px] flex items-center justify-center">
                <Image
                  src={option.icon}
                  alt={option.label}
                  width={80}
                  height={80}
                  className={`object-contain transition-all duration-200 ${
                    isSelected ? "brightness-0 saturate-100" : ""
                  }`}
                  style={isSelected ? { filter: "invert(48%) sepia(79%) saturate(2476%) hue-rotate(346deg) brightness(118%) contrast(119%)" } : {}}
                />
              </div>

              {/* Área do Texto */}
              <div className="absolute left-[7px] top-[6px] w-[320px] h-[47px] flex items-center justify-center">
                <span className={`font-roboto-condensed font-bold text-[24px] ${
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
        <button
          onClick={handleContinue}
          className="fixed bottom-4 right-4 w-20 h-20 rounded-full bg-gradient-to-b from-[#FF896F] via-[#FF5F38] to-[#E6502C] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center hover:scale-110 transition-transform cursor-pointer z-50"
        >
          <svg width="32" height="28" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 4L28 14M28 14L18 24M28 14H4" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}

