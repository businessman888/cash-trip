"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckIcon } from "@/components/quiz/CheckIcon";
import { NavigationButton } from "@/components/quiz/NavigationButton";

type PhraseType = "culturalImmersion" | "exploreRegion" | "enjoyAccommodation";

export default function QuizDefiningPhrasesPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<PhraseType | null>(null);

  const handleSelect = (type: PhraseType) => {
    setSelected(type);
  };

  const handleContinue = () => {
    if (!selected) return;
    
    localStorage.setItem("definingPhrase", selected);
    router.push("/quiz/transition-accommodation");
  };

  const options = [
    { 
      id: "culturalImmersion" as PhraseType, 
      text: '"Gosto de mergulhar\nna cultura local"',
      tailPosition: "left" as const
    },
    { 
      id: "exploreRegion" as PhraseType, 
      text: '"Gosto de explorar\ntoda a região"',
      tailPosition: "right" as const
    },
    { 
      id: "enjoyAccommodation" as PhraseType, 
      text: '"Gosto de aproveitar\na hospedagem"',
      tailPosition: "left" as const
    },
  ];

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex flex-col gap-[25px] py-[36px]">
      {/* Barra de Progresso Superior */}
      <div className="w-full flex flex-col items-center justify-center gap-[10px] py-5 px-[25px]">
        <div className="relative w-[325px] h-[41px]">
          <span className="absolute left-0 top-[3px] text-[#64748B] font-roboto font-normal text-[15px] leading-[1.17em]">
            Conhecimento sobre você
          </span>
          <span className="absolute right-[0px] top-[3px] text-[#E6502C] font-roboto font-bold text-[10px] leading-[1.17em]">
            100%
          </span>
          {/* Barra de Progresso - 100% completa */}
          <div className="absolute left-0 top-[26px] w-full h-[4px] bg-[rgba(100,116,139,0.1)] rounded-[5px]">
            <div 
              className="h-full bg-gradient-to-r from-[#FF896F] to-[#FF5F38] rounded-[5px] transition-all duration-300"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* Textos da Pergunta */}
      <div className="w-full flex flex-col items-center justify-center gap-[20px] py-[5px] px-[39px]">
        {/* Ícone de Aspas */}
        <div className="w-[90px] h-[90px] flex items-center justify-center">
          <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.21 25.71C3.21 25.71 8.93 18.21 18.21 18.21V38.57C10.18 38.57 3.21 45.54 3.21 53.57V64.29H28.93V25.71H3.21ZM57.86 25.71C57.86 25.71 63.58 18.21 72.86 18.21V38.57C64.83 38.57 57.86 45.54 57.86 53.57V64.29H83.58V25.71H57.86Z" stroke="#E6502C" strokeWidth="3" fill="white"/>
          </svg>
        </div>

        <h1 className="text-[36px] font-roboto-condensed font-bold text-[#FF5F38] leading-[1.17em] text-center">
          Qual dessas frases<br />
          mais define você?
        </h1>
        <p className="text-[24px] font-roboto-condensed font-semibold text-[#64748B] leading-[1.17em]">
          Escolha a melhor opção:
        </p>
      </div>

      {/* Opções de Frases - Layout Irregular com Balões de Fala */}
      <div className="w-full flex flex-col gap-[10px] px-[10px] pb-20">
        {/* Primeira linha: Balão à esquerda */}
        <div className="flex justify-start gap-[10px] px-[5px]">
          <div className="relative">
            <button
              onClick={() => handleSelect(options[0].id)}
              className={`
                relative w-[234px] h-[142px] border-[3px]
                flex items-center justify-center
                transition-all duration-200
                ${selected === options[0].id
                  ? "bg-[rgba(230,80,44,0.3)] border-[#FF5F38] shadow-[1px_1px_9px_0px_rgba(255,95,56,1)]"
                  : "bg-white border-[#1E293B] shadow-[1px_1px_9px_0px_rgba(0,0,0,0.25)]"
                }
              `}
              style={{
                borderRadius: selected === options[0].id 
                  ? "30px 40px 50px 5px" 
                  : "30px 40px 50px 5px"
              }}
            >
              {/* Check Badge */}
              <div className="absolute right-[10px] top-[16px] z-10">
                <CheckIcon isSelected={selected === options[0].id} />
              </div>
              
              {/* Texto */}
              <div className="w-full flex items-center justify-center pl-4 pr-[60px] py-2">
                <p className={`w-full font-roboto font-bold text-[20px] leading-[1.17em] whitespace-pre-line text-center ${
                  selected === options[0].id ? "text-[#E6502C]" : "text-[#1E293B]"
                }`}>
                  {options[0].text}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Segunda linha: Balão à direita */}
        <div className="flex justify-end gap-[10px] px-[5px]">
          <div className="relative">
            <button
              onClick={() => handleSelect(options[1].id)}
              className={`
                relative w-[234px] h-[142px] border-[3px]
                flex items-center justify-center
                transition-all duration-200
                ${selected === options[1].id
                  ? "bg-[rgba(230,80,44,0.3)] border-[#FF5F38] shadow-[1px_1px_9px_0px_rgba(255,95,56,1)]"
                  : "bg-white border-[#1E293B] shadow-[1px_1px_9px_0px_rgba(0,0,0,0.25)]"
                }
              `}
              style={{
                borderRadius: selected === options[1].id 
                  ? "40px 30px 5px 50px" 
                  : "40px 30px 5px 50px"
              }}
            >
              {/* Check Badge */}
              <div className="absolute left-[10px] top-[16px] z-10">
                <CheckIcon isSelected={selected === options[1].id} />
              </div>
              
              {/* Texto */}
              <div className="w-full flex items-center justify-center pr-4 pl-[60px] py-2">
                <p className={`w-full font-roboto font-bold text-[20px] leading-[1.17em] whitespace-pre-line text-center ${
                  selected === options[1].id ? "text-[#E6502C]" : "text-[#1E293B]"
                }`}>
                  {options[1].text}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Terceira linha: Balão à esquerda */}
        <div className="flex justify-start gap-[10px] px-[5px]">
          <div className="relative">
            <button
              onClick={() => handleSelect(options[2].id)}
              className={`
                relative w-[234px] h-[142px] border-[3px]
                flex items-center justify-center
                transition-all duration-200
                ${selected === options[2].id
                  ? "bg-[rgba(230,80,44,0.3)] border-[#FF5F38] shadow-[1px_1px_9px_0px_rgba(255,95,56,1)]"
                  : "bg-white border-[#1E293B] shadow-[1px_1px_9px_0px_rgba(0,0,0,0.25)]"
                }
              `}
              style={{
                borderRadius: selected === options[2].id 
                  ? "30px 40px 50px 5px" 
                  : "30px 40px 50px 5px"
              }}
            >
              {/* Check Badge */}
              <div className="absolute right-[10px] top-[16px] z-10">
                <CheckIcon isSelected={selected === options[2].id} />
              </div>
              
              {/* Texto */}
              <div className="w-full flex items-center justify-center pl-4 pr-[60px] py-2">
                <p className={`w-full font-roboto font-bold text-[20px] leading-[1.17em] whitespace-pre-line text-center ${
                  selected === options[2].id ? "text-[#E6502C]" : "text-[#1E293B]"
                }`}>
                  {options[2].text}
                </p>
              </div>
            </button>
          </div>
        </div>
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

