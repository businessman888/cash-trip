"use client";

import { useRouter } from "next/navigation";
import { NavigationButton } from "@/components/quiz/NavigationButton";

export default function QuizTransitionFinalPage() {
  const router = useRouter();

  const handleContinue = () => {
    // Redirecionar para a próxima página
    router.push("/quiz/budget-extras");
  };

  return (
    <div className="min-h-screen bg-[#FF5F38] flex flex-col gap-5 py-[58px]">
      {/* Indicador de Níveis - Com ícones SVG e espaçamento de 10px */}
      <div className="w-full flex flex-col justify-center items-center gap-[18px] px-[41px] h-[133px]">
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
          
          {/* Bônus - Completo */}
          <div className="flex flex-col items-center gap-[4px]">
            <img 
              src="/illustrations/icone level.svg" 
              alt="Bônus"
              className="w-[60px] h-[15px]"
            />
            <span className="text-white font-roboto-condensed font-bold text-[11px] leading-tight whitespace-nowrap">
              Bônus
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-white font-roboto-condensed font-bold text-[36px] leading-[42px] text-center">
          Fechando com<br />chave de ouro!
        </h1>
      </div>

      {/* Golden Key Illustration */}
      <div className="w-full flex justify-center items-center px-[87px]">
        <div className="w-[150px] h-[150px]">
          <img
            src="/icons/Icon-superior-pagina-fechando-com-chave-de-ouro.svg"
            alt="Chave de ouro"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Message Section */}
      <div className="w-full flex flex-col justify-center items-center px-[51px] pt-6 pb-20">
        <p className="text-white font-roboto-condensed font-normal text-[32px] leading-[37px] text-left">
          Estamos a um passo de termos tudo pronto para as suas viagens dos 
          sonhos e no seu orçamento ideal!
          <br />
          <br />
          Vamos tirar as ideias do papel.
        </p>
      </div>

      {/* Floating Button */}
      <NavigationButton
        onClick={handleContinue}
        variant="orange-background"
      />
    </div>
  );
}

