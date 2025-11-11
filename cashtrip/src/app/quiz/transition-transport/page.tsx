"use client";

import { useRouter } from "next/navigation";

export default function TransitionTransportPage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/quiz/own-vehicle");
  };

  return (
    <div className="min-h-screen bg-[#FF5F38] flex flex-col gap-[7px] py-[58px]" style={{
      backgroundImage: "url('/path-to-background-image.jpg')",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat"
    }}>
      {/* Indicador de Níveis */}
      <div className="w-full flex flex-col items-center justify-center gap-[18px] px-[41px]">
        {/* Barra de Progresso com Níveis */}
        <div className="relative w-[307px] h-[31px]">
          {/* Barra cinza de fundo */}
          <div className="absolute left-0 top-[5px] w-full h-[5px] bg-[rgba(100,116,139,0.1)] rounded-[20px]" />
          
          {/* Barra de progresso branca - 58.3% (179px - Níveis 1, 2 e 3 completos) */}
          <div className="absolute left-0 top-[5px] w-[179px] h-[5px] bg-white rounded-[20px]" />
          
          {/* Círculo Nível 1 - Completo */}
          <div className="absolute left-[38px] top-0 w-[15px] h-[15px] rounded-full bg-white shadow-[1px_1px_9px_0px_rgba(0,0,0,0.25)]" />
          
          {/* Círculo Nível 2 - Completo */}
          <div className="absolute left-[104px] top-0 w-[15px] h-[15px] rounded-full bg-white shadow-[1px_1px_4px_0px_rgba(0,0,0,0.25)]" />
          
          {/* Círculo Nível 3 - Completo */}
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
        <h1 className="text-center text-white font-roboto-condensed font-bold text-[36px] leading-[1.17em]">
          A viagem perfeita<br />
          merece o transporte<br />
          Ideal
        </h1>
      </div>

      {/* Seção de Imagem - Carro */}
      <div className="w-full h-[200px] flex items-center justify-center">
        <div className="w-[200px] h-[200px]">
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Carro simplificado */}
            <rect x="0.48" y="53.81" width="199.4" height="89.24" rx="10" fill="#FF473E"/>
            <rect x="27.29" y="63.54" width="145.67" height="99.09" rx="5" fill="#2B3B47"/>
            <rect x="34.98" y="125.69" width="130.29" height="29.26" rx="4" fill="#9BA5A8"/>
            <rect x="44.49" y="135.19" width="111.28" height="10.25" rx="2" fill="#E5E4DF"/>
            <rect x="4.82" y="112.79" width="195.02" height="12.59" rx="6" fill="#FFD469"/>
            {/* Janelas */}
            <rect x="61.54" y="63.4" width="107.32" height="27.51" rx="3" fill="#D32A2A"/>
            <rect x="21.47" y="112.12" width="156.21" height="30.93" rx="3" fill="#D32A2A"/>
          </svg>
        </div>
      </div>

      {/* Mensagem Motivacional */}
      <div className="w-full flex flex-col items-center justify-center py-[24px] px-[51px] h-[466px]">
        <p className="w-[291px] text-white font-roboto-condensed font-normal text-[32px] leading-[1.17em] text-left">
          Para suas viagens<br />
          serem além de fantásticas, serem<br />
          práticas e bem dinâmicas em relação a sua locomoção... Vamos descobrir suas preferências e interesses, e assim, te entregarmos as melhores opções.
        </p>
      </div>

      {/* Botão "Preparado(a)?" - Círculo no canto inferior direito */}
      <button
        onClick={handleContinue}
        className="fixed bottom-[8px] right-[6px] w-[73px] h-[73px] rounded-full bg-white border-[3px] border-[#1E293B] shadow-[2px_2px_9px_0px_rgba(30,41,59,0.4)] flex items-center justify-center hover:scale-110 transition-transform cursor-pointer z-50"
      >
        <svg width="42" height="24" viewBox="0 0 42 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.88 10.67H26.25M26.25 10.67L24.94 1.28M26.25 10.67L11.84 21.39" stroke="#E6502C" strokeWidth="2.67" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

