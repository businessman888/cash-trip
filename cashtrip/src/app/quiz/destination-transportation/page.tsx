"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NavigationButton } from "@/components/quiz/NavigationButton";
import { CheckIcon } from "@/components/quiz/CheckIcon";

type TransportationType = "rentalCar" | "uberTaxi" | "public" | "bikeScooter" | "walking" | "boat";

export default function QuizDestinationTransportationPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<TransportationType[]>([]);

  const handleSelect = (type: TransportationType) => {
    if (selected.includes(type)) {
      setSelected(selected.filter((item) => item !== type));
    } else if (selected.length < 2) {
      setSelected([...selected, type]);
    }
  };

  const handleContinue = () => {
    if (selected.length === 0) return;

    localStorage.setItem("destinationTransportation", JSON.stringify(selected));
    router.push("/quiz/flight-preferences");
  };

  const options = [
    {
      id: "rentalCar" as TransportationType,
      title: "Carro alugado",
      subtitle: "(liberdade)",
      icon: "/icons/Icon-carro-alugado.svg",
    },
    {
      id: "uberTaxi" as TransportationType,
      title: "Uber/Taxi",
      subtitle: "(praticidade)",
      icon: "/icons/Icon-Uber-taxi.svg",
    },
    {
      id: "public" as TransportationType,
      title: "público",
      subtitle: "(econômico)",
      icon: "/icons/Icon-publico.svg",
    },
    {
      id: "bikeScooter" as TransportationType,
      title: "Bike/Patinete",
      subtitle: "(ativo, sustentável)",
      icon: "/icons/Icon-bike-patinete.svg",
    },
    {
      id: "walking" as TransportationType,
      title: "A pé",
      subtitle: "(destinos pequenos)",
      icon: "/icons/Icon-A-pé.svg",
    },
    {
      id: "boat" as TransportationType,
      title: "Barco",
      subtitle: "(destinos costeiros/ilhas)",
      icon: "/icons/Icon-Barco.svg",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex flex-col gap-[20px] py-[52px]">
      {/* Barra de Progresso - 30% */}
      <div className="w-full flex flex-col gap-[10px] px-[13px]">
        <div className="relative w-full h-[32px]">
          {/* Área da barra */}
          <div className="absolute left-0 top-[14px] w-[348px] h-[18px]">
            {/* Barra cinza de fundo */}
            <div className="absolute left-0 top-[9px] w-[322px] h-[4px] bg-[rgba(100,116,139,0.1)] rounded-[10px]" />
            
            {/* Barra de progresso laranja - 30% (120px) */}
            <div className="absolute left-0 top-[9px] w-[120px] h-[4px] bg-[#E6502C] rounded-[10px]" />
            
            {/* Ícone de carro */}
            <div className="absolute left-[330px] top-0 w-[18px] h-[18px]">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.74 6.29L9 0L17.26 6.29V18H0.74V6.29Z" fill="white"/>
              </svg>
            </div>
          </div>
          
          {/* Texto 30% */}
          <span className="absolute left-[295px] top-[3px] text-[#FF5F38] font-roboto font-black text-[14px] leading-[1.17em]">
            30%
          </span>
        </div>
      </div>

      {/* Título da Pergunta */}
      <div className="w-full flex flex-col items-center gap-[20px] py-[13px] px-[46px]">
        {/* Ícone Principal */}
        <div className="w-[90px] h-[90px]">
          <img
            src="/icons/Icon-superior-página-locomoção-no-destino.svg"
            alt="Locomoção no destino"
            className="w-full h-full object-contain"
          />
        </div>

        <h1 className="text-[36px] font-roboto-condensed font-black text-[#FF5F38] leading-[1.17em] text-center">
          Locomoção no<br />
          destino:
        </h1>
      </div>

      {/* Opções de Locomoção */}
      <div className="w-full flex flex-col gap-[10px] px-0 pb-[80px] pt-[8px]">
        {[0, 2, 4].map((startIndex, lineIndex) => (
          <div key={lineIndex} className="flex justify-center items-center gap-[10px] py-[5px] px-[17px]">
            {options.slice(startIndex, startIndex + 2).map((option) => {
              const isSelected = selected.includes(option.id);
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
      {selected.length > 0 && (
        <NavigationButton
          onClick={handleContinue}
          variant="white-background"
        />
      )}
    </div>
  );
}

