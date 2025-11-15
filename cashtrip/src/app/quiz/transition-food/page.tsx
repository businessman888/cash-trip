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
      {/* Indicador de Níveis */}
      <div className="w-full flex flex-col items-center justify-center gap-[18px] py-[35px] px-[33px]">
        {/* Barra de Progresso com Níveis */}
        <div className="relative w-[307px] h-[31px]">
          {/* Barra cinza de fundo */}
          <div className="absolute left-0 top-[5px] w-full h-[5px] bg-[rgba(100,116,139,0.1)] rounded-[20px]" />
          
          {/* Barra de progresso branca - 36.5% (112px - Nível 1 e 2 completos) */}
          <div className="absolute left-0 top-[5px] w-[112px] h-[5px] bg-white rounded-[20px]" />
          
          {/* Círculo Nível 1 - Completo */}
          <div className="absolute left-[38px] top-0 w-[15px] h-[15px] rounded-full bg-white shadow-[1px_1px_9px_0px_rgba(0,0,0,0.25)]" />
          
          {/* Círculo Nível 2 - Completo */}
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

