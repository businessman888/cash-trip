"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuiz } from "@/contexts/QuizContext";
import { NavigationButton } from "@/components/quiz/NavigationButton";
import { SelectionIcon } from "@/components/quiz/SelectionIcon";

type PostWork = "work_only" | "gym" | "drinks_networking" | "explore" | null;

export default function QuizPostWorkPage() {
  const router = useRouter();
  const { responses, saveResponse } = useQuiz();
  const [selected, setSelected] = useState<PostWork>(null);

  // Load existing response
  useEffect(() => {
    if (responses.postWork) {
      setSelected(responses.postWork as PostWork);
    } else {
      // Selecionar primeira opção por padrão
      setSelected("work_only");
    }
  }, [responses]);

  const handleSelect = (postWork: PostWork) => {
    setSelected(postWork);
  };

  const handleContinue = async () => {
    if (!selected) return;
    
    // Save to Supabase via Context
    await saveResponse("postWork", selected);
    
    // Redirect to analyzing page
    router.push("/quiz/business/analyzing");
  };

  const options = [
    {
      id: "work_only" as PostWork,
      label: "Só trabalho",
      sublabel: "(maximizar eficiência)",
      iconSrc: "/icons/iconsquiznegocios/Icon página pós trabalho alternativa só trabalho.svg"
    },
    {
      id: "gym" as PostWork,
      label: "Academia/corrida",
      sublabel: "(manter rotina fitness)",
      iconSrc: "/icons/iconsquiznegocios/Icon página pós trabalho alternativa academia corrida.svg"
    },
    {
      id: "drinks_networking" as PostWork,
      label: "Drinks/networking",
      sublabel: "(socializar com clientes)",
      iconSrc: "/icons/iconsquiznegocios/icon página pós trabalho alternativa drinksNetworking.svg"
    },
    {
      id: "explore" as PostWork,
      label: "Aproveitar destino",
      sublabel: "(1-2 atrações se der tempo)",
      iconSrc: "/icons/iconsquiznegocios/Icon página pós trabalho alternativa aproveitar destino.svg"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex flex-col gap-[27px] py-[49px] px-[10px]">
      {/* Container Principal */}
      <div className="w-full max-w-[375px] mx-auto flex flex-col items-center gap-[42px] px-4 pb-20">
        
        {/* Barra de Progresso Superior */}
        <div className="w-full flex flex-col items-center gap-[10px] py-5 px-[15px]">
          <div className="relative w-[325px] h-[41px]">
            {/* Texto e Porcentagem */}
            <span className="absolute left-0 top-[3px] text-[#64748B] font-roboto font-normal text-[15px] leading-[1.17em]">
              Conhecimento sobre você
            </span>
            <span className="absolute right-0 top-[3px] text-[#E6502C] font-roboto font-bold text-[10px] leading-[1.17em]">
              90%
            </span>
            {/* Barra de Progresso */}
            <div className="absolute left-0 top-[26px] w-full h-[4px] bg-[rgba(100,116,139,0.1)] rounded-[5px]">
              <div 
                className="h-full bg-gradient-to-r from-[#FF896F] via-[#FF5F38] to-[#E6502C] rounded-[5px] transition-all duration-300"
                style={{ width: '90%' }}
              />
            </div>
          </div>
        </div>

        {/* Cabeçalho com Ícone e Título */}
        <div className="w-full flex flex-col items-center gap-[37px] px-[38px] py-[13px]">
          {/* Ícone de Pós-trabalho */}
          <div className="w-[95px] h-[95px] flex items-center justify-center">
            <Image
              src="/icons/iconsquiznegocios/icon superior página  pós trabalho.svg"
              alt="Pós-trabalho"
              width={95}
              height={95}
              className="object-contain"
            />
          </div>

          {/* Título */}
          <h1 className="text-[32px] font-roboto-condensed font-black text-[#FF5F38] leading-[1.17em] text-center">
            Pós-trabalho
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
                  relative w-full h-[64px] rounded-[20px] border-[2px]
                  flex items-center justify-between px-[11px] py-[9px]
                  transition-all duration-200
                  ${isSelected
                    ? "bg-[rgba(255,95,56,0.25)] border-[#FF5F38] shadow-[2px_2px_9px_0px_rgba(255,95,56,1)]"
                    : "bg-white border-[#64748B] hover:shadow-lg"
                  }
                `}
              >
                {/* Ícone e Texto */}
                <div className="flex items-center gap-[15px] flex-1">
                  {/* Ícone */}
                  <div className="w-[40px] h-[40px] flex items-center justify-center flex-shrink-0">
                    <Image
                      src={option.iconSrc}
                      alt={option.label}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  
                  {/* Texto */}
                  <div className="flex flex-col items-start">
                    <span className={`
                      font-roboto-condensed font-medium text-[20px] leading-[1.17em]
                      ${isSelected ? "text-[#E6502C]" : "text-[#1E293B]"}
                    `}>
                      {option.label}
                    </span>
                    {option.sublabel && (
                      <span className={`
                        font-roboto-condensed font-medium text-[16px] leading-[1.17em]
                        ${isSelected ? "text-[#E6502C]" : "text-[#1E293B]"}
                      `}>
                        {option.sublabel}
                      </span>
                    )}
                  </div>
                </div>

                {/* Ícone de Seleção */}
                <div className="w-[52px] h-[47px] flex items-center justify-center flex-shrink-0">
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

