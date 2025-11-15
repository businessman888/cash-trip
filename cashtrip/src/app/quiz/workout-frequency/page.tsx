"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { NavigationButton } from "@/components/quiz/NavigationButton";
import { CheckIcon } from "@/components/quiz/CheckIcon";
import Lottie from "lottie-react";

type WorkoutFrequency = "everyday" | "occasionally" | "yogaPilates" | "noWorkout";

export default function QuizWorkoutFrequencyPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<WorkoutFrequency | null>(null);
  const lottieRef = useRef<HTMLDivElement>(null);

  // Ajustar cor de fundo do SVG após renderização
  useEffect(() => {
    const adjustBackground = () => {
      if (lottieRef.current) {
        const svg = lottieRef.current.querySelector("svg");
        if (svg) {
          svg.style.backgroundColor = "#F1F1F1";
          // Alterar retângulos com fundo branco para a cor da página
          const rects = svg.querySelectorAll('rect[fill="#f5f5f5"], rect[fill="#F5F5F5"], rect[fill="rgb(245, 245, 245)"]');
          rects.forEach((rect) => {
            (rect as SVGElement).setAttribute("fill", "#F1F1F1");
          });
          // Também verificar elementos com style inline
          const allRects = svg.querySelectorAll("rect");
          allRects.forEach((rect) => {
            const fill = (rect as SVGElement).getAttribute("fill");
            if (fill === "#f5f5f5" || fill === "#F5F5F5" || fill === "rgb(245, 245, 245)") {
              (rect as SVGElement).setAttribute("fill", "#F1F1F1");
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

  const handleSelect = (frequency: WorkoutFrequency) => {
    setSelected(frequency);
  };

  const handleContinue = () => {
    if (!selected) return;

    localStorage.setItem("workoutFrequency", selected);
    router.push("/quiz/music-styles");
  };

  const options = [
    {
      id: "everyday" as WorkoutFrequency,
      title: "Sim, todo dia",
      subtitle: "(preciso de academia)",
      icon: "/icons/Icon-sim-todo-dia.svg",
    },
    {
      id: "occasionally" as WorkoutFrequency,
      title: "Ocasionalmente",
      subtitle: null,
      icon: "/icons/Icon-ocasionalmente.svg",
    },
    {
      id: "yogaPilates" as WorkoutFrequency,
      title: "Prefiro yoga\n/pilates",
      subtitle: null,
      icon: "/icons/Icon-prefiro-ioga-pilates.svg",
    },
    {
      id: "noWorkout" as WorkoutFrequency,
      title: "Não treino em\nviagens",
      subtitle: null,
      icon: "/icons/Icon-não-treino-em-viagens.svg",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex flex-col gap-[18px] py-[55px]">
      {/* Barra de Progresso - 10% */}
      <div className="w-full flex flex-col justify-center items-center gap-[10px] px-[15px] py-[10px]">
        <div className="relative w-full h-[31px]">
          {/* Área de título e progresso */}
          <div className="absolute left-0 top-0 w-full h-[16px]">
            <span className="absolute left-0 top-0 text-[#64748B] font-roboto font-normal text-[14px] leading-[1.17em]">
              Atividades perfeitas
            </span>
            <span className="absolute right-0 top-0 text-[#E6502C] font-roboto font-black text-[14px] leading-[1.17em]">
              10%
            </span>
          </div>
          
          {/* Área da barra */}
          <div className="absolute left-0 top-[13px] w-full h-[18px]">
            {/* Barra cinza de fundo */}
            <div className="absolute left-0 top-[9px] w-[322px] h-[4px] bg-[rgba(100,116,139,0.1)] rounded-[10px]" />
            
            {/* Barra de progresso laranja - 10% (80px) */}
            <div className="absolute left-0 top-[9px] w-[80px] h-[4px] bg-[#E6502C] rounded-[10px]" />
            
            {/* Ícone de academia */}
            <div className="absolute left-[327px] top-0 w-[18px] h-[18px]">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1.5" y="1.5" width="15" height="15" fill="rgba(255,95,56,0.25)"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Título da Pergunta */}
      <div className="w-full flex flex-col items-center gap-[20px] py-[13px] px-[46px] h-[262px]">
        {/* Ícone Principal - Animação Lottie */}
        <div 
          ref={lottieRef}
          className="w-[90px] h-[90px] bg-[#F1F1F1] rounded-lg overflow-hidden"
          style={{ backgroundColor: "#F1F1F1" }}
        >
          <Lottie
            path="/animations/academia.json"
            loop={true}
            autoplay={true}
            style={{ 
              width: "90px", 
              height: "90px", 
              backgroundColor: "#F1F1F1",
            }}
            rendererSettings={{
              preserveAspectRatio: "xMidYMid meet",
              clearCanvas: true,
            }}
          />
        </div>

        <h1 className="text-[36px] font-roboto-condensed font-black text-[#FF5F38] leading-[1.17em] text-center">
          Você treina<br />
          /frequenta<br />
          academia?
        </h1>
      </div>

      {/* Opções de Treino */}
      <div className="w-full flex flex-col gap-[10px] px-0 pb-[80px] pt-[8px]">
        {[0, 2].map((startIndex, lineIndex) => (
          <div key={lineIndex} className="flex justify-center items-center gap-[10px] py-[5px] px-[17px]">
            {options.slice(startIndex, startIndex + 2).map((option) => {
              const isSelected = selected === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`
                    relative w-[157px] h-[200px] rounded-[15px] border-[3px] flex flex-col items-center
                    transition-all duration-200
                    ${isSelected
                      ? "bg-[rgba(230,80,44,0.3)] border-[#E6502C]"
                      : "bg-white border-[#1E293B] hover:shadow-lg"
                    }
                  `}
                >
                  {/* Check Badge */}
                  <div className="absolute right-[11px] top-[13px] z-10">
                    <CheckIcon isSelected={isSelected} />
                  </div>

                  {/* Ícone */}
                  <div className="absolute left-[11px] top-[64px] w-[137px] h-[70px] flex items-center justify-center">
                    <div className="w-[70px] h-[70px]">
                      <img
                        src={option.icon}
                        alt={option.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Título e Subtítulo */}
                  <div className="absolute left-[11px] top-[140px] w-[137px] h-[52px]">
                    <h3 className={`font-roboto-condensed font-bold text-[20px] leading-[1.17em] whitespace-pre-line ${
                      option.subtitle ? 'text-left' : 'text-center'
                    } ${
                      isSelected ? "text-[#E6502C]" : "text-[#1E293B]"
                    }`}>
                      {option.title}
                    </h3>
                    {option.subtitle && (
                      <p className={`font-roboto-condensed font-normal text-[12px] leading-[1.17em] text-left ${
                        isSelected ? "text-[#E6502C]" : "text-[#1E293B]"
                      }`}>
                        {option.subtitle}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Botão Flutuante - Círculo no canto direito */}
      {selected && (
        <NavigationButton
          onClick={handleContinue}
          variant="white-background"
        />
      )}
    </div>
  );
}

