"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuiz } from "@/contexts/QuizContext";
import { NavigationButton } from "@/components/quiz/NavigationButton";

type AccommodationCategory = "economic" | "business" | "upscale" | null;

interface BudgetRange {
  min: number;
  max: number;
}

export default function QuizAccommodationBudgetPage() {
  const router = useRouter();
  const { responses, saveResponse } = useQuiz();
  const [selectedCategory, setSelectedCategory] = useState<AccommodationCategory>(null);
  const [budgetValue, setBudgetValue] = useState<number>(400);

  const categories = {
    economic: { label: "Econômico", range: { min: 200, max: 400 } },
    business: { label: "Business", range: { min: 400, max: 700 } },
    upscale: { label: "Upscale", range: { min: 700, max: 1200 } }
  };

  // Load existing response
  useEffect(() => {
    if (responses.accommodationBudget) {
      const saved = responses.accommodationBudget as { category: AccommodationCategory; value: number };
      setSelectedCategory(saved.category);
      setBudgetValue(saved.value || saved.category ? categories[saved.category].range.min : 400);
    } else {
      // Selecionar Business por padrão
      setSelectedCategory("business");
      setBudgetValue(400);
    }
  }, [responses]);

  const handleCategorySelect = (category: AccommodationCategory) => {
    setSelectedCategory(category);
    if (category) {
      setBudgetValue(categories[category].range.min);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCategory) return;
    const value = Number(e.target.value);
    setBudgetValue(value);
  };

  const handleContinue = async () => {
    if (!selectedCategory) return;
    
    // Save to Supabase via Context
    await saveResponse("accommodationBudget", {
      category: selectedCategory,
      value: budgetValue
    });
    
    // Redirect to next question
    router.push("/quiz/business/flight-priority");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const currentRange = selectedCategory ? categories[selectedCategory].range : { min: 0, max: 0 };
  const sliderPosition = selectedCategory 
    ? ((budgetValue - currentRange.min) / (currentRange.max - currentRange.min)) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex flex-col gap-[10px] py-[27px] px-[6px]">
      {/* Container Principal */}
      <div className="w-full max-w-[375px] mx-auto flex flex-col items-center gap-[42px] px-4 py-[25px] pb-20">
        
        {/* Barra de Progresso Superior */}
        <div className="w-full flex flex-col items-center gap-[10px] py-5 px-[15px]">
          <div className="relative w-[325px] h-[41px]">
            {/* Texto e Porcentagem */}
            <span className="absolute left-0 top-[3px] text-[#64748B] font-roboto font-normal text-[15px] leading-[1.17em]">
              Conhecimento sobre você
            </span>
            <span className="absolute right-0 top-[3px] text-[#E6502C] font-roboto font-bold text-[10px] leading-[1.17em]">
              43%
            </span>
            {/* Barra de Progresso */}
            <div className="absolute left-0 top-[26px] w-full h-[4px] bg-[rgba(100,116,139,0.1)] rounded-[5px]">
              <div 
                className="h-full bg-gradient-to-r from-[#FF896F] via-[#FF5F38] to-[#E6502C] rounded-[5px] transition-all duration-300"
                style={{ width: '43%' }}
              />
            </div>
          </div>
        </div>

        {/* Cabeçalho com Ícone e Título */}
        <div className="w-full flex flex-col items-center gap-[37px] px-[38px] py-[13px]">
          {/* Ícone de Hotel */}
          <div className="w-[95px] h-[95px] flex items-center justify-center">
            <Image
              src="/icons/iconsquiznegocios/icon superior página orçamento por diaria(hospedagem).svg"
              alt="Orçamento por diária hospedagem"
              width={95}
              height={95}
              className="object-contain"
            />
          </div>

          {/* Título */}
          <h1 className="text-[32px] font-roboto-condensed font-black text-[#FF5F38] leading-[1.17em] text-center">
            Orçamento por<br />
            diária<br />
            (hospedagem)
          </h1>
        </div>

        {/* Categorias de Hospedagem */}
        <div className="w-full flex justify-center gap-[11px] px-2">
          {Object.entries(categories).map(([key, category]) => {
            const isSelected = selectedCategory === key;
            const categoryKey = key as AccommodationCategory;
            
            return (
              <button
                key={key}
                onClick={() => handleCategorySelect(categoryKey)}
                className={`
                  flex flex-col items-center gap-[6px] w-[111px] py-4
                  transition-all duration-200
                `}
              >
                {/* Ícone da categoria */}
                <div className={`
                  w-[61px] h-[61px] rounded-full flex items-center justify-center
                  ${isSelected ? "bg-[rgba(230,80,44,0.3)]" : "bg-transparent"}
                `}>
                  <Image
                    src={
                      key === "economic" 
                        ? "/icons/iconsquiznegocios/icon página orçamento por diária icone de economico.svg"
                        : key === "business"
                        ? "/icons/iconsquiznegocios/icon página orçamento por diária icone de business.svg"
                        : "/icons/iconsquiznegocios/icon página orçamento por diária icone de upscale.svg"
                    }
                    alt={category.label}
                    width={30}
                    height={30}
                    className="object-contain"
                  />
                </div>
                
                {/* Label */}
                <span className={`
                  font-roboto-condensed font-medium text-[16px] leading-[1.17em] text-center
                  ${isSelected ? "text-[#FF896F]" : "text-[rgba(100,116,139,0.4)]"}
                `}>
                  {category.label}
                </span>
                
                {/* Range de preço */}
                <span className={`
                  font-roboto-condensed font-medium text-[16px] leading-[1.17em] text-center
                  ${isSelected ? "text-[#FF896F]" : "text-[rgba(100,116,139,0.4)]"}
                `}>
                  {formatCurrency(category.range.min)} - {formatCurrency(category.range.max)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Slider de Orçamento */}
        {selectedCategory && (
          <div className="w-full flex flex-col items-center gap-[10px] px-2">
            <div className="relative w-[330px] h-[26px]">
              {/* Barra de fundo */}
              <div className="absolute left-0 top-[7px] w-full h-[13px] bg-[rgba(100,116,139,0.1)] rounded-[20px]" />
              
              {/* Barra de progresso - apenas até a posição atual */}
              <div 
                className="absolute left-0 top-[7px] h-[13px] bg-[#FF5F38] rounded-[20px] transition-all duration-200"
                style={{ 
                  width: `${((budgetValue - 200) / (1200 - 200)) * 100}%`,
                  maxWidth: '100%'
                }}
              />

              {/* Marcadores fixos nas posições das categorias (200, 400, 700, 1200) */}
              <div 
                className="absolute top-[3px] w-[9px] h-[21px] bg-[#D9D9D9] rounded-[2px]"
                style={{ left: '0%' }}
              />
              <div 
                className="absolute top-[3px] w-[9px] h-[21px] bg-[#D9D9D9] rounded-[2px]"
                style={{ left: '20%' }}
              />
              <div 
                className="absolute top-[3px] w-[9px] h-[21px] bg-[#D9D9D9] rounded-[2px]"
                style={{ left: '50%' }}
              />
              <div 
                className="absolute top-[3px] w-[9px] h-[21px] bg-[#D9D9D9] rounded-[2px]"
                style={{ left: '78.5%' }}
              />

              {/* Círculo do slider */}
              <div 
                className="absolute top-0 w-[26px] h-[26px] bg-[#E6502C] border-[3px] border-white rounded-full cursor-pointer transition-all duration-200 shadow-md"
                style={{ 
                  left: `calc(${((budgetValue - 200) / (1200 - 200)) * 100}% - 13px)`,
                  maxLeft: 'calc(100% - 13px)'
                }}
              />

              {/* Input Range (invisível mas funcional) */}
              <input
                type="range"
                min={currentRange.min}
                max={currentRange.max}
                value={budgetValue}
                onChange={handleSliderChange}
                step={10}
                className="absolute top-0 left-0 w-full h-[26px] opacity-0 cursor-pointer z-10"
              />
            </div>

            {/* Valor atual exibido */}
            <div className="mt-2">
              <span className="text-[#FF5F38] font-roboto-condensed font-medium text-[20px]">
                {formatCurrency(budgetValue)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Botão de Navegação Flutuante */}
      {selectedCategory && (
        <NavigationButton
          onClick={handleContinue}
          variant="white-background"
        />
      )}
    </div>
  );
}

