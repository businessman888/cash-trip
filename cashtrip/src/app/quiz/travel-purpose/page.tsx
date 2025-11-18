"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type TravelPurpose = "vacation" | "business" | null;

export default function TravelPurposePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<TravelPurpose>(null);

  const handleContinue = () => {
    if (!selected) return;
    
    // Salvar escolha (localStorage temporário, depois Supabase)
    localStorage.setItem("travelPurpose", selected);
    
    // Redirecionar para próxima página do quiz baseado na escolha
    if (selected === "business") {
      router.push("/quiz/business/corporate-traveler-detected");
    } else {
      router.push("/quiz/email");
    }
  };

  return (
    <main className="min-h-screen bg-[#FF5F38] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[375px] flex flex-col items-center gap-10">
        
        {/* Textos de boas-vindas */}
        <div className="w-full flex flex-col items-start gap-6 px-8">
          <h1 className="text-white text-[40px] font-black leading-tight">
            Bem-vindo(a)<br />
            a CashTrip
          </h1>
          <h2 className="text-white text-2xl font-normal leading-tight">
            Qual o propósito<br />
            das suas viagens?
          </h2>
        </div>

        {/* Opções de escolha */}
        <div className="w-full flex justify-center items-center gap-3 px-4">
          
          {/* Opção: Férias */}
          <button
            onClick={() => setSelected("vacation")}
            className={`
              relative w-[156px] h-[228px] rounded-2xl
              border-3 transition-all duration-200
              ${selected === "vacation" 
                ? "border-white bg-white/10 scale-105" 
                : "border-white/80 hover:border-white hover:bg-white/5"
              }
            `}
          >
            {/* Ícone */}
            <div className="absolute top-4 left-2 right-2 h-[137px] flex items-center justify-center">
              <Image
                src="/icons/Icon-férias.svg"
                alt="Férias"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
            
            {/* Título */}
            <div className="absolute bottom-4 left-2 right-2 h-[59px] flex items-center justify-center">
              <span className="text-white text-2xl font-black">
                Férias
              </span>
            </div>
          </button>

          {/* Opção: Negócios */}
          <button
            onClick={() => setSelected("business")}
            className={`
              relative w-[156px] h-[228px] rounded-2xl
              border-3 transition-all duration-200
              ${selected === "business" 
                ? "border-white bg-white/10 scale-105" 
                : "border-white/80 hover:border-white hover:bg-white/5"
              }
            `}
          >
            {/* Ícone */}
            <div className="absolute top-4 left-2 right-2 h-[137px] flex items-center justify-center">
              <Image
                src="/icons/Icon-negócios.svg"
                alt="Negócios"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
            
            {/* Título */}
            <div className="absolute bottom-4 left-2 right-2 h-[59px] flex items-center justify-center">
              <span className="text-white text-2xl font-black">
                Negócios
              </span>
            </div>
          </button>

        </div>

        {/* Botão Continuar */}
        <div className="w-full flex justify-center px-16 mt-6">
          <button
            onClick={handleContinue}
            disabled={!selected}
            className={`
              w-full max-w-[232px] h-[61px] rounded-full
              bg-[#1E293B] shadow-lg
              text-white text-xl font-bold
              transition-all duration-200
              ${selected 
                ? "hover:bg-[#2d3f5f] hover:scale-105 cursor-pointer" 
                : "opacity-50 cursor-not-allowed"
              }
            `}
          >
            Continuar
          </button>
        </div>

      </div>
    </main>
  );
}

