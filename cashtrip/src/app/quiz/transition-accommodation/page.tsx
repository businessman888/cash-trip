"use client";

import { useRouter } from "next/navigation";
import { NavigationButton } from "@/components/quiz/NavigationButton";

export default function TransitionAccommodationPage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/quiz/accommodation-type");
  };

  return (
    <div className="min-h-screen bg-[#FF5F38] flex flex-col py-[30px]">
      {/* Indicador de Níveis */}
      <div className="w-full flex flex-col items-center justify-center gap-[18px] py-[30px] px-[10px]">
        {/* Barra de Progresso com Níveis */}
        <div className="relative w-[307px] h-[31px]">
          {/* Barra cinza de fundo */}
          <div className="absolute left-0 top-[5px] w-full h-[5px] bg-[rgba(100,116,139,0.1)] rounded-[20px]" />
          
          {/* Barra de progresso branca - 15% (Nível 1 completo) */}
          <div className="absolute left-0 top-[5px] w-[46px] h-[5px] bg-white rounded-[20px]" />
          
          {/* Círculo Nível 1 - Completo */}
          <div className="absolute left-[38px] top-0 w-[15px] h-[15px] rounded-full bg-white shadow-[1px_1px_9px_0px_rgba(0,0,0,0.25)]" />
          
          {/* Círculo Nível 2 - Pendente */}
          <div className="absolute left-[104px] top-0 w-[15px] h-[15px] rounded-full bg-white shadow-[1px_1px_4px_0px_rgba(0,0,0,0.25)]" />
          
          {/* Círculo Nível 3 - Pendente */}
          <div className="absolute left-[171px] top-0 w-[15px] h-[15px] rounded-full bg-white shadow-[1px_1px_4px_0px_rgba(0,0,0,0.25)]" />
          
          {/* Círculo Nível 4 - Pendente */}
          <div className="absolute left-[237px] top-0 w-[15px] h-[15px] rounded-full bg-white shadow-[1px_1px_4px_0px_rgba(0,0,0,0.25)]" />
          
          {/* Círculo Bônus - Menor */}
          <div className="absolute left-[284px] top-[3px] w-[10px] h-[10px] rounded-full bg-white shadow-[1px_1px_4px_0px_rgba(0,0,0,0.25)]" />
          
          {/* Labels dos Níveis */}
          <span className="absolute left-[29px] top-[17px] text-white font-roboto-condensed font-black text-[12px] leading-[1.17em]">
            Nível 1
          </span>
          <span className="absolute left-[95px] top-[17px] text-white font-roboto-condensed font-black text-[12px] leading-[1.17em]">
            Nível 2
          </span>
          <span className="absolute left-[162px] top-[17px] text-white font-roboto-condensed font-black text-[12px] leading-[1.17em]">
            Nível 3
          </span>
          <span className="absolute left-[227px] top-[17px] text-white font-roboto-condensed font-black text-[12px] leading-[1.17em]">
            Nível 4
          </span>
          <span className="absolute left-[274px] top-[17px] text-white font-roboto-condensed font-black text-[12px] leading-[1.17em]">
            Bônus
          </span>
        </div>

        {/* Título */}
        <h1 className="w-full text-center text-white font-roboto-condensed font-bold text-[36px] leading-[1.17em]">
          A estadia perfeita!
        </h1>
      </div>

      {/* Seção de Imagens - Fotos de Hospedagens Sobrepostas em Leque */}
      <div className="w-full flex items-center justify-center pt-[40px] pb-[30px] px-[14px]">
        <div className="w-[347px] h-[304px] flex items-center justify-center">
          <img 
            src="/illustrations/Frame 259.svg" 
            alt="Hospedagens em destaque"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Mensagem Motivacional */}
      <div className="w-full flex items-center justify-center py-[25px] px-[10px] pb-[80px]">
        <p className="text-white font-roboto-condensed font-semibold text-[32px] leading-[1.17em] text-left max-w-[355px]">
          Vamos descobrir o tipo<br />
          de estadia <span className="text-[#1E293B]">perfeito</span><br />
          para você com base<br />
          em suas preferências,<br />
          para assim, você nunca<br />
          mais sofrer com<br />
          quebra de expectativas<br />
          nas suas viagens.
        </p>
      </div>

      {/* Botão "Preparado(a)?" - Círculo no canto inferior direito */}
      <NavigationButton
        onClick={handleContinue}
        variant="orange-background"
      />
    </div>
  );
}

