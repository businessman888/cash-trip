"use client";

import { useRouter } from "next/navigation";
import { NavigationButton } from "@/components/quiz/NavigationButton";

export default function TransitionLifestylePage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/quiz/workout-frequency");
  };

  return (
    <div className="min-h-screen bg-[#FF5F38] flex flex-col gap-[16px] py-[58px]">
      {/* Indicador de Níveis - Com ícones SVG e espaçamento de 10px */}
      <div className="w-full flex flex-col items-center justify-center gap-[18px] px-[41px]">
        {/* Barra de Níveis */}
        <div className="flex items-start justify-center gap-[10px]">
          {/* Nível 1 - Completo */}
          <div className="flex flex-col items-center gap-[4px]">
            <img 
              src="/illustrations/icone level.svg" 
              alt="Nível 1"
              className="w-[60px] h-[15px]"
            />
            <span className="text-white font-roboto-condensed font-bold text-[11px] leading-tight whitespace-nowrap">
              Nível 1
            </span>
          </div>
          
          {/* Nível 2 - Completo */}
          <div className="flex flex-col items-center gap-[4px]">
            <img 
              src="/illustrations/icone level.svg" 
              alt="Nível 2"
              className="w-[60px] h-[15px]"
            />
            <span className="text-white font-roboto-condensed font-bold text-[11px] leading-tight whitespace-nowrap">
              Nível 2
            </span>
          </div>
          
          {/* Nível 3 - Completo */}
          <div className="flex flex-col items-center gap-[4px]">
            <img 
              src="/illustrations/icone level.svg" 
              alt="Nível 3"
              className="w-[60px] h-[15px]"
            />
            <span className="text-white font-roboto-condensed font-bold text-[11px] leading-tight whitespace-nowrap">
              Nível 3
            </span>
          </div>
          
          {/* Nível 4 - Completo */}
          <div className="flex flex-col items-center gap-[4px]">
            <img 
              src="/illustrations/icone level.svg" 
              alt="Nível 4"
              className="w-[60px] h-[15px]"
            />
            <span className="text-white font-roboto-condensed font-bold text-[11px] leading-tight whitespace-nowrap">
              Nível 4
            </span>
          </div>
          
          {/* Bônus - Não selecionado */}
          <div className="flex flex-col items-center gap-[4px]">
            <img 
              src="/illustrations/icone level não selecionado.svg" 
              alt="Bônus"
              className="w-[60px] h-[15px]"
            />
            <span className="text-white/70 font-roboto-condensed font-bold text-[11px] leading-tight whitespace-nowrap">
              Bônus
            </span>
          </div>
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
      <NavigationButton
        onClick={handleContinue}
        variant="orange-background"
      />
    </div>
  );
}

