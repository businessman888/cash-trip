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
      {/* Indicador de Níveis - Com ícones SVG e espaçamento de 10px */}
      <div className="w-full flex flex-col items-center justify-center gap-[18px] py-[30px] px-[10px]">
        {/* Barra de Níveis */}
        <div className="flex items-start justify-center gap-[10px]">
          {/* Nível 1 - Atual/Completo */}
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
          
          {/* Nível 2 - Não selecionado */}
          <div className="flex flex-col items-center gap-[4px]">
            <img 
              src="/illustrations/icone level não selecionado.svg" 
              alt="Nível 2"
              className="w-[60px] h-[15px]"
            />
            <span className="text-white/70 font-roboto-condensed font-bold text-[11px] leading-tight whitespace-nowrap">
              Nível 2
            </span>
          </div>
          
          {/* Nível 3 - Não selecionado */}
          <div className="flex flex-col items-center gap-[4px]">
            <img 
              src="/illustrations/icone level não selecionado.svg" 
              alt="Nível 3"
              className="w-[60px] h-[15px]"
            />
            <span className="text-white/70 font-roboto-condensed font-bold text-[11px] leading-tight whitespace-nowrap">
              Nível 3
            </span>
          </div>
          
          {/* Nível 4 - Não selecionado */}
          <div className="flex flex-col items-center gap-[4px]">
            <img 
              src="/illustrations/icone level não selecionado.svg" 
              alt="Nível 4"
              className="w-[60px] h-[15px]"
            />
            <span className="text-white/70 font-roboto-condensed font-bold text-[11px] leading-tight whitespace-nowrap">
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
        <h1 className="w-full text-center text-white font-roboto-condensed font-bold text-[36px] leading-[1.17em]">
          A estadia perfeita!
        </h1>
      </div>

      {/* Seção de Imagem - Resort Paradisíaco */}
      <div className="w-full flex items-center justify-center pt-[40px] pb-[30px] px-[14px]">
        <div className="w-[347px] h-[304px] flex items-center justify-center">
          <img 
            src="/illustrations/resort.svg" 
            alt="Resort paradisíaco"
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

