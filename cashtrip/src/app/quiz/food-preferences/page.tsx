"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FoodType = "italian" | "brazilian" | "japanese" | "french" | "mexican" | "local" | "everything" | "healthy" | "premium";

export default function FoodPreferencesPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<FoodType[]>([]);

  const handleSelect = (type: FoodType) => {
    if (selected.includes(type)) {
      setSelected(selected.filter(t => t !== type));
    } else if (selected.length < 3) {
      setSelected([...selected, type]);
    }
  };

  const handleContinue = () => {
    if (selected.length === 0) return;
    
    localStorage.setItem("foodPreferences", JSON.stringify(selected));
    router.push("/quiz/dietary-restrictions");
  };

  const options = [
    {
      id: "italian" as FoodType,
      title: "Italiana",
      icon: "/icons/Icon-italiana.svg"
    },
    {
      id: "brazilian" as FoodType,
      title: "Brasileira",
      icon: "/icons/Icon-brasileira.svg"
    },
    {
      id: "japanese" as FoodType,
      title: "Japonesa/\nAsiática",
      icon: "/icons/icon-japonesa-asiática.svg"
    },
    {
      id: "french" as FoodType,
      title: "Francesa/\nEuropeia",
      icon: "/icons/Icon-francesa-europeia.svg"
    },
    {
      id: "mexican" as FoodType,
      title: "Mexicana/\nLatina",
      icon: "/icons/icon-mexicana-latina.svg"
    },
    {
      id: "local" as FoodType,
      title: "Culinária\nlocal",
      icon: "/icons/Icon-culinária-local.svg"
    },
    {
      id: "everything" as FoodType,
      title: "Come de tudo",
      icon: "/icons/Icon-come-de-tudo.svg"
    },
    {
      id: "healthy" as FoodType,
      title: "Comida fit/\nsaudável",
      icon: "/icons/Icon-comida-fit-saudável.svg"
    },
    {
      id: "premium" as FoodType,
      title: "Experiência\npremium/gourmet",
      icon: "/icons/Icon-experiencia-premium-gourmet.svg"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex flex-col items-center gap-[16px] py-[52px]">
      {/* Barra de Progresso - 10% */}
      <div className="flex flex-col items-center justify-center gap-[10px] py-[31px] px-[16px]">
        <div className="relative w-[343px] h-[36px]">
          {/* Textos */}
          <div className="absolute left-0 top-0 w-full h-[18px] flex justify-between items-center">
            <span className="text-[#64748B] font-roboto font-normal text-[15px] leading-[1.17em]">
              Comida perfeita
            </span>
            <span className="text-[#E6502C] font-roboto font-black text-[15px] leading-[1.17em]">
              10%
            </span>
          </div>
          
          {/* Barra de Progresso */}
          <div className="absolute left-0 top-[27px] w-[322px] h-[4px] bg-[rgba(100,116,139,0.1)] rounded-[20px]">
            <div 
              className="h-full bg-[#FF5F38] rounded-[20px] transition-all duration-300"
              style={{ width: '100px' }}
            />
          </div>
          
          {/* Ícone de Comida */}
          <div className="absolute right-0 top-[18px] w-[18px] h-[18px]">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="18" height="18" rx="9" fill="rgba(255,95,56,0.6)"/>
              <path d="M9 3 L9 15 M6 6 L9 3 L12 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Seção de Título */}
      <div className="w-[375px] flex flex-col items-center gap-[20px] py-[13px] px-[46px]">
        <div className="w-[90px] h-[90px] flex items-center justify-center">
          <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 40 L25 20 L35 40 M55 40 L60 20 L70 40 M25 60 L65 60 M30 70 L60 70" stroke="white" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        </div>

        <h1 className="text-[36px] font-roboto-condensed font-black text-[#FF5F38] leading-[1.17em] text-left">
          O que você<br />
          mais gosta de<br />
          comer?
        </h1>
        <p className="text-[24px] font-roboto-condensed font-semibold text-[#64748B] leading-[1.17em]">
          Escolha até 3:
        </p>
      </div>

      {/* Grid de Opções */}
      <div className="w-full flex flex-col gap-[16px]">
        {/* Linha 1 */}
        <div className="flex justify-center items-center gap-[15px] px-[16px]">
          {options.slice(0, 2).map((option) => {
            const isSelected = selected.includes(option.id);
            
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`
                  relative w-[156px] h-[227px] rounded-[15px] transition-all duration-200
                  ${isSelected
                    ? "bg-[#F1F1F1] shadow-[2px_2px_9px_0px_rgba(255,95,56,1)]"
                    : "bg-[#F1F1F1] shadow-[2px_2px_9px_0px_rgba(0,0,0,0.25)]"
                  }
                `}
              >
                {/* Ícone/Bandeira */}
                <div className="absolute left-0 top-[60px] w-full h-[70px] flex items-center justify-center">
                  <img 
                    src={option.icon} 
                    alt={option.title}
                    className="w-[70px] h-[70px] object-contain"
                  />
                </div>

                {/* Check Badge */}
                {isSelected && (
                  <div className="absolute right-[3px] top-[11px] w-[40px] h-[40px] rounded-full border-[2px] border-[#E6502C] bg-white flex items-center justify-center z-10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.26 6.38L9.73 11.85L20.72 0.87" stroke="#E6502C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}

                {/* Título */}
                <h3 className={`absolute left-0 top-[164px] w-full h-[54px] font-roboto-condensed font-bold text-[20px] leading-[1.17em] text-center whitespace-pre-line px-4 ${
                  isSelected ? "text-[#E6502C]" : "text-[#1E293B]"
                }`}>
                  {option.title}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Linha 2 */}
        <div className="flex justify-center items-center gap-[15px] px-[16px]">
          {options.slice(2, 4).map((option) => {
            const isSelected = selected.includes(option.id);
            
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`
                  relative w-[156px] h-[227px] rounded-[15px] transition-all duration-200
                  ${isSelected
                    ? "bg-[#F1F1F1] shadow-[2px_2px_9px_0px_rgba(255,95,56,1)]"
                    : "bg-[#F1F1F1] shadow-[2px_2px_9px_0px_rgba(100,116,139,0.1)]"
                  }
                `}
              >
                <div className="absolute left-0 top-[60px] w-full h-[70px] flex items-center justify-center">
                  <img 
                    src={option.icon} 
                    alt={option.title}
                    className="w-[70px] h-[70px] object-contain"
                  />
                </div>

                {isSelected && (
                  <div className="absolute right-[3px] top-[11px] w-[40px] h-[40px] rounded-full border-[2px] border-[#E6502C] bg-white flex items-center justify-center z-10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.26 6.38L9.73 11.85L20.72 0.87" stroke="#E6502C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}

                <h3 className={`absolute left-0 top-[149px] w-full h-[54px] font-roboto-condensed font-bold text-[20px] leading-[1.17em] text-center whitespace-pre-line px-4 ${
                  isSelected ? "text-[#E6502C]" : "text-[#1E293B]"
                }`}>
                  {option.title}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Linha 3 */}
        <div className="flex justify-center items-center gap-[15px] px-[16px]">
          {options.slice(4, 6).map((option) => {
            const isSelected = selected.includes(option.id);
            
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`
                  relative w-[156px] h-[227px] rounded-[15px] transition-all duration-200
                  ${isSelected
                    ? "bg-[#F1F1F1] shadow-[2px_2px_9px_0px_rgba(255,95,56,1)]"
                    : "bg-[#F1F1F1] shadow-[2px_2px_9px_0px_rgba(100,116,139,0.1)]"
                  }
                `}
              >
                <div className="absolute left-0 top-[60px] w-full h-[70px] flex items-center justify-center">
                  <img 
                    src={option.icon} 
                    alt={option.title}
                    className="w-[70px] h-[70px] object-contain"
                  />
                </div>

                {isSelected && (
                  <div className="absolute right-[3px] top-[11px] w-[40px] h-[40px] rounded-full border-[2px] border-[#E6502C] bg-white flex items-center justify-center z-10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.26 6.38L9.73 11.85L20.72 0.87" stroke="#E6502C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}

                <h3 className={`absolute left-0 top-[149px] w-full h-[54px] font-roboto-condensed font-bold text-[20px] leading-[1.17em] text-center whitespace-pre-line px-4 ${
                  isSelected ? "text-[#E6502C]" : "text-[#1E293B]"
                }`}>
                  {option.title}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Linha 4 */}
        <div className="flex justify-center gap-[15px] px-[16px]">
          {options.slice(6, 8).map((option) => {
            const isSelected = selected.includes(option.id);
            
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`
                  relative w-[156px] h-[227px] rounded-[15px] transition-all duration-200
                  ${isSelected
                    ? "bg-[#F1F1F1] shadow-[2px_2px_9px_0px_rgba(255,95,56,1)]"
                    : "bg-[#F1F1F1] shadow-[2px_2px_9px_0px_rgba(0,0,0,0.25)]"
                  }
                `}
              >
                <div className="absolute left-0 top-[60px] w-full h-[70px] flex items-center justify-center">
                  <img 
                    src={option.icon} 
                    alt={option.title}
                    className="w-[70px] h-[70px] object-contain"
                  />
                </div>

                {isSelected && (
                  <div className="absolute right-[3px] top-[11px] w-[40px] h-[40px] rounded-full border-[2px] border-[#E6502C] bg-white flex items-center justify-center z-10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.26 6.38L9.73 11.85L20.72 0.87" stroke="#E6502C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}

                <h3 className={`absolute left-0 top-[149px] w-full h-[54px] font-roboto-condensed font-bold text-[20px] leading-[1.17em] text-center whitespace-pre-line px-4 ${
                  isSelected ? "text-[#E6502C]" : "text-[#1E293B]"
                }`}>
                  {option.title}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Linha 5 - Apenas 1 card centralizado */}
        <div className="flex justify-center items-center px-[109px] pb-24">
          {options.slice(8, 9).map((option) => {
            const isSelected = selected.includes(option.id);
            
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`
                  relative w-[156px] h-[227px] rounded-[15px] transition-all duration-200
                  ${isSelected
                    ? "bg-[#F1F1F1] shadow-[2px_2px_9px_0px_rgba(255,95,56,1)]"
                    : "bg-[#F1F1F1] shadow-[2px_2px_9px_0px_rgba(100,116,139,0.1)]"
                  }
                `}
              >
                <div className="absolute left-0 top-[60px] w-full h-[70px] flex items-center justify-center">
                  <img 
                    src={option.icon} 
                    alt={option.title}
                    className="w-[70px] h-[70px] object-contain"
                  />
                </div>

                {isSelected && (
                  <div className="absolute right-[3px] top-[11px] w-[40px] h-[40px] rounded-full border-[2px] border-[#E6502C] bg-white flex items-center justify-center z-10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.26 6.38L9.73 11.85L20.72 0.87" stroke="#E6502C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}

                <h3 className={`absolute left-0 top-[149px] w-full h-[54px] font-roboto-condensed font-bold text-[20px] leading-[1.17em] text-center whitespace-pre-line px-2 ${
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
        <button
          onClick={handleContinue}
          className="fixed bottom-[8px] right-[6px] w-20 h-20 rounded-full bg-gradient-to-b from-[#FF896F] via-[#FF5F38] to-[#E6502C] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center hover:scale-110 transition-transform cursor-pointer z-50"
        >
          <svg width="50" height="28" viewBox="0 0 50 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.375 12.438H31.25M31.25 12.438L29.688 1.49M31.25 12.438L14.094 24.949" stroke="white" strokeWidth="3.125" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}

