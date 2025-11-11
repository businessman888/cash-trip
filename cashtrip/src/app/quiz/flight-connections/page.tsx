"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ConnectionPreference = "direct" | "oneConnection" | "flexible";

export default function QuizFlightConnectionsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<ConnectionPreference | null>(null);

  const handleSelect = (preference: ConnectionPreference) => {
    setSelected(preference);
  };

  const handleContinue = () => {
    if (!selected) return;

    localStorage.setItem("flightConnections", selected);
    router.push("/quiz/transition-lifestyle");
  };

  const options = [
    {
      id: "direct" as ConnectionPreference,
      title: "Direto sempre",
      subtitle: "(Sem conexões)",
      icon: "/icons/Icon-direto-sempre.svg",
    },
    {
      id: "oneConnection" as ConnectionPreference,
      title: "Aceito 1 conexão",
      subtitle: "(economizar)",
      icon: "/icons/Icon-aceito-1-conexão.svg",
    },
    {
      id: "flexible" as ConnectionPreference,
      title: "Flexível",
      subtitle: "(melhor preço)",
      icon: "/icons/Icon-Flexível.svg",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex flex-col gap-[26px] py-[52px]">
      {/* Barra de Progresso - 99% */}
      <div className="w-full flex flex-col gap-[10px] px-[13px]">
        <div className="relative w-full h-[32px]">
          {/* Área da barra */}
          <div className="absolute left-0 top-[14px] w-[348px] h-[18px]">
            {/* Barra cinza de fundo */}
            <div className="absolute left-0 top-[9px] w-[322px] h-[4px] bg-[rgba(100,116,139,0.1)] rounded-[10px]" />
            
            {/* Barra de progresso laranja - 99% (318px) */}
            <div className="absolute left-0 top-[9px] w-[318px] h-[4px] bg-[#E6502C] rounded-[10px]" />
            
            {/* Ícone de carro */}
            <div className="absolute left-[330px] top-0 w-[18px] h-[18px]">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.74 6.29L9 0L17.26 6.29V18H0.74V6.29Z" fill="white"/>
              </svg>
            </div>
          </div>
          
          {/* Texto 99% */}
          <span className="absolute left-[295px] top-[3px] text-[#FF5F38] font-roboto font-black text-[14px] leading-[1.17em]">
            99%
          </span>
        </div>
      </div>

      {/* Título da Pergunta */}
      <div className="w-full flex flex-col items-center gap-[20px] py-[13px] px-[46px]">
        {/* Ícone Principal */}
        <div className="w-[90px] h-[90px]">
          <img
            src="/icons/Icon-superior-página-conexções-em-voos.svg"
            alt="Conexões em voos"
            className="w-full h-full object-contain"
          />
        </div>

        <h1 className="text-[36px] font-roboto-condensed font-black text-[#FF5F38] leading-[1.17em] text-center">
          Conexões<br />
          em voos?
        </h1>
      </div>

      {/* Opções de Conexões */}
      <div className="w-full flex flex-col justify-center items-center gap-[25px] px-[18px] pb-[80px] pt-[22px]">
        {options.map((option) => {
          const isSelected = selected === option.id;
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`
                relative w-full h-[155px] rounded-[15px] border-[3px] flex items-center
                transition-all duration-200
                ${isSelected
                  ? "bg-[rgba(230,80,44,0.3)] border-[#E6502C]"
                  : "bg-white border-[#1E293B] hover:shadow-lg"
                }
              `}
            >
              {/* Check Badge */}
              {isSelected && (
                <div className="absolute right-[11px] top-[12px] w-[315px] h-[50px] flex justify-end items-start">
                  <div className="w-[40px] h-[40px] rounded-full border border-[#FF5F38] bg-white flex items-center justify-center">
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.79 7.51L9.73 12.45L20.94 1.24" stroke="#E6502C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              )}

              {/* Conteúdo: Ícone + Texto */}
              <div className="absolute left-[15px] top-[66px] w-[310px] h-[77px] flex items-center gap-[15px]">
                {/* Ícone */}
                <div className="w-[70px] h-[70px] flex-shrink-0">
                  <img
                    src={option.icon}
                    alt={option.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Título e Subtítulo */}
                <div className="flex flex-col justify-center">
                  <h3 className={`font-roboto-condensed font-semibold text-[24px] leading-[1.17em] text-left ${
                    isSelected ? "text-[#E6502C]" : "text-[#1E293B]"
                  }`}>
                    {option.title}
                  </h3>
                  <p className={`font-roboto-condensed font-normal text-[14px] leading-[1.17em] text-left ${
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
      {selected && (
        <button
          onClick={handleContinue}
          className="fixed bottom-4 right-4 w-20 h-20 rounded-full bg-gradient-to-b from-[#FF896F] via-[#FF5F38] to-[#E6502C] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center hover:scale-110 transition-transform cursor-pointer z-50"
        >
          <svg width="50" height="28" viewBox="0 0 50 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.375 12.438H31.25M31.25 12.438L29.688 1.49M31.25 12.438L14.094 24.949" stroke="white" strokeWidth="3.125" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}

