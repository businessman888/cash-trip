"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NavigationButton } from "@/components/quiz/NavigationButton";
import { SelectionIcon } from "@/components/quiz/SelectionIcon";

type RestrictionType = "vegetarian" | "vegan" | "glutenFree" | "lactoseFree" | "halal" | "kosher" | "none";

export default function DietaryRestrictionsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<RestrictionType[]>([]);

  const handleSelect = (type: RestrictionType) => {
    if (selected.includes(type)) {
      setSelected(selected.filter(t => t !== type));
    } else {
      setSelected([...selected, type]);
    }
  };

  const handleContinue = () => {
    if (selected.length === 0) return;
    
    localStorage.setItem("dietaryRestrictions", JSON.stringify(selected));
    router.push("/quiz/food-level");
  };

  const options = [
    {
      id: "vegetarian" as RestrictionType,
      title: "Vegetariano",
      icon: "/icons/Icon-vegetariano.svg"
    },
    {
      id: "vegan" as RestrictionType,
      title: "Vegano",
      icon: "/icons/Icon-vegano.svg"
    },
    {
      id: "glutenFree" as RestrictionType,
      title: "Sem glúten",
      icon: "/icons/Icon-sem-glúten.svg"
    },
    {
      id: "lactoseFree" as RestrictionType,
      title: "Sem lactose",
      icon: "/icons/Icon-sem-lactose.svg"
    },
    {
      id: "halal" as RestrictionType,
      title: "Halal",
      icon: "/icons/Icon-Halal.svg"
    },
    {
      id: "kosher" as RestrictionType,
      title: "Kosher",
      icon: "/icons/Icon-kosher.svg"
    },
    {
      id: "none" as RestrictionType,
      title: "Sem restrições",
      icon: "/icons/Icon-sem-restrições.svg"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex flex-col gap-[31px] py-[52px]">
      {/* Barra de Progresso - 60% */}
      <div className="w-full flex flex-col items-center justify-center gap-[10px] py-[31px] px-[16px]">
        <div className="relative w-[343px] h-[36px]">
          <div className="absolute left-0 top-0 w-full h-[18px] flex justify-between items-center">
            <span className="text-[#64748B] font-roboto font-normal text-[15px] leading-[1.17em]">
              Comida perfeita
            </span>
            <span className="text-[#E6502C] font-roboto font-black text-[15px] leading-[1.17em]">
              60%
            </span>
          </div>
          
          <div className="absolute left-0 top-[27px] w-[322px] h-[4px] bg-[rgba(100,116,139,0.1)] rounded-[20px]">
            <div 
              className="h-full bg-[#FF5F38] rounded-[20px] transition-all duration-300"
              style={{ width: '220px' }}
            />
          </div>
          
          <div className="absolute right-0 top-[18px] w-[18px] h-[18px]">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="18" height="18" rx="9" fill="#FF896F"/>
              <path d="M9 3 L9 15 M6 6 L9 3 L12 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Seção de Título */}
      <div className="w-full flex flex-col items-center gap-[20px] py-[13px] px-[46px]">
        <div className="w-[90px] h-[90px] flex items-center justify-center">
          <img 
            src="/icons/Icon-superior-pagina-Restrições-alimentares.svg" 
            alt="Ícone Restrições alimentares"
            className="w-full h-full object-contain"
          />
        </div>

        <h1 className="text-[36px] font-roboto-condensed font-black text-[#FF5F38] leading-[1.17em] text-left">
          Restrições<br />
          alimentares?
        </h1>
      </div>

      {/* Grid de Opções */}
      <div className="w-full flex flex-col items-center justify-center gap-[14px] py-[15px]">
        {/* Linha 1 */}
        <div className="flex justify-center items-center gap-[10px] px-[19px] w-[375px]">
          {options.slice(0, 2).map((option) => {
            const isSelected = selected.includes(option.id);
            
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`
                  relative w-[156px] h-[200px] rounded-[15px] border-[3px] transition-all duration-200
                  ${isSelected
                    ? "bg-[rgba(230,80,44,0.3)] border-[#E6502C]"
                    : "bg-transparent border-[#1E293B]"
                  }
                `}
              >
                {/* Check Badge */}
                <div className="absolute right-[7px] top-[12px] z-10">
                  <SelectionIcon isSelected={isSelected} />
                </div>

                {/* Ícone */}
                <div className="absolute left-[43px] top-[62px] w-[70px] h-[70px]">
                  <img 
                    src={option.icon} 
                    alt={option.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Título */}
                <h3 className={`absolute left-[19px] top-[156px] w-[118px] font-roboto-condensed font-bold text-[20px] leading-[1.17em] text-left ${
                  isSelected ? "text-[#E6502C]" : "text-[#1E293B]"
                }`}>
                  {option.title}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Linha 2 */}
        <div className="flex justify-center items-center gap-[10px] px-[19px] w-[375px]">
          {options.slice(2, 4).map((option) => {
            const isSelected = selected.includes(option.id);
            
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`
                  relative w-[156px] h-[200px] rounded-[15px] border-[3px] transition-all duration-200
                  ${isSelected
                    ? "bg-[rgba(230,80,44,0.3)] border-[#E6502C]"
                    : "bg-transparent border-[#1E293B]"
                  }
                `}
              >
                {/* Check Badge */}
                <div className="absolute right-[7px] top-[12px] z-10">
                  <SelectionIcon isSelected={isSelected} />
                </div>

                <div className="absolute left-[43px] top-[62px] w-[70px] h-[70px]">
                  <img 
                    src={option.icon} 
                    alt={option.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                <h3 className={`absolute left-[19px] top-[156px] w-[118px] font-roboto-condensed font-bold text-[20px] leading-[1.17em] text-left ${
                  isSelected ? "text-[#E6502C]" : "text-[#1E293B]"
                }`}>
                  {option.title}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Linha 3 */}
        <div className="flex justify-center items-center gap-[10px] px-[19px] w-[375px]">
          {options.slice(4, 6).map((option) => {
            const isSelected = selected.includes(option.id);
            
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`
                  relative w-[156px] h-[200px] rounded-[15px] border-[3px] transition-all duration-200
                  ${isSelected
                    ? "bg-[rgba(230,80,44,0.3)] border-[#E6502C]"
                    : "bg-transparent border-[#1E293B]"
                  }
                `}
              >
                {/* Check Badge */}
                <div className="absolute right-[7px] top-[12px] z-10">
                  <SelectionIcon isSelected={isSelected} />
                </div>

                <div className="absolute left-[43px] top-[62px] w-[70px] h-[70px]">
                  <img 
                    src={option.icon} 
                    alt={option.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                <h3 className={`absolute left-[19px] top-[156px] w-[118px] font-roboto-condensed font-bold text-[20px] leading-[1.17em] text-left ${
                  isSelected ? "text-[#E6502C]" : "text-[#1E293B]"
                }`}>
                  {option.title}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Linha 4 - Card único centralizado */}
        <div className="flex justify-center items-center px-[109px] pb-24">
          {options.slice(6, 7).map((option) => {
            const isSelected = selected.includes(option.id);
            
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`
                  relative w-[156px] h-[200px] rounded-[15px] border-[3px] transition-all duration-200
                  ${isSelected
                    ? "bg-[rgba(230,80,44,0.3)] border-[#E6502C]"
                    : "bg-transparent border-[#1E293B]"
                  }
                `}
              >
                {/* Check Badge */}
                <div className="absolute right-[7px] top-[12px] z-10">
                  <SelectionIcon isSelected={isSelected} />
                </div>

                <div className="absolute left-[43px] top-[62px] w-[70px] h-[70px]">
                  <img 
                    src={option.icon} 
                    alt={option.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                <h3 className={`absolute left-[17px] top-[156px] w-[122px] font-roboto-condensed font-bold text-[20px] leading-[1.17em] text-left ${
                  isSelected ? "text-[#E6502C]" : "text-[#1E293B]"
                }`}>
                  {option.title}
                </h3>
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

