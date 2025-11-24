"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuiz } from "@/contexts/QuizContext";
import QuizAnimationWrapper from "@/components/quiz/QuizAnimationWrapper";
import QuizOption from "@/components/quiz/QuizOption";
import { motion } from "framer-motion";

type Gender = "male" | "female" | "non-binary" | null;

export default function QuizGenderPage() {
  const router = useRouter();
  const { responses, saveResponse } = useQuiz();
  const [selected, setSelected] = useState<Gender>(null);

  // Load existing response
  useEffect(() => {
    if (responses.gender) {
      setSelected(responses.gender as Gender);
    }
  }, [responses]);

  const handleContinue = async () => {
    if (!selected) return;

    // Save to Supabase via Context
    await saveResponse("gender", selected);

    // Redirect to next question
    router.push("/quiz/location");
  };

  const options = [
    {
      id: "male" as Gender,
      label: "Homem",
      icon: "/icons/icon-homem.svg"
    },
    {
      id: "female" as Gender,
      label: "Mulher",
      icon: "/icons/icon-mulher.svg"
    },
    {
      id: "non-binary" as Gender,
      label: "Não-binário",
      icon: "/icons/icon-não-binário.svg"
    }
  ];

  return (
    <QuizAnimationWrapper className="min-h-screen bg-[#F1F1F1] px-4 py-[25px] pb-20">
      {/* Header com Progresso e Textos */}
      <div className="w-full max-w-md flex flex-col items-center gap-[21px] mb-3">
        {/* Barra de Progresso */}
        <div className="w-full flex flex-col gap-2">
          <div className="flex justify-between px-1">
            <span className="text-[#64748B] font-roboto text-[14px]">Pergunta 1 de 4</span>
            <span className="text-[#FF5F38] font-roboto font-bold text-[14px]">20%</span>
          </div>
          <div className="w-full h-[6px] bg-[#E2E8F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FF5F38] rounded-full transition-all duration-300"
              style={{ width: '20%' }}
            />
          </div>
        </div>

        {/* Textos */}
        <div className="flex flex-col items-center gap-[10px] py-[11px]">
          <h1 className="text-[32px] font-roboto-condensed font-bold text-[#FF5F38] leading-[1.17em] text-center">
            Como você se<br />
            identifica?
          </h1>
          <p className="text-[16px] font-inria-sans font-bold text-[#64748B] leading-[1.2em] text-center">
            Escolha uma opção que melhor te representa
          </p>
        </div>
      </div>

      {/* Opções de Gênero */}
      <div className="w-full max-w-md flex justify-center items-center py-[15px] px-4 mb-5">
        <div className="flex flex-col gap-[16px] w-full">
          {options.map((option, index) => (
            <QuizOption
              key={option.id}
              index={index}
              onClick={() => setSelected(option.id)}
              isSelected={selected === option.id}
              className={`
                relative w-full h-[88px] rounded-[20px] flex items-center px-6
                transition-all duration-200 border-2
                ${selected === option.id
                  ? "bg-[#FF5F38]/25 border-[#FF5F38]"
                  : "bg-[#F1F5F9] border-transparent"
                }
              `}
            >
              {/* Icon */}
              <div className="w-8 h-8 flex-shrink-0">
                <Image
                  src={option.icon}
                  alt={option.label}
                  width={32}
                  height={32}
                  className={`object-contain transition-all duration-200 ${selected === option.id ? "brightness-0 saturate-100 hue-rotate-[345deg]" : ""
                    }`}
                  style={selected === option.id ? { filter: "invert(48%) sepia(79%) saturate(2476%) hue-rotate(346deg) brightness(118%) contrast(119%)" } : {}}
                />
              </div>

              {/* Label */}
              <span className={`flex-1 text-center font-roboto font-bold text-[20px] ${selected === option.id ? "text-[#FF5F38]" : "text-[#1E293B]"}`}>
                {option.label}
              </span>

              {/* Radio Button */}
              <div className={`
                w-8 h-8 rounded-full border-2 flex items-center justify-center
                ${selected === option.id ? "border-[#FF5F38]" : "border-[#CBD5E1]"}
              `}>
                {selected === option.id && (
                  <div className="w-4 h-4 rounded-full bg-[#FF5F38]" />
                )}
              </div>
            </QuizOption>
          ))}
        </div>
      </div>

      {/* Botão Próxima Pergunta */}
      <div className="w-full max-w-md flex justify-center items-center py-[28px]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleContinue}
          disabled={!selected}
          className={`
            relative w-full h-[56px] rounded-[30px] flex items-center justify-center gap-2
            transition-all duration-200
            ${selected
              ? "bg-[#FF5F38] hover:bg-[#FF4820] cursor-pointer shadow-lg shadow-[#FF5F38]/30"
              : "bg-[#FF5F38]/50 cursor-not-allowed"
            }
          `}
        >
          <span className="text-white font-roboto font-bold text-[18px]">
            Próxima pergunta
          </span>
          {/* Arrow Icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.5 4.5L21 12M21 12L13.5 19.5M21 12H3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      </div>
    </QuizAnimationWrapper>
  );
}

