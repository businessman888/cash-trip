"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NavigationButton } from "@/components/quiz/NavigationButton";
import { SelectionIcon } from "@/components/quiz/SelectionIcon";

type LocationType = "downtown" | "beach" | "nature" | "publicTransport" | "touristSpots" | "flexible";

export default function AccommodationLocationPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<LocationType[]>([]);

  const handleSelect = (type: LocationType) => {
    if (selected.includes(type)) {
      setSelected(selected.filter(t => t !== type));
    } else if (selected.length < 2) {
      setSelected([...selected, type]);
    }
  };

  const handleContinue = () => {
    if (selected.length === 0) return;
    
    localStorage.setItem("accommodationLocation", JSON.stringify(selected));
    router.push("/quiz/accommodation-essentials");
  };

  const options = [
    {
      id: "downtown" as LocationType,
      title: "Centro urbano",
      subtitle: "(perto de tudo)",
      icon: "/icons/Icon-centro-urbano.svg"
    },
    {
      id: "beach" as LocationType,
      title: "Beira-mar/Praia",
      subtitle: null,
      icon: "/icons/Icon-beira-mar-praia.svg"
    },
    {
      id: "nature" as LocationType,
      title: "Natureza/\nMontanhas",
      subtitle: "(isolado)",
      icon: "/icons/Icon-natureza-montanhas.svg"
    },
    {
      id: "publicTransport" as LocationType,
      title: "Perto\nde transporte\npúblico",
      subtitle: null,
      icon: "/icons/Icon-perto-de-transporte-público.svg"
    },
    {
      id: "touristSpots" as LocationType,
      title: "Perto de pontos\nturísticos",
      subtitle: null,
      icon: "/icons/Icon-Perto-de-pontos-turísticos.svg"
    },
    {
      id: "flexible" as LocationType,
      title: "Flexível",
      subtitle: "(custo-benefício)",
      icon: "/icons/Icon-Flexível.svg"
    }
  ];


  return (
    <div className="min-h-screen bg-[#F1F1F1] flex flex-col gap-[21px] py-[48px]">
      {/* Barra de Progresso - 60% */}
      <div className="w-full flex flex-col items-center justify-center gap-[10px] py-[28px] px-[15px] h-[97px]">
        <div className="relative w-[345px] h-[41px]">
          <span className="absolute left-[1px] top-0 text-[#64748B] font-roboto font-normal text-[15px] leading-[1.17em]">
            Estadia ideal para você
          </span>
          <span className="absolute right-[18px] top-0 text-[#E6502C] font-roboto font-black text-[15px] leading-[1.17em]">
            60%
          </span>
          
          <div className="absolute left-0 top-[31px] w-[322px] h-[4px] bg-[rgba(100,116,139,0.1)] rounded-[20px]">
            <div 
              className="h-full bg-[#E6502C] rounded-[20px] transition-all duration-300"
              style={{ width: '190px' }}
            />
          </div>
          
          <div className="absolute right-0 top-[22px] w-[18px] h-[18px]">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="18" height="18" rx="9" fill="#FF896F"/>
              <path d="M4 8H14M4 8V14H14V8M4 8V4H14V8M7 11H11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Seção de Título */}
      <div className="w-full flex flex-col items-center gap-[20px] py-[13px] px-[46px] h-[310px]">
        <div className="w-[90px] h-[90px] flex items-center justify-center">
          <img 
            src="/icons/Icon-superior-página-qual-a-localização-ideal-da-hospedagem.svg" 
            alt="Ícone Qual localização ideal da hospedagem"
            className="w-full h-full object-contain"
          />
        </div>

        <h1 className="text-[36px] font-roboto-condensed font-black text-[#FF5F38] leading-[1.17em] text-left">
          Qual localização<br />
          ideal da<br />
          hospedagem?
        </h1>
        <p className="text-[24px] font-roboto-condensed font-semibold text-[#64748B] leading-[1.17em]">
          Escolha até 2:
        </p>
      </div>

      {/* Grid de Opções - 2x3 */}
      <div className="w-full flex flex-col gap-[5px]">
        {/* Linha 1 */}
        <div className="flex justify-center items-center px-[22px] gap-[10px]">
          {options.slice(0, 2).map((option) => {
            const isSelected = selected.includes(option.id);
            
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`
                  relative w-[156px] h-[227px] rounded-[15px] border-[3px] transition-all duration-200
                  ${isSelected
                    ? "bg-[rgba(230,80,44,0.3)] border-[#E6502C]"
                    : "bg-transparent border-[#1E293B]"
                  }
                `}
              >
                {/* Check Badge */}
                <div className="absolute right-[2px] top-[10px] z-10">
                  <SelectionIcon isSelected={isSelected} />
                </div>

                {/* Ícone */}
                <div className="absolute left-[43px] top-[63px] w-[70px] h-[70px]">
                  <img 
                    src={option.icon} 
                    alt={option.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Título */}
                <h3 className={`absolute left-[21px] top-[147px] w-[114px] font-roboto-condensed font-bold text-[20px] leading-[1.17em] text-center whitespace-pre-line ${
                  isSelected ? "text-[#E6502C]" : "text-[#1E293B]"
                }`}>
                  {option.title}
                </h3>

                {/* Subtítulo */}
                {option.subtitle && (
                  <p className={`absolute left-[33px] top-[175px] w-[89px] font-roboto-condensed font-normal text-[15px] leading-[1.17em] text-center ${
                    isSelected ? "text-[#E6502C]" : "text-[#1E293B]"
                  }`}>
                    {option.subtitle}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Linha 2 */}
        <div className="flex justify-center items-center px-[22px] gap-[10px]">
          {options.slice(2, 4).map((option) => {
            const isSelected = selected.includes(option.id);
            
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`
                  relative w-[156px] h-[227px] rounded-[15px] border-[3px] transition-all duration-200
                  ${isSelected
                    ? "bg-[rgba(230,80,44,0.3)] border-[#E6502C]"
                    : "bg-transparent border-[#1E293B]"
                  }
                `}
              >
                {/* Check Badge */}
                <div className="absolute right-[2px] top-[10px] z-10">
                  <SelectionIcon isSelected={isSelected} />
                </div>

                <div className="absolute left-[43px] top-[63px] w-[70px] h-[70px]">
                  <img 
                    src={option.icon} 
                    alt={option.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                <h3 className={`absolute left-[24px] top-[138px] w-[108px] font-roboto-condensed font-bold text-[20px] leading-[1.17em] text-center whitespace-pre-line ${
                  isSelected ? "text-[#E6502C]" : "text-[#1E293B]"
                }`}>
                  {option.title}
                </h3>

                {option.subtitle && (
                  <p className={`absolute left-[51px] top-[189px] w-[53px] font-roboto-condensed font-normal text-[15px] leading-[1.17em] text-center ${
                    isSelected ? "text-[#E6502C]" : "text-[#1E293B]"
                  }`}>
                    {option.subtitle}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Linha 3 */}
        <div className="flex justify-center items-center px-[22px] gap-[10px] pb-24">
          {options.slice(4, 6).map((option) => {
            const isSelected = selected.includes(option.id);
            
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`
                  relative w-[156px] h-[227px] rounded-[15px] border-[3px] transition-all duration-200
                  ${isSelected
                    ? "bg-[rgba(230,80,44,0.3)] border-[#E6502C]"
                    : "bg-transparent border-[#1E293B]"
                  }
                `}
              >
                {/* Check Badge */}
                <div className="absolute right-[2px] top-[10px] z-10">
                  <SelectionIcon isSelected={isSelected} />
                </div>

                <div className="absolute left-[43px] top-[63px] w-[70px] h-[70px]">
                  <img 
                    src={option.icon} 
                    alt={option.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                <h3 className={`absolute left-[17px] top-[147px] w-[122px] font-roboto-condensed font-bold text-[20px] leading-[1.17em] text-center whitespace-pre-line ${
                  isSelected ? "text-[#E6502C]" : "text-[#1E293B]"
                }`}>
                  {option.title}
                </h3>

                {option.subtitle && (
                  <p className={`absolute left-[27px] top-[178px] w-[101px] font-roboto-condensed font-normal text-[15px] leading-[1.17em] text-center ${
                    isSelected ? "text-[#E6502C]" : "text-[#1E293B]"
                  }`}>
                    {option.subtitle}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Botão Flutuante */}
      {selected.length > 0 && (
        <NavigationButton
          onClick={handleContinue}
          variant="white-background"
        />
      )}
    </div>
  );
}

