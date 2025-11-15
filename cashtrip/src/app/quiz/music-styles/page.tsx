"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NavigationButton } from "@/components/quiz/NavigationButton";
import { SelectionIcon } from "@/components/quiz/SelectionIcon";

type MusicStyle = "jazz" | "rock" | "sertanejo" | "pop" | "hiphop" | "classical" | "electronic" | "world";

export default function QuizMusicStylesPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<MusicStyle[]>([]);

  const handleSelect = (style: MusicStyle) => {
    if (selected.includes(style)) {
      setSelected(selected.filter((item) => item !== style));
    } else if (selected.length < 3) {
      setSelected([...selected, style]);
    }
  };

  const handleContinue = () => {
    if (selected.length === 0) return;

    localStorage.setItem("musicStyles", JSON.stringify(selected));
    router.push("/quiz/attractions");
  };

  const options = [
    {
      id: "jazz" as MusicStyle,
      title: "Jazz",
      icon: "/icons/Icon-Jazz.svg",
    },
    {
      id: "rock" as MusicStyle,
      title: "Rock",
      icon: "/icons/Icon-Rock.svg",
    },
    {
      id: "sertanejo" as MusicStyle,
      title: "Sertanejo",
      icon: "/icons/Icon-Sertanejo.svg",
    },
    {
      id: "pop" as MusicStyle,
      title: "Pop",
      icon: "/icons/Icon-pop.svg",
    },
    {
      id: "hiphop" as MusicStyle,
      title: "Hip-hop",
      icon: "/icons/Icon-hiphop.svg",
    },
    {
      id: "classical" as MusicStyle,
      title: "Clássica",
      icon: "/icons/Icon-Clássica.svg",
    },
    {
      id: "electronic" as MusicStyle,
      title: "Eletrônica",
      icon: "/icons/Icon-eletrônica.svg",
    },
    {
      id: "world" as MusicStyle,
      title: "World",
      icon: "/icons/Icon-World.svg",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex flex-col gap-[23px] py-[55px]">
      {/* Barra de Progresso - 30% */}
      <div className="w-full flex flex-col justify-center items-center gap-[10px] px-[15px] py-[10px] h-[51px]">
        <div className="relative w-full h-[31px]">
          {/* Área de título e progresso */}
          <div className="absolute left-0 top-0 w-full h-[16px]">
            <span className="absolute left-0 top-0 text-[#64748B] font-roboto font-normal text-[14px] leading-[1.17em]">
              Atividades perfeitas
            </span>
            <span className="absolute right-0 top-0 text-[#E6502C] font-roboto font-black text-[14px] leading-[1.17em]">
              30%
            </span>
          </div>
          
          {/* Área da barra */}
          <div className="absolute left-0 top-[13px] w-full h-[18px]">
            {/* Barra cinza de fundo */}
            <div className="absolute left-0 top-[9px] w-[322px] h-[4px] bg-[rgba(100,116,139,0.1)] rounded-[10px]" />
            
            {/* Barra de progresso laranja - 30% (120px) */}
            <div className="absolute left-0 top-[9px] w-[120px] h-[4px] bg-[#E6502C] rounded-[10px]" />
            
            {/* Ícone de academia */}
            <div className="absolute left-[327px] top-0 w-[18px] h-[18px]">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1.5" y="1.5" width="15" height="15" fill="white"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Título da Pergunta */}
      <div className="w-full flex flex-col items-center gap-[20px] py-[13px] px-[46px] h-[262px]">
        {/* Ícone Principal */}
        <div className="w-[90px] h-[90px]">
          <img
            src="/icons/Icon-superior-página-quais-estilos-musicais-você-gosta.svg"
            alt="Estilos musicais"
            className="w-full h-full object-contain"
          />
        </div>

        <h1 className="text-[36px] font-roboto-condensed font-black text-[#FF5F38] leading-[1.17em] text-center">
          Quais estilos<br />
          musicais você<br />
          gosta?
        </h1>
      </div>

      {/* Opções de Música */}
      <div className="w-full flex flex-col justify-center items-center gap-[14px] px-[16px] pb-[80px] pt-[11px]">
        {options.map((option) => {
          const isSelected = selected.includes(option.id);
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`
                relative w-[342px] h-[113px] rounded-[20px] border-[2px] flex items-center
                transition-all duration-200
                ${isSelected
                  ? "bg-[#F1F1F1] border-[#E6502C] shadow-[1px_1px_9px_0px_rgba(230,80,44,1)]"
                  : "bg-[#F1F1F1] border-[#1E293B] shadow-[1px_1px_9px_0px_rgba(100,116,139,1)] hover:shadow-lg"
                }
              `}
            >
              {/* Área de informação: ícone + texto */}
              <div className="absolute left-[14px] top-[17px] w-[244px] h-[80px] flex items-center gap-[13px]">
                {/* Ícone */}
                <div className="w-[80px] h-[80px] flex-shrink-0">
                  <img
                    src={option.icon}
                    alt={option.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Título */}
                <h3 className={`font-roboto-condensed font-bold text-[36px] leading-[1.17em] text-left ${
                  isSelected ? "text-[#E6502C]" : "text-[#1E293B]"
                }`}>
                  {option.title}
                </h3>
              </div>

              {/* Check Badge */}
              <div className="absolute right-[14px] top-[17px] z-10">
                <SelectionIcon isSelected={isSelected} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Botão Flutuante - Círculo no canto direito */}
      {selected.length > 0 && (
        <NavigationButton
          onClick={handleContinue}
          variant="white-background"
        />
      )}
    </div>
  );
}

