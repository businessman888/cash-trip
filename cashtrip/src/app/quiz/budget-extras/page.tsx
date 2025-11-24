"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckIcon } from "@/components/quiz/CheckIcon";
import { NavigationButton } from "@/components/quiz/NavigationButton";
import QuizAnimationWrapper from "@/components/quiz/QuizAnimationWrapper";
import QuizOption from "@/components/quiz/QuizOption";

export default function QuizBudgetExtrasPage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string>("");

  const options = [
    {
      id: "premium",
      label: "Sim, quero\nexperiências premium",
      icon: "/icons/Icon-sim-quero-experiências-premium.svg",
    },
    {
      id: "selective",
      label: "Depende do que for\n(seletivo)",
      icon: "/icons/Icon-depende-do-que-for-(seletivo).svg",
    },
    {
      id: "economize",
      label: "Prefiro economizar\nsempre",
      icon: "/icons/Icon-prefiro-economizar-sempre.svg",
    },
  ];

  const handleSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleContinue = () => {
    if (!selectedOption) return;

    // Salvar no localStorage
    localStorage.setItem("budgetExtras", selectedOption);

    // Redirecionar para a próxima página
    router.push("/quiz/travel-with-pets");
  };

  return (
    <QuizAnimationWrapper className="min-h-screen bg-[#F1F1F1] flex flex-col gap-[29px] py-[41px]">
      {/* Progress Bar */}
      <div className="w-full flex flex-col justify-center items-center gap-2.5 px-[72px] py-6">
        <div className="relative w-full h-[5px]">
          {/* Bar 1 - Complete (50%) */}
          <div className="absolute left-0 top-0 w-[111px] h-[5px] bg-[#FF5F38] rounded-[1px]" />
          {/* Bar 2 - Incomplete (50%) */}
          <div className="absolute left-[119px] top-0 w-[111px] h-[5px] bg-[rgba(100,116,139,0.1)] rounded-[1px]" />
        </div>
      </div>

      {/* Icon and Title Section */}
      <div className="w-full px-[46px] py-[13px] flex flex-col items-center gap-5 h-[220px]">
        {/* Main Icon */}
        <img
          src="/icons/Icon-superior-página-orçamento-para-regalias-especiais.svg"
          alt="Orçamento"
          className="w-[90px] h-[90px]"
        />

        {/* Title */}
        <h1 className="text-[#FF5F38] font-roboto-condensed font-black text-[36px] leading-[42px] text-left whitespace-pre-line">
          {'Orçamento para\n"regalias" especiais?'}
        </h1>
      </div>

      {/* Options */}
      <div className="w-full flex flex-col gap-[21px] px-[15px] pb-20 pt-5">
        {options.map((option, index) => (
          <QuizOption
            key={option.id}
            index={index}
            onClick={() => handleSelect(option.id)}
            isSelected={selectedOption === option.id}
            className={`relative w-full h-[108px] rounded-[15px] transition-all ${selectedOption === option.id
                ? "bg-white shadow-[1px_1px_9px_0px_rgba(255,95,56,1)]"
                : "bg-white shadow-[1px_1px_9px_0px_rgba(0,0,0,0.25)]"
              }`}
          >
            {/* Area Infos */}
            <div className="absolute left-2 top-2.5 w-[269px] h-[88px]">
              {/* Icon */}
              <div className="absolute left-[5px] top-[9px] w-[70px] h-[70px]">
                <img
                  src={option.icon}
                  alt={option.label}
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Text */}
              <p
                className={`absolute left-[81px] top-[25px] font-roboto-condensed font-black text-xl leading-[23px] text-left whitespace-pre-line ${selectedOption === option.id
                    ? "text-[#FF5F38]"
                    : "text-[#1E293B]"
                  }`}
                style={{ left: option.id === 'premium' ? '81px' : option.id === 'selective' ? '88px' : '90px', top: option.id === 'economize' ? '21px' : '25px' }}
              >
                {option.label}
              </p>
            </div>

            {/* Check Area */}
            <div className="absolute right-[8px] top-2.5 w-[54px] h-[88px] flex items-center justify-center">
              <CheckIcon isSelected={selectedOption === option.id} />
            </div>
          </QuizOption>
        ))}
      </div>

      {/* Floating Button */}
      {selectedOption && (
        <NavigationButton
          onClick={handleContinue}
          variant="white-background"
        />
      )}
    </QuizAnimationWrapper>
  );
}
