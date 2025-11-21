"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/contexts/QuizContext";

export default function QuizIncomePage() {
  const router = useRouter();
  const { responses, saveResponse } = useQuiz();
  const [income, setIncome] = useState<number>(3000);

  const minIncome = 1000;
  const maxIncome = 1000000;

  // Load existing response
  useEffect(() => {
    if (responses.income) {
      setIncome(responses.income as number);
    }
  }, [responses]);

  const handleContinue = async () => {
    await saveResponse("income", income);
    router.push("/quiz/business/transition");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIncome(Number(e.target.value));
  };

  // Calcular posição do slider (0-100%)
  const sliderPosition = ((income - minIncome) / (maxIncome - minIncome)) * 100;

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex flex-col items-center gap-[10px] px-4 py-[25px] pb-[80px]">
      {/* Header com Progresso */}
      <div className="w-full flex flex-col items-center gap-[21px]">
        {/* Barra de Progresso */}
        <div className="w-full flex flex-col items-center gap-[10px] px-[9px] py-[8px]">
          <div className="relative w-[325px] h-[31px]">
            <span className="absolute left-0 top-0 text-[#64748B] font-inria-sans font-normal text-[16px] leading-[1.2em]">
              Pergunta 4 de 4
            </span>
            <span className="absolute right-0 top-0 text-[#FF5F38] font-inria-sans font-normal text-[16px] leading-[1.2em]">
              100%
            </span>
            <div className="absolute left-0 top-[25px] w-[325px] h-[6px] bg-[rgba(100,116,139,0.1)] rounded-[20px]">
              <div 
                className="h-full bg-[#FF5F38] rounded-[20px] transition-all duration-300"
                style={{ width: '325px' }}
              />
            </div>
          </div>
        </div>

        {/* Textos */}
        <div className="flex flex-col items-center gap-[10px] py-[11px]">
          <h1 className="text-[32px] font-roboto-condensed font-bold text-[#FF5F38] leading-[1.17em] text-center">
            Renda mensal<br />
            média
          </h1>
          <p className="text-[16px] font-inria-sans font-bold text-[#64748B] leading-[1.2em] text-center">
            Escolha uma opção que melhor te representa
          </p>
        </div>
      </div>

      {/* Slider de Renda */}
      <div className="w-full flex flex-col items-center gap-[10px] px-[2px] py-[15px]">
        <div className="w-[339px] flex flex-col items-center gap-[22px] py-[14px]">
          {/* Valor Exibido */}
          <div className="flex flex-col items-center gap-[16px] px-[92px] py-[19px]">
            <span className="text-[#1E293B] font-roboto font-bold text-[32px] leading-[1.17em]">
              {formatCurrency(income)}
            </span>
          </div>

          {/* Slider Container */}
          <div className="w-full flex flex-col gap-[10px] px-[4px] py-[27px]">
            <div className="relative w-[330px] h-[43px]">
              {/* Barra de Fundo */}
              <div className="absolute left-0 top-[7px] w-[330px] h-[10px] bg-[rgba(100,116,139,0.1)] rounded-[20px]" />
              
              {/* Barra de Progresso */}
              <div 
                className="absolute left-0 top-[7px] h-[10px] bg-[#E6502C] rounded-[20px] transition-all duration-200"
                style={{ width: `${sliderPosition}%` }}
              />

              {/* Círculo do Slider */}
              <div 
                className="absolute top-0 w-[22px] h-[22px] bg-[#1E293B] border-[1px] border-white rounded-full cursor-pointer transition-all duration-200"
                style={{ left: `calc(${sliderPosition}% - 11px)` }}
              />

              {/* Input Range (invisível mas funcional) */}
              <input
                type="range"
                min={minIncome}
                max={maxIncome}
                value={income}
                onChange={handleSliderChange}
                className="absolute top-0 left-0 w-full h-[22px] opacity-0 cursor-pointer z-10"
                style={{
                  background: 'transparent',
                }}
              />
            </div>

            {/* Labels Min e Max */}
            <div className="relative w-[330px] h-[15px]">
              <span className="absolute left-0 top-0 text-[#1E293B] font-inter font-normal text-[12px] leading-[1.21em]">
                {formatCurrency(minIncome)}
              </span>
              <span className="absolute right-0 top-0 text-[#1E293B] font-inter font-normal text-[12px] leading-[1.21em]">
                {formatCurrency(maxIncome)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Botão Próxima Pergunta */}
      <div className="w-full flex justify-center items-center py-[28px] px-[67px]">
        <button
          onClick={handleContinue}
          className="relative w-[240px] h-[51px] rounded-[30px] bg-[#FF896F] flex items-center justify-center gap-2 hover:bg-[#FF7A5C] transition-colors cursor-pointer"
        >
          <span className="text-white font-inria-sans font-bold text-[20px] leading-[1.2em]">
            Próxima pergunta
          </span>
          <img 
            src="/icons/icon seta para direita.svg" 
            alt="Seta para direita" 
            width={32} 
            height={18}
            className="object-contain"
          />
        </button>
      </div>
    </div>
  );
}










