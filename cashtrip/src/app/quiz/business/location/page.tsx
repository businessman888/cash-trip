"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/contexts/QuizContext";
import { LocationModal } from "@/components/trips/new/LocationModal";
import { FiMapPin } from "react-icons/fi";

export default function QuizLocationPage() {
  const router = useRouter();
  const { responses, saveResponse } = useQuiz();
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load existing response
  useEffect(() => {
    if (responses.location) {
      // Reconstruct location string from state and city
      const { state, city } = responses.location;
      if (city && state) {
        setSelectedLocation(`${city}, ${state}`);
      }
    }
  }, [responses]);

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setIsModalOpen(false);
  };

  const handleContinue = async () => {
    if (!selectedLocation.trim()) return;

    // Parse location
    const parts = selectedLocation.split(',').map(p => p.trim());
    const city = parts[0] || "";
    const state = parts[1] || "";

    // Save to Supabase via Context
    await saveResponse("location", { state, city });

    // Redirect to next question
    router.push("/quiz/business/age");
  };

  const isValid = selectedLocation.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex flex-col items-center px-4 py-[30px] pb-20">
      {/* Header com Progresso e Textos */}
      <div className="w-full max-w-md flex flex-col items-center gap-[21px] mb-3">
        {/* Barra de Progresso */}
        <div className="w-full flex justify-center items-center p-2 px-[25px]">
          <div className="w-[325px] h-[31px] bg-white rounded-full overflow-hidden shadow-sm">
            <div
              className="h-full bg-gradient-to-r from-[#FF5F38] to-[#FF896F] rounded-full transition-all duration-300"
              style={{ width: '8%' }} // 2 de 25 perguntas = 8%
            />
          </div>
        </div>

        {/* Textos */}
        <div className="flex flex-row justify-center items-center gap-[10px] py-[11px] px-[88px]">
          <h1 className="text-[32px] font-roboto-condensed font-bold text-[#FF5F38] leading-[1.17em] text-center">
            Onde você<br />
            mora?
          </h1>
        </div>
      </div>

      {/* Location Selection Button */}
      <div className="flex flex-col items-center gap-10 py-[60px] mb-5">
        <div className="w-[344px]">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full h-[86px] rounded-[30px] border-2 border-[#E6502C] bg-white px-6 flex items-center gap-4 text-left hover:border-[#FF5F38] transition-all group"
          >
            <FiMapPin className="text-[#FF5F38] text-2xl flex-shrink-0" />
            <div className="flex-1">
              {selectedLocation ? (
                <p className="text-gray-700 font-roboto text-[16px]">{selectedLocation}</p>
              ) : (
                <p className="text-gray-400 font-roboto text-[16px]">Clique para selecionar sua localização</p>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Botão Próxima Pergunta */}
      <div className="w-full max-w-md flex justify-center items-center py-10 px-[67px]">
        <button
          onClick={handleContinue}
          disabled={!isValid}
          className={`
            relative w-[240px] h-[51px] rounded-[30px] flex items-center justify-center gap-2
            transition-all duration-200
            ${isValid
              ? "bg-[#FF896F] hover:bg-[#FF7A5C] cursor-pointer shadow-md"
              : "bg-[#FF896F]/50 cursor-not-allowed"
            }
          `}
        >
          <span className="text-white font-inria-sans font-bold text-[20px] leading-[1.2em]">
            Próxima pergunta
          </span>
          {/* Arrow Icon */}
          <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.5 1.5L22 9M22 9L14.5 16.5M22 9H2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Location Modal */}
      <LocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleLocationSelect}
      />
    </div>
  );
}










