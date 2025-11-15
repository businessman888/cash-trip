"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SelectionIcon } from "@/components/quiz/SelectionIcon";
import { NavigationButton } from "@/components/quiz/NavigationButton";

type AccommodationType = "airbnb" | "hotel" | "resort" | "hostel";

export default function AccommodationTypePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<AccommodationType[]>([]);

  const handleSelect = (type: AccommodationType) => {
    if (selected.includes(type)) {
      setSelected(selected.filter(t => t !== type));
    } else if (selected.length < 2) {
      setSelected([...selected, type]);
    }
  };

  const handleContinue = () => {
    if (selected.length === 0) return;
    
    localStorage.setItem("accommodationTypes", JSON.stringify(selected));
    router.push("/quiz/accommodation-location");
  };

  const options = [
    {
      id: "airbnb" as AccommodationType,
      title: "Airbnb/Casa",
      subtitle: "(privacidade, espaço)",
      image: "/illustrations/imagem-hospedagens-airbnb-casa.svg"
    },
    {
      id: "hotel" as AccommodationType,
      title: "Hotel",
      subtitle: "(Serviço completo,\n   comodidade)",
      image: "/illustrations/hospedagem-hotel.svg"
    },
    {
      id: "resort" as AccommodationType,
      title: "Resort/Boutique",
      subtitle: "(Luxo, exclusivo)",
      image: "/illustrations/hospedagem-Resort-boutique.svg"
    },
    {
      id: "hostel" as AccommodationType,
      title: "Hostel",
      subtitle: "(econômico, social)",
      image: "/illustrations/imagem-hospedagens-hostel.svg"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex flex-col gap-[21px] py-[48px]">
      {/* Barra de Progresso Superior - Nível 2 */}
      <div className="w-full flex flex-col items-center justify-center gap-[10px] py-[28px] px-[15px]">
        <div className="relative w-[345px] h-[41px]">
          {/* Textos */}
          <span className="absolute left-[1px] top-0 text-[#64748B] font-roboto font-normal text-[15px] leading-[1.17em]">
            Estadia ideal para você
          </span>
          <span className="absolute right-[18px] top-0 text-[#E6502C] font-roboto font-black text-[15px] leading-[1.17em]">
            10%
          </span>
          
          {/* Barra de Progresso - 10% */}
          <div className="absolute left-0 top-[31px] w-[322px] h-[4px] bg-[rgba(100,116,139,0.1)] rounded-[20px]">
            <div 
              className="h-full bg-[#E6502C] rounded-[20px] transition-all duration-300"
              style={{ width: '100px' }}
            />
          </div>
          
          {/* Ícone de Hotel */}
          <div className="absolute right-0 top-[22px] w-[18px] h-[18px]">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="18" height="18" rx="9" fill="#E6502C" fillOpacity="0.3"/>
              <path d="M4 8H14M4 8V14H14V8M4 8V4H14V8M7 11H11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Seção de Título e Ícone */}
      <div className="w-full flex flex-col items-center gap-[20px] py-[13px] px-[46px]">
        {/* Ícone Hospedagens */}
        <div className="w-[90px] h-[90px] flex items-center justify-center">
          <img 
            src="/icons/Icon-superior-página-quais-hospedagens-combinam-com-seu-estilo.svg" 
            alt="Ícone Quais hospedagens combinam com seu estilo"
            className="w-full h-full object-contain"
          />
        </div>

        <h1 className="text-[36px] font-roboto-condensed font-black text-[#FF5F38] leading-[1.17em] text-left">
          Quais hospedagens<br />
          combinam com<br />
          seu estilo?
        </h1>
        <p className="text-[24px] font-roboto-condensed font-semibold text-[#64748B] leading-[1.17em]">
          Escolha até 2:
        </p>
      </div>

      {/* Opções de Hospedagem */}
      <div className="w-full flex flex-col items-center gap-[15px] py-[26px] px-[16px] pb-24">
        {options.map((option, index) => {
          const isSelected = selected.includes(option.id);
          
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`
                relative w-[343px] h-[171px] flex items-center gap-[10px] rounded-[20px]
                transition-all duration-200
                ${isSelected
                  ? "bg-[#F1F1F1] shadow-[2px_2px_9px_0px_rgba(230,80,44,1)]"
                  : "bg-[#F1F1F1] shadow-[2px_2px_9px_0px_rgba(0,0,0,0.25)]"
                }
              `}
            >
              {/* Imagem à esquerda */}
              <div className="w-[139px] h-[171px] rounded-[20px_10px_10px_20px] overflow-hidden flex-shrink-0">
                <img 
                  src={option.image} 
                  alt={option.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Área de Texto e Check */}
              <div className="relative w-[186px] h-[151px]">
                {/* Check Badge - posicionado no topo direito */}
                <div className="absolute right-0 top-[4px] z-10">
                  <SelectionIcon isSelected={isSelected} />
                </div>

                {/* Textos */}
                <div className="absolute left-[-4px] top-[48px] w-[190px]">
                  <h3 className={`font-roboto-condensed font-semibold text-[24px] leading-[1.17em] text-center ${
                    isSelected ? "text-[#FF5F38]" : "text-[#1E293B]"
                  }`}>
                    {option.title}
                  </h3>
                  <p className={`font-roboto-condensed font-normal text-[16px] leading-[1.17em] text-center mt-[9px] whitespace-pre-line ${
                    isSelected ? "text-[#E6502C]" : "text-[#1E293B]"
                  }`}>
                    {option.subtitle}
                  </p>
                </div>
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

