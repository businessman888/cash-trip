"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NavigationButton } from "@/components/quiz/NavigationButton";

type FoodLevelType = "gourmet" | "casual" | "healthy" | "local" | "cooking";

export default function FoodLevelPage() {
  const router = useRouter();
  const [levels, setLevels] = useState({
    gourmet: 1,
    casual: 4,
    healthy: 2,
    local: 5,
    cooking: 3
  });

  const handleIncrease = (type: FoodLevelType) => {
    if (levels[type] < 5) {
      setLevels({ ...levels, [type]: levels[type] + 1 });
    }
  };

  const handleDecrease = (type: FoodLevelType) => {
    if (levels[type] > 0) {
      setLevels({ ...levels, [type]: levels[type] - 1 });
    }
  };

  const handleContinue = () => {
    localStorage.setItem("foodLevels", JSON.stringify(levels));
    router.push("/quiz/transition-transport");
  };

  const options = [
    {
      id: "gourmet" as FoodLevelType,
      title: "Gourmet (restaurantes renomados)"
    },
    {
      id: "casual" as FoodLevelType,
      title: "Casual (lanchonetes, comida de rua)"
    },
    {
      id: "healthy" as FoodLevelType,
      title: "Saudável (orgânico, natural)"
    },
    {
      id: "local" as FoodLevelType,
      title: "Local/Típico (experimentar cultura)"
    },
    {
      id: "cooking" as FoodLevelType,
      title: "Prefiro cozinhar (comprar em mercado)"
    }
  ];

  const getProgressWidth = (level: number) => {
    const maxWidth = 260;
    return (level / 5) * maxWidth;
  };

  const hasAnyLevel = Object.values(levels).some(level => level > 0);

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex flex-col gap-[37px] py-[52px]">
      {/* Barra de Progresso - 99% */}
      <div className="w-full flex flex-col items-center justify-center gap-[10px] py-[31px] px-[16px] h-[98px]">
        <div className="relative w-[343px] h-[36px]">
          <div className="absolute left-0 top-0 w-full h-[18px] flex justify-between items-center">
            <span className="text-[#64748B] font-roboto font-normal text-[15px] leading-[1.17em]">
              Comida perfeita
            </span>
            <span className="text-[#E6502C] font-roboto font-black text-[15px] leading-[1.17em]">
              99%
            </span>
          </div>
          
          <div className="absolute left-0 top-[27px] w-[322px] h-[4px] bg-[rgba(100,116,139,0.1)] rounded-[20px]">
            <div 
              className="h-full bg-[#FF5F38] rounded-[20px] transition-all duration-300"
              style={{ width: '319px' }}
            />
          </div>
          
          <div className="absolute right-0 top-[18px] w-[18px] h-[18px]">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="18" height="18" rx="9" fill="white"/>
              <path d="M9 3 L9 15 M6 6 L9 3 L12 6" stroke="#FF5F38" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Seção de Título */}
      <div className="w-full flex flex-col items-center gap-[20px] py-[13px] px-[46px] h-[262px]">
        <div className="w-[90px] h-[90px] flex items-center justify-center">
          <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g stroke="#FF5F38" strokeWidth="3">
              <rect x="22.5" y="22.5" width="30" height="16.88" rx="2" fill="none"/>
              <line x1="37.5" y1="39.38" x2="37.5" y2="67.5"/>
              <line x1="22.5" y1="67.5" x2="52.5" y2="67.5"/>
            </g>
          </svg>
        </div>

        <h1 className="text-[36px] font-roboto-condensed font-black text-[#FF5F38] leading-[1.17em] text-left">
          Qual seu  nível de<br />
          alimentação em<br />
          viagens?
        </h1>
      </div>

      {/* Opções com Sliders */}
      <div className="w-full flex flex-col gap-[37px] px-[11px] pb-24">
        {options.map((option) => (
          <div key={option.id} className="flex flex-col w-full rounded-[20px]">
            {/* Título */}
            <div className="w-[352px] h-[54px] flex items-center">
              <span className="text-[#64748B] font-roboto-condensed font-normal text-[20px] leading-[1.17em] pl-[37px]">
                {option.title}
              </span>
            </div>

            {/* Área do Slider */}
            <div className="w-[352px] h-[56px] relative">
              <div className="absolute left-[50px] top-[19px] w-[260px] h-[18px] bg-[rgba(100,116,139,0.1)] rounded-[20px]">
                <div 
                  className="h-full bg-[#E6502C] rounded-[20px] transition-all duration-300"
                  style={{ width: `${getProgressWidth(levels[option.id])}px` }}
                />
              </div>

              {/* Botão - (diminuir) */}
              <button
                onClick={() => handleDecrease(option.id)}
                className="absolute left-[14px] top-[13px] w-[30px] h-[30px] rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                disabled={levels[option.id] === 0}
              >
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0" y="13.44" width="30" height="5" fill="white"/>
                </svg>
              </button>

              {/* Botão + (aumentar) */}
              <button
                onClick={() => handleIncrease(option.id)}
                className="absolute right-[9px] top-[13px] w-[30px] h-[30px] rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                disabled={levels[option.id] === 5}
              >
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 6.25 L15 23.75 M6.25 15 L23.75 15" stroke="#1E293B" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Botão Flutuante */}
      {hasAnyLevel && (
        <NavigationButton
          onClick={handleContinue}
          variant="white-background"
        />
      )}
    </div>
  );
}

