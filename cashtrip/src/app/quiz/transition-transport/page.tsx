"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { NavigationButton } from "@/components/quiz/NavigationButton";
import Lottie from "lottie-react";

export default function TransitionTransportPage() {
  const router = useRouter();
  const lottieRef = useRef<HTMLDivElement>(null);

  const handleContinue = () => {
    router.push("/quiz/own-vehicle");
  };

  // Ajustar cor de fundo do SVG após renderização
  useEffect(() => {
    const adjustBackground = () => {
      if (lottieRef.current) {
        const svg = lottieRef.current.querySelector("svg");
        if (svg) {
          svg.style.backgroundColor = "transparent";
          // Alterar retângulos com fundo branco/claro para transparente ou cor da página
          const rects = svg.querySelectorAll('rect[fill="#f5f5f5"], rect[fill="#F5F5F5"], rect[fill="rgb(245, 245, 245)"], rect[fill="#ffffff"], rect[fill="#FFFFFF"]');
          rects.forEach((rect) => {
            (rect as SVGElement).setAttribute("fill", "transparent");
          });
          // Verificar todos os retângulos
          const allRects = svg.querySelectorAll("rect");
          allRects.forEach((rect) => {
            const fill = (rect as SVGElement).getAttribute("fill");
            if (fill === "#f5f5f5" || fill === "#F5F5F5" || fill === "rgb(245, 245, 245)" || fill === "#ffffff" || fill === "#FFFFFF") {
              (rect as SVGElement).setAttribute("fill", "transparent");
            }
          });
        }
      }
    };

    // Tentar imediatamente
    adjustBackground();

    // Verificar periodicamente até encontrar o SVG (com timeout de segurança)
    const interval = setInterval(() => {
      if (lottieRef.current?.querySelector("svg")) {
        adjustBackground();
        clearInterval(interval);
      }
    }, 100);

    // Limpar após 3 segundos (tempo suficiente para carregar)
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FF5F38] flex flex-col gap-[7px] py-[58px]" style={{
      backgroundImage: "url('/path-to-background-image.jpg')",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat"
    }}>
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
        <h1 className="text-center text-white font-roboto-condensed font-bold text-[36px] leading-[1.17em]">
          A viagem perfeita<br />
          merece o transporte<br />
          Ideal
        </h1>
      </div>

      {/* Seção de Imagem - Carro - Animação Lottie */}
      <div className="w-full h-[200px] flex items-center justify-center">
        <div 
          ref={lottieRef}
          className="w-[200px] h-[200px]"
          style={{ backgroundColor: "transparent" }}
        >
          <Lottie
            path="/animations/car-animation.json"
            loop={true}
            autoplay={true}
            style={{ 
              width: "200px", 
              height: "200px", 
              backgroundColor: "transparent",
            }}
            rendererSettings={{
              preserveAspectRatio: "xMidYMid meet",
              clearCanvas: true,
            }}
          />
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
      <NavigationButton
        onClick={handleContinue}
        variant="orange-background"
      />
    </div>
  );
}

