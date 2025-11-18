"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuiz } from "@/contexts/QuizContext";
import { NavigationButton } from "@/components/quiz/NavigationButton";
import { SelectionIcon } from "@/components/quiz/SelectionIcon";

type TravelFrequency = "occasional" | "regular" | "frequent" | "road-warrior" | null;

export default function QuizTravelFrequencyPage() {
  const router = useRouter();
  const { responses, saveResponse } = useQuiz();
  const [selected, setSelected] = useState<TravelFrequency>(null);

  // Load existing response
  useEffect(() => {
    if (responses.travelFrequency) {
      setSelected(responses.travelFrequency as TravelFrequency);
    } else {
      // Selecionar primeira opção por padrão
      setSelected("occasional");
    }
  }, [responses]);

  const handleSelect = (frequency: TravelFrequency) => {
    setSelected(frequency);
  };

  const handleContinue = async () => {
    if (!selected) return;
    
    // Save to Supabase via Context
    await saveResponse("travelFrequency", selected);
    
    // Redirect to next question
    router.push("/quiz/business/travel-duration");
  };

  const options = [
    {
      id: "occasional" as TravelFrequency,
      label: "1-2 vezes/ano (ocasional)"
    },
    {
      id: "regular" as TravelFrequency,
      label: "3-6 vezes/ano (regular)"
    },
    {
      id: "frequent" as TravelFrequency,
      label: "7+ vezes/ano (frequente)"
    },
    {
      id: "road-warrior" as TravelFrequency,
      label: "Mensal+ (Road warrior)"
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

        {/* Cabeçalho com Ícone e Título */}
        <div className="w-full flex flex-col items-center gap-[37px] px-[38px] py-[13px]">
          {/* Ícone de Calendário */}
          <div className="w-[95px] h-[95px] flex items-center justify-center">
            <Image
              src="/icons/iconsquiznegocios/icone superior página frequência de viagens corportativas.svg"
              alt="Frequência de viagens corporativas"
              width={95}
              height={95}
              className="object-contain"
            />
          </div>

          {/* Título */}
          <h1 className="text-[32px] font-roboto-condensed font-black text-[#FF5F38] leading-[1.17em] text-center">
            Frequência de<br />
            viagens corporativas
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

