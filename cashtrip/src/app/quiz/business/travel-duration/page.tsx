"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuiz } from "@/contexts/QuizContext";
import { NavigationButton } from "@/components/quiz/NavigationButton";
import { SelectionIcon } from "@/components/quiz/SelectionIcon";

type TravelDuration = "lightning" | "intensive-week" | "long-project" | "season" | null;

export default function QuizTravelDurationPage() {
  const router = useRouter();
  const { responses, saveResponse } = useQuiz();
  const [selected, setSelected] = useState<TravelDuration>(null);

  // Load existing response
  useEffect(() => {
    if (responses.travelDuration) {
      setSelected(responses.travelDuration as TravelDuration);
    } else {
      // Selecionar primeira opção por padrão
      setSelected("lightning");
    }
  }, [responses]);

  const handleSelect = (duration: TravelDuration) => {
    setSelected(duration);
  };

  const handleContinue = async () => {
    if (!selected) return;
    
    // Save to Supabase via Context
    await saveResponse("travelDuration", selected);
    
    // Redirect to next question
    router.push("/quiz/business/accommodation-budget");
  };

  const options = [
    {
      id: "lightning" as TravelDuration,
      label: "1-2 dias (relâmpago)"
    },
    {
      id: "intensive-week" as TravelDuration,
      label: "3-5 dias (semana intensa)"
    },
    {
      id: "long-project" as TravelDuration,
      label: "1 semana (projeto longo)"
    },
    {
      id: "season" as TravelDuration,
      label: "2+ semanas (Temporada)"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex flex-col gap-[10px] py-[27px] px-[6px]">
      {/* Container Principal */}
      <div className="w-full max-w-[375px] mx-auto flex flex-col items-center gap-[42px] px-4 py-[25px] pb-20">
        
        {/* Barra de Progresso Superior */}
        <div className="w-full flex flex-col items-center gap-[10px] py-5 px-[15px]">
          <div className="relative w-[325px] h-[41px]">
            {/* Texto e Porcentagem */}
            <span className="absolute left-0 top-[3px] text-[#64748B] font-roboto font-normal text-[15px] leading-[1.17em]">
              Conhecimento sobre você
            </span>
            <span className="absolute right-0 top-[3px] text-[#E6502C] font-roboto font-bold text-[10px] leading-[1.17em]">
              38%
            </span>
            {/* Barra de Progresso */}
            <div className="absolute left-0 top-[26px] w-full h-[4px] bg-[rgba(100,116,139,0.1)] rounded-[5px]">
              <div 
                className="h-full bg-gradient-to-r from-[#FF896F] via-[#FF5F38] to-[#E6502C] rounded-[5px] transition-all duration-300"
                style={{ width: '38%' }}
              />
            </div>
          </div>
        </div>

        {/* Cabeçalho com Ícone e Título */}
        <div className="w-full flex flex-col items-center gap-[37px] px-[38px] py-[13px]">
          {/* Ícone de Relógio/Tempo */}
          <div className="w-[95px] h-[95px] flex items-center justify-center">
            <Image
              src="/icons/iconsquiznegocios/icon superior página duração típica das viagens.svg"
              alt="Duração típica das viagens"
              width={95}
              height={95}
              className="object-contain"
            />
          </div>

          {/* Título */}
          <h1 className="text-[32px] font-roboto-condensed font-black text-[#FF5F38] leading-[1.17em] text-center">
            Duração típica das<br />
            viagens
          </h1>
        </div>

        {/* Opções de Seleção */}
        <div className="w-full flex flex-col items-center gap-[17px]">
          {options.map((option) => {
            const isSelected = selected === option.id;
            
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`
                  relative w-full h-[64px] rounded-[20px] border-[3px]
                  flex items-center justify-between px-[11px] py-[9px]
                  transition-all duration-200
                  ${isSelected
                    ? "bg-[#E6502C]/30 border-[#FF5F38] shadow-[2px_2px_9px_0px_rgba(255,95,56,1)]"
                    : "bg-white border-[#64748B] hover:shadow-lg"
                  }
                `}
              >
                {/* Texto da Opção */}
                <div className="flex-1 flex items-center">
                  <span className={`
                    font-roboto-condensed font-medium text-[20px] leading-[1.17em]
                    ${isSelected ? "text-[#E6502C]" : "text-[#1E293B]"}
                  `}>
                    {option.label}
                  </span>
                </div>

                {/* Ícone de Seleção */}
                <div className="w-[52px] h-[47px] flex items-center justify-center">
                  <SelectionIcon isSelected={isSelected} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Botão de Navegação Flutuante */}
      {selected && (
        <NavigationButton
          onClick={handleContinue}
          variant="white-background"
        />
      )}
    </div>
  );
}

