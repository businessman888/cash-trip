"use client";

import { useRouter } from "next/navigation";

export default function TransitionLifestylePage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/quiz/workout-frequency");
  };

  return (
    <div className="min-h-screen bg-[#FF5F38] flex flex-col gap-[16px] py-[58px]">
      {/* Indicador de Níveis */}
      <div className="w-full flex flex-col items-center justify-center gap-[18px] px-[41px]">
        {/* Barra de Progresso com Níveis */}
        <div className="relative w-[307px] h-[31px]">
          {/* Barra cinza de fundo */}
          <div className="absolute left-0 top-[5px] w-full h-[5px] bg-[rgba(100,116,139,0.1)] rounded-[20px]" />
          
          {/* Barra de progresso branca - 79.8% (245px - Níveis 1, 2, 3 e 4 completos) */}
          <div className="absolute left-0 top-[5px] w-[245px] h-[5px] bg-white rounded-[20px]" />
          
          {/* Círculo Nível 1 - Completo */}
          <div className="absolute left-[38px] top-0 w-[15px] h-[15px] rounded-full bg-white shadow-[1px_1px_9px_0px_rgba(0,0,0,0.25)]" />
          
          {/* Círculo Nível 2 - Completo */}
          <div className="absolute left-[104px] top-0 w-[15px] h-[15px] rounded-full bg-white shadow-[1px_1px_4px_0px_rgba(0,0,0,0.25)]" />
          
          {/* Círculo Nível 3 - Completo */}
          <div className="absolute left-[171px] top-0 w-[15px] h-[15px] rounded-full bg-white shadow-[1px_1px_4px_0px_rgba(0,0,0,0.25)]" />
          
          {/* Círculo Nível 4 - Completo */}
          <div className="absolute left-[237px] top-0 w-[15px] h-[15px] rounded-full bg-white shadow-[1px_1px_4px_0px_rgba(0,0,0,0.25)]" />
          
          {/* Círculo Bônus - Menor, em destaque */}
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
        <h1 className="text-center text-white font-roboto-condensed font-bold text-[36px] leading-[1.17em]">
          Atividades e<br />
          Lifestyle
        </h1>
      </div>

      {/* Seção de Imagem - Ilustração de Atividades */}
      <div className="w-full flex justify-center items-center px-[87px]">
        <div className="w-[200px] h-[200px]">
          <img
            src="/icons/Icone superior página atividades e lifestyle.svg"
            alt="Atividades e Lifestyle"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Mensagem Motivacional */}
      <div className="w-full flex items-center justify-center py-[24px] px-[51px] h-[352px]">
        <p className="w-full text-white font-roboto-condensed font-normal text-[32px] leading-[1.17em] text-left">
          Vamos descobrir sua rotina, atividades preferidas, e assim, te entregaremos as melhores experiências roteirizadas nas suas viagens.
        </p>
      </div>

      {/* Botão "Preparado(a)?" - Círculo no canto inferior direito */}
      <button
        onClick={handleContinue}
        className="fixed bottom-[8px] right-[20px] w-[73px] h-[73px] rounded-full bg-white border-[3px] border-[#1E293B] shadow-[2px_2px_9px_0px_rgba(30,41,59,0.4)] flex items-center justify-center hover:scale-110 transition-transform cursor-pointer z-50"
      >
        <svg width="42" height="24" viewBox="0 0 42 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.88 10.67H26.25M26.25 10.67L24.94 1.28M26.25 10.67L11.84 21.39" stroke="#E6502C" strokeWidth="2.67" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

