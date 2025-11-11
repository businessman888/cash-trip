"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen bg-[#F1F1F1] flex flex-col gap-[29px] py-[41px]">
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
        {/* Option 1 - Premium */}
        <button
          onClick={() => handleSelect(options[0].id)}
          className={`relative w-full h-[108px] rounded-[15px] transition-all ${
            selectedOption === options[0].id
              ? "bg-white shadow-[1px_1px_9px_0px_rgba(255,95,56,1)]"
              : "bg-white shadow-[1px_1px_9px_0px_rgba(0,0,0,0.25)]"
          }`}
        >
          {/* Area Infos */}
          <div className="absolute left-2 top-2.5 w-[269px] h-[88px]">
            {/* Icon */}
            <div className="absolute left-[5px] top-[9px] w-[70px] h-[70px]">
              <img
                src={options[0].icon}
                alt={options[0].label}
                className="w-full h-full object-contain"
              />
            </div>
            {/* Text */}
            <p
              className={`absolute left-[81px] top-[25px] font-roboto-condensed font-black text-xl leading-[23px] text-left whitespace-pre-line ${
                selectedOption === options[0].id
                  ? "text-[#FF5F38]"
                  : "text-[#FF5F38]"
              }`}
            >
              {options[0].label}
            </p>
          </div>

          {/* Check Area */}
          <div className="absolute right-[8px] top-2.5 w-[54px] h-[88px] flex items-center justify-center">
            {selectedOption === options[0].id && (
              <div className="w-10 h-10 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="19.5" stroke="#FF5F38" strokeWidth="1" fill="white"/>
                  <circle cx="20" cy="20" r="15" fill="white"/>
                  <path d="M9.79 17.51l8.42 6.72 11.89-16.72" stroke="#FF5F38" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
        </button>

        {/* Option 2 - Selective */}
        <button
          onClick={() => handleSelect(options[1].id)}
          className={`relative w-full h-[108px] rounded-[15px] transition-all ${
            selectedOption === options[1].id
              ? "bg-white shadow-[1px_1px_9px_0px_rgba(255,95,56,1)]"
              : "bg-white shadow-[1px_1px_9px_0px_rgba(0,0,0,0.25)]"
          }`}
        >
          {/* Area Infos */}
          <div className="absolute left-2 top-2.5 w-[269px] h-[88px]">
            {/* Icon */}
            <div className="absolute left-[5px] top-[9px] w-[70px] h-[70px]">
              <img
                src={options[1].icon}
                alt={options[1].label}
                className="w-full h-full object-contain"
              />
            </div>
            {/* Text */}
            <p
              className={`absolute left-[88px] top-[25px] font-roboto-condensed font-black text-xl leading-[23px] text-left whitespace-pre-line ${
                selectedOption === options[1].id
                  ? "text-[#FF5F38]"
                  : "text-[#1E293B]"
              }`}
            >
              {options[1].label}
            </p>
          </div>

          {/* Check Area */}
          <div className="absolute right-[8px] top-2.5 w-[54px] h-[88px] flex items-center justify-center">
            {selectedOption === options[1].id && (
              <div className="w-10 h-10 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="19.5" stroke="#FF5F38" strokeWidth="1" fill="white"/>
                  <circle cx="20" cy="20" r="15" fill="white"/>
                  <path d="M9.79 17.51l8.42 6.72 11.89-16.72" stroke="#FF5F38" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
        </button>

        {/* Option 3 - Economize */}
        <button
          onClick={() => handleSelect(options[2].id)}
          className={`relative w-full h-[108px] rounded-[15px] transition-all ${
            selectedOption === options[2].id
              ? "bg-white shadow-[1px_1px_9px_0px_rgba(255,95,56,1)]"
              : "bg-white shadow-[1px_1px_9px_0px_rgba(0,0,0,0.25)]"
          }`}
        >
          {/* Area Infos */}
          <div className="absolute left-2 top-2.5 w-[269px] h-[88px]">
            {/* Icon */}
            <div className="absolute left-[5px] top-[9px] w-[70px] h-[70px]">
              <img
                src={options[2].icon}
                alt={options[2].label}
                className="w-full h-full object-contain"
              />
            </div>
            {/* Text */}
            <p
              className={`absolute left-[90px] top-[21px] font-roboto-condensed font-black text-xl leading-[23px] text-left whitespace-pre-line ${
                selectedOption === options[2].id
                  ? "text-[#FF5F38]"
                  : "text-[#1E293B]"
              }`}
            >
              {options[2].label}
            </p>
          </div>

          {/* Check Area */}
          <div className="absolute right-[8px] top-2.5 w-[54px] h-[88px] flex items-center justify-center">
            {selectedOption === options[2].id && (
              <div className="w-10 h-10 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="19.5" stroke="#FF5F38" strokeWidth="1" fill="white"/>
                  <circle cx="20" cy="20" r="15" fill="white"/>
                  <path d="M9.79 17.51l8.42 6.72 11.89-16.72" stroke="#FF5F38" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Floating Button */}
      <button
        onClick={handleContinue}
        disabled={!selectedOption}
        className={`fixed bottom-2 right-[20px] w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
          selectedOption
            ? "bg-gradient-to-b from-[#FF896F] via-[#FF5F38] to-[#E6502C] hover:scale-105"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        <svg
          className="w-[50px] h-[28px]"
          viewBox="0 0 50 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.375 12.44h31.25M29.688 1.49l14.094 24.95"
            stroke="white"
            strokeWidth="3.11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

