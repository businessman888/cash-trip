"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CorporateTravelerDetectedPage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/quiz/business/email");
  };

  return (
    <div className="min-h-screen bg-[#FF5F38] flex flex-col items-center justify-center px-4 py-[100px]">
      {/* Header Section */}
      <div className="flex flex-col items-center justify-center gap-[7px] px-[10px] w-full mb-10">
        <h1 className="text-[40px] font-roboto-condensed font-bold text-white leading-[1.17em] text-center">
          Viajante corporativo<br />
          detectado
        </h1>
      </div>

      {/* Ícone Superior */}
      <div className="flex flex-col items-center gap-[20px] px-[10px] w-full mb-10">
        <div className="flex items-center justify-center">
          <Image
            src="/icons/iconsquiznegocios/icon página viajante corporativo detectado.svg"
            alt="Viajante corporativo detectado"
            width={143}
            height={200}
            className="object-contain"
          />
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex flex-col justify-center items-center gap-[10px] px-[10px] w-full h-[93px]">
        <button 
          onClick={handleContinue}
          className="w-[232px] h-[61px] bg-[#1E293B] rounded-[40px] shadow-[2px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center hover:bg-[#2d3e54] transition-colors"
        >
          <span className="text-white font-roboto-condensed font-bold text-[20px] leading-[1.17em]">
            Continuar
          </span>
        </button>
      </div>
    </div>
  );
}

