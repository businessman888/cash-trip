"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NavigationButton } from "@/components/quiz/NavigationButton";
import { SelectionIcon } from "@/components/quiz/SelectionIcon";

type AttractionType = "museums" | "themeParks" | "nature" | "shopping" | "shows" | "gastronomy" | "sports" | "instagram";

export default function QuizAttractionsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<AttractionType[]>([]);

  const handleSelect = (type: AttractionType) => {
    if (selected.includes(type)) {
      setSelected(selected.filter((item) => item !== type));
    } else if (selected.length < 3) {
      setSelected([...selected, type]);
    }
  };

  const handleContinue = () => {
    if (selected.length === 0) return;

    localStorage.setItem("attractions", JSON.stringify(selected));
    router.push("/quiz/bucket-list");
  };

  const options = [
    {
      id: "museums" as AttractionType,
      title: "Museus e\nCultura",
      icon: "/icons/Icon-Eventos-culturais.svg",
    },
    {
      id: "themeParks" as AttractionType,
      title: "Parques\nTemáticos",
      icon: "/icons/Icon-parques-temáticos.svg",
    },
    {
      id: "nature" as AttractionType,
      title: "Natureza e\ntrilhas",
      icon: "/icons/Icon-natureza-e-trilhas.svg",
    },
    {
      id: "shopping" as AttractionType,
      title: "Compras",
      icon: "/icons/Icon-Compras.svg",
    },
    {
      id: "shows" as AttractionType,
      title: "Shows e\nEventos",
      icon: "/icons/Icon-shows-e-eventos.svg",
    },
    {
      id: "gastronomy" as AttractionType,
      title: "Tours\nGastronômicos/\nvinícolas",
      icon: "/icons/Icon-tours-gastronomicos-vinícolas.svg",
    },
    {
      id: "sports" as AttractionType,
      title: "Esportes e\naventura",
      icon: "/icons/Icon-Aventura-e-esportes.svg",
    },
    {
      id: "instagram" as AttractionType,
      title: "Pontos\nInstagramáveis",
      icon: "/icons/Icon-Atrações-(ex-shows).svg",
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
      <div className="w-full flex flex-col items-center gap-[20px] py-[13px] px-[46px]">
        {/* Ícone Principal */}
        <div className="w-[90px] h-[90px]">
          <img
            src="/icons/Icon-superior-página-que-tipo-de-atrações-te-interessam.svg"
            alt="Atrações"
            className="w-full h-full object-contain"
          />
        </div>

        <h1 className="text-[36px] font-roboto-condensed font-black text-[#FF5F38] leading-[1.17em] text-center">
          Que tipo de atrações<br />
          te interessam?
        </h1>
      </div>

      {/* Opções de Atrações */}
      <div className="w-full flex flex-col gap-[5px] px-0 pb-[80px]">
        {[0, 2, 4, 6].map((startIndex, lineIndex) => (
          <div key={lineIndex} className="flex justify-between items-center gap-[10px] py-[5px] px-[22px]">
            {options.slice(startIndex, startIndex + 2).map((option) => {
              const isSelected = selected.includes(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`
                    relative w-[156px] h-[227px] rounded-[15px] border-[3px] flex flex-col items-center
                    transition-all duration-200
                    ${isSelected
                      ? "bg-[rgba(230,80,44,0.3)] border-[#E6502C]"
                      : "bg-white border-[#1E293B] hover:shadow-lg"
                    }
                  `}
                >
                  {/* Check Badge */}
                  <div className="absolute right-[9px] top-[10px] z-10">
                    <SelectionIcon isSelected={isSelected} />
                  </div>

                  {/* Corpo do Card */}
                  <div className="absolute left-[9px] top-[63px] w-[138px] h-[154px] flex flex-col items-center">
                    {/* Ícone */}
                    <div className="w-[70px] h-[70px] mb-[13px]">
                      <img
                        src={option.icon}
                        alt={option.title}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Título */}
                    <h3 className={`font-roboto-condensed font-bold text-[20px] leading-[1.17em] text-center whitespace-pre-line ${
                      isSelected ? "text-[#E6502C]" : "text-[#1E293B]"
                    }`}>
                      {option.title}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>
        ))}
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

