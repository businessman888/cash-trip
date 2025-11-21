"use client";

import { useRouter } from "next/navigation";
import { NavigationButton } from "@/components/quiz/NavigationButton";
import Lottie from "lottie-react";

export default function LevelUnlockedPage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/quiz/transition-accommodation");
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex flex-col items-center justify-center py-[58px] px-[10px]">
      {/* Conteúdo Central */}
      <div className="w-full max-w-[355px] flex flex-col items-center gap-[60px]">
        {/* Título no topo */}
        <h1 className="text-center text-[#1E293B] font-roboto-condensed font-black text-[48px] leading-[1.1] tracking-tight">
          Nível 1 Desbloqueado!
        </h1>

        {/* Ícone do Cadeado Desbloqueado - Animação Lottie */}
        <div className="w-[200px] h-[200px] flex items-center justify-center">
          <Lottie
            path="/animations/lock-unlock.json"
            loop={false}
            autoplay={true}
            style={{ 
              width: "200px", 
              height: "200px",
              backgroundColor: "transparent",
            }}
          />
        </div>

        {/* Mensagem abaixo da animação */}
        <div className="w-full flex items-center justify-center px-[10px]">
          <p className="text-[#FF5F38] font-roboto-condensed font-normal text-[24px] leading-[1.25] text-center">
            Prepare-se para descobrir mais<br />
            sobre sua viagem perfeita!
          </p>
        </div>
      </div>

      {/* Botão de Navegação */}
      <NavigationButton
        onClick={handleContinue}
        variant="white-background"
      />
    </div>
  );
}

