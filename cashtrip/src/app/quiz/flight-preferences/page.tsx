"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NavigationButton } from "@/components/quiz/NavigationButton";
import { CheckIcon } from "@/components/quiz/CheckIcon";

type FlightPreference = "economy" | "business" | "firstClass" | "flexible";

export default function QuizFlightPreferencesPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<FlightPreference | null>(null);

  const handleSelect = (preference: FlightPreference) => {
    setSelected(preference);
  };

  const handleContinue = () => {
    if (!selected) return;

    localStorage.setItem("flightPreference", selected);
    router.push("/quiz/flight-connections");
  };

  const options = [
    {
      id: "economy" as FlightPreference,
      title: "Econômica",
      subtitle: "(melhor preço)",
      icon: "/icons/Icon-econômica.svg",
    },
    {
      id: "business" as FlightPreference,
      title: "Executiva",
      subtitle: "(Conforto vale a pena)",
      icon: "/icons/Icon-executiva.svg",
    },
    {
      id: "firstClass" as FlightPreference,
      title: "Primeira Classe",
      subtitle: null,
      icon: "/icons/Icon-primeira-classe.svg",
    },
    {
      id: "flexible" as FlightPreference,
      title: "Flexível",
      subtitle: "(Depende do preço)",
      icon: "/icons/Icon-Flexível.svg",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex flex-col py-[39px]">
      {/* Barra de Progresso - 60% */}
      <div className="w-full flex flex-col gap-[10px] px-[13px] h-[68px]">
        <div className="relative w-full h-[32px]">
          {/* Área da barra */}
          <div className="absolute left-0 top-[14px] w-[348px] h-[18px]">
            {/* Barra cinza de fundo */}
            <div className="absolute left-0 top-[9px] w-[322px] h-[4px] bg-[rgba(100,116,139,0.1)] rounded-[10px]" />
            
            {/* Barra de progresso laranja - 60% (240px) */}
            <div className="absolute left-0 top-[9px] w-[240px] h-[4px] bg-[#E6502C] rounded-[10px]" />
            
            {/* Ícone de carro */}
            <div className="absolute left-[330px] top-0 w-[18px] h-[18px]">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.74 6.29L9 0L17.26 6.29V18H0.74V6.29Z" fill="white"/>
              </svg>
            </div>
          </div>
          
          {/* Texto 60% */}
          <span className="absolute left-[295px] top-[3px] text-[#FF5F38] font-roboto font-black text-[14px] leading-[1.17em]">
            60%
          </span>
        </div>
      </div>

      {/* Título da Pergunta */}
      <div className="w-full flex flex-col items-center gap-[20px] py-[13px] px-[46px] h-[220px]">
        {/* Ícone Principal */}
        <div className="w-[90px] h-[90px]">
          <img
            src="/icons/Icon--superior-página-Preferências-de-voos.svg"
            alt="Preferências de voos"
            className="w-full h-full object-contain"
          />
        </div>

        <h1 className="text-[36px] font-roboto-condensed font-black text-[#FF5F38] leading-[1.17em] text-center">
          Preferência de<br />
          voos?
        </h1>
      </div>

      {/* Opções de Voos */}
      <div className="w-full flex flex-col gap-[10px] px-0 pb-[80px] pt-[8px] h-[518px]">
        {[0, 2].map((startIndex, lineIndex) => (
          <div key={lineIndex} className="flex justify-center items-center gap-[10px] py-[5px] px-[17px]">
            {options.slice(startIndex, startIndex + 2).map((option) => {
              const isSelected = selected === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`
                    relative w-[157px] h-[200px] rounded-[15px] border-[3px] flex flex-col items-center
                    transition-all duration-200
                    ${isSelected
                      ? "bg-[rgba(230,80,44,0.3)] border-[#E6502C]"
                      : "bg-white border-[#1E293B] hover:shadow-lg"
                    }
                  `}
                >
                  {/* Check Badge */}
                  <div className="absolute right-[11px] top-[13px] z-10">
                    <CheckIcon isSelected={isSelected} />
                  </div>

                  {/* Ícone */}
                  <div className="absolute left-[11px] top-[64px] w-[137px] h-[70px] flex items-center justify-center">
                    <div className="w-[70px] h-[70px]">
                      <img
                        src={option.icon}
                        alt={option.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Título e Subtítulo */}
                  <div className="absolute left-[11px] top-[140px] w-[137px] h-[52px]">
                    <h3 className={`font-roboto-condensed font-bold text-[20px] leading-[1.17em] text-left ${
                      isSelected ? "text-[#E6502C]" : "text-[#1E293B]"
                    }`}>
                      {option.title}
                    </h3>
                    {option.subtitle && (
                      <p className={`font-roboto-condensed font-normal text-[12px] leading-[1.17em] text-left ${
                        isSelected ? "text-[#E6502C]" : "text-[#1E293B]"
                      }`}>
                        {option.subtitle}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
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

