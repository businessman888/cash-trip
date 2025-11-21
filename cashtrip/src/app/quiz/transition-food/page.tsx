"use client";

import { useRouter } from "next/navigation";
import { NavigationButton } from "@/components/quiz/NavigationButton";

export default function TransitionFoodPage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/quiz/food-preferences");
  };

  return (
    <div className="min-h-screen bg-[#FF5F38] flex flex-col gap-[32px] py-[22px]">
      {/* Indicador de Níveis - Com ícones SVG e espaçamento de 10px */}
      <div className="w-full flex flex-col items-center justify-center gap-[18px] py-[35px] px-[33px]">
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
          A comida dos sonhos
        </h1>
      </div>

      {/* Seção de Imagem - Pizza */}
      <div className="w-full flex items-center justify-center px-[87px]">
        <div className="w-[200px] h-[200px]">
          <img 
            src="/icons/Icon-pizza-página-a-comida-dos-sonhos.svg" 
            alt="Pizza"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Mensagem Motivacional */}
      <div className="w-full flex flex-col items-center justify-center py-[24px] px-[51px] pb-[80px]">
        <p className="w-full text-white font-roboto-condensed font-normal text-[32px] leading-[1.17em] text-left">
          Toda hospedagem<br />
          dos sonhos tem a<br />
          comida dos sonhos.<br />
          Vamos descobrir<br />
          agora a comida<br />
          perfeita para você<br />
          desfrutar cada<br />
          momento de sua<br />
          viagem do jeito mais<br />
          saboroso!
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

