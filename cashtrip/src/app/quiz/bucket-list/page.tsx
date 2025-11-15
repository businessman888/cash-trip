"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NavigationButton } from "@/components/quiz/NavigationButton";
import { SelectionIcon } from "@/components/quiz/SelectionIcon";

export default function QuizBucketListPage() {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const options = [
    {
      id: "touristSpots",
      label: "Visitar pontos\nturísticos\nicônicos",
      icon: "/icons/Icon-visitar-pontos-turisticos-iconicos.svg",
    },
    {
      id: "gastronomicExperiences",
      label: "Experiências\ngastronômicas\núnicas",
      icon: "/icons/Icon-experiências-gastronomicas-unicas.svg",
    },
    {
      id: "nature",
      label: "Contato com\na natureza",
      icon: "/icons/Icon-Contato-com-a-natureza.svg",
    },
    {
      id: "shopping",
      label: "Compras",
      icon: "/icons/icon-compras-o-que-é-indispensável.svg",
    },
    {
      id: "shows",
      label: "Shows e\nEventos",
      icon: "/icons/Icon-show-e-eventos.svg",
    },
    {
      id: "relax",
      label: "Relaxar",
      icon: "/icons/icon-relax.svg",
    },
    {
      id: "other",
      label: "Outro",
      icon: "/icons/Icon-Outro.svg",
    },
  ];

  const toggleOption = (optionId: string) => {
    setSelectedItems((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleContinue = () => {
    if (selectedItems.length === 0) return;

    // Salvar no localStorage
    localStorage.setItem("bucketList", JSON.stringify(selectedItems));
    
    // Redirecionar para a página de transição final
    router.push("/quiz/transition-final");
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex flex-col">
      {/* Progress Bar */}
      <div className="w-full px-[15px] py-[10px] flex justify-center items-center">
        <div className="w-full max-w-[345px] relative h-[31px]">
          {/* Progress area */}
          <div className="absolute top-[13px] left-0 w-[345px] h-[18px]">
            {/* Background bar */}
            <div className="absolute top-[9px] left-0 w-[322px] h-1 bg-[#64748B]/10 rounded-[10px]" />
            {/* Progress fill */}
            <div
              className="absolute top-[9px] left-0 h-1 bg-[#E6502C] rounded-[10px]"
              style={{ width: "120px" }} /* 30% de 322px ≈ 97px, ajustado para 120px */
            />
            {/* Icon */}
            <div className="absolute top-0 left-[327px] w-[18px] h-[18px]">
              <img
                src="/icons/Icon-Academia.svg"
                alt="Gym"
                className="w-full h-full"
              />
            </div>
          </div>
          {/* Title area */}
          <div className="absolute top-0 left-0 w-[345px] h-4">
            <span className="absolute top-0 left-0 text-[#64748B] font-roboto text-sm leading-[16px]">
              Atividades perfeitas
            </span>
            <span className="absolute top-0 right-0 text-[#E6502C] font-roboto font-black text-sm leading-[16px]">
              30%
            </span>
          </div>
        </div>
      </div>

      {/* Icon and Title Section */}
      <div className="w-full px-[46px] py-[13px] flex flex-col items-center gap-5">
        {/* Main Icon */}
        <img
          src="/icons/Icon-superior-pagina-o-que-é-indispensável-na-sua-lista-de-desejos.svg"
          alt="Lista de desejos"
          className="w-[90px] h-[90px]"
        />

        {/* Title */}
        <h1 className="text-[#FF5F38] font-roboto-condensed font-black text-[36px] leading-[42px] text-left whitespace-pre-line">
          {"O que é\nINDISPENSÁVEL\nna sua\nlista de desejos?"}
        </h1>
      </div>

      {/* Options Grid */}
      <div className="w-full flex-1 pb-20 px-0 flex flex-col gap-[5px]">
        {/* Line 1 */}
        <div className="w-full px-[22px] py-[5px] flex justify-between items-center gap-2.5">
          {/* Option 1 */}
          <button
            onClick={() => toggleOption(options[0].id)}
            className={`w-[156px] h-[227px] rounded-[15px] relative transition-all ${
              selectedItems.includes(options[0].id)
                ? "bg-[#E6502C]/30 border-[3px] border-[#E6502C]"
                : "border-[3px] border-[#1E293B]"
            }`}
          >
            {/* Check area */}
            <div className="absolute top-2.5 left-[9px] w-[138px] h-[43px] flex justify-end items-start z-10">
              <SelectionIcon isSelected={selectedItems.includes(options[0].id)} />
            </div>
            {/* Card body */}
            <div className="absolute top-[63px] left-[9px] w-[138px] h-[154px] flex flex-col items-center">
              <img
                src={options[0].icon}
                alt={options[0].label}
                className="w-[70px] h-[70px] mb-3"
              />
              <p
                className={`font-roboto-condensed font-bold text-xl leading-[23px] text-center whitespace-pre-line ${
                  selectedItems.includes(options[0].id)
                    ? "text-[#E6502C]"
                    : "text-[#1E293B]"
                }`}
              >
                {options[0].label}
              </p>
            </div>
          </button>

          {/* Option 2 */}
          <button
            onClick={() => toggleOption(options[1].id)}
            className={`w-[156px] h-[227px] rounded-[15px] relative transition-all ${
              selectedItems.includes(options[1].id)
                ? "bg-[#E6502C]/30 border-[3px] border-[#E6502C]"
                : "border-[3px] border-[#1E293B]"
            }`}
          >
            {/* Check area */}
            <div className="absolute top-2.5 left-[9px] w-[138px] h-[43px] flex justify-end items-start z-10">
              <SelectionIcon isSelected={selectedItems.includes(options[1].id)} />
            </div>
            {/* Card body */}
            <div className="absolute top-[63px] left-[9px] w-[138px] h-[154px] flex flex-col items-center">
              <img
                src={options[1].icon}
                alt={options[1].label}
                className="w-[70px] h-[70px] mb-3"
              />
              <p
                className={`font-roboto-condensed font-bold text-xl leading-[23px] text-center whitespace-pre-line ${
                  selectedItems.includes(options[1].id)
                    ? "text-[#E6502C]"
                    : "text-[#1E293B]"
                }`}
              >
                {options[1].label}
              </p>
            </div>
          </button>
        </div>

        {/* Line 2 */}
        <div className="w-full px-[22px] py-[5px] flex justify-between items-center gap-2.5">
          {/* Option 3 */}
          <button
            onClick={() => toggleOption(options[2].id)}
            className={`w-[156px] h-[227px] rounded-[15px] relative transition-all ${
              selectedItems.includes(options[2].id)
                ? "bg-[#E6502C]/30 border-[3px] border-[#E6502C]"
                : "border-[3px] border-[#1E293B]"
            }`}
          >
            <div className="absolute top-2.5 left-[9px] w-[138px] h-[43px] flex justify-end items-start z-10">
              <SelectionIcon isSelected={selectedItems.includes(options[2].id)} />
            </div>
            <div className="absolute top-[63px] left-[9px] w-[138px] h-[154px] flex flex-col items-center">
              <img
                src={options[2].icon}
                alt={options[2].label}
                className="w-[70px] h-[70px] mb-3"
              />
              <p
                className={`font-roboto-condensed font-bold text-xl leading-[23px] text-center whitespace-pre-line ${
                  selectedItems.includes(options[2].id)
                    ? "text-[#E6502C]"
                    : "text-[#1E293B]"
                }`}
              >
                {options[2].label}
              </p>
            </div>
          </button>

          {/* Option 4 */}
          <button
            onClick={() => toggleOption(options[3].id)}
            className={`w-[156px] h-[227px] rounded-[15px] relative transition-all ${
              selectedItems.includes(options[3].id)
                ? "bg-[#E6502C]/30 border-[3px] border-[#E6502C]"
                : "border-[3px] border-[#1E293B]"
            }`}
          >
            <div className="absolute top-2.5 left-[9px] w-[138px] h-[43px] flex justify-end items-start z-10">
              <SelectionIcon isSelected={selectedItems.includes(options[3].id)} />
            </div>
            <div className="absolute top-[63px] left-[9px] w-[138px] h-[154px] flex flex-col items-center">
              <img
                src={options[3].icon}
                alt={options[3].label}
                className="w-[70px] h-[60px] mb-3"
              />
              <p
                className={`font-roboto-condensed font-bold text-xl leading-[23px] text-center whitespace-pre-line ${
                  selectedItems.includes(options[3].id)
                    ? "text-[#E6502C]"
                    : "text-[#1E293B]"
                }`}
              >
                {options[3].label}
              </p>
            </div>
          </button>
        </div>

        {/* Line 3 */}
        <div className="w-full px-[22px] py-[5px] flex justify-between items-center gap-2.5">
          {/* Option 5 */}
          <button
            onClick={() => toggleOption(options[4].id)}
            className={`w-[156px] h-[227px] rounded-[15px] relative transition-all ${
              selectedItems.includes(options[4].id)
                ? "bg-[#E6502C]/30 border-[3px] border-[#E6502C]"
                : "border-[3px] border-[#1E293B]"
            }`}
          >
            <div className="absolute top-2.5 left-[9px] w-[138px] h-[43px] flex justify-end items-start z-10">
              <SelectionIcon isSelected={selectedItems.includes(options[4].id)} />
            </div>
            <div className="absolute top-[63px] left-[9px] w-[138px] h-[154px] flex flex-col items-center">
              <img
                src={options[4].icon}
                alt={options[4].label}
                className="w-[70px] h-[70px] mb-3"
              />
              <p
                className={`font-roboto-condensed font-bold text-xl leading-[23px] text-center whitespace-pre-line ${
                  selectedItems.includes(options[4].id)
                    ? "text-[#E6502C]"
                    : "text-[#1E293B]"
                }`}
              >
                {options[4].label}
              </p>
            </div>
          </button>

          {/* Option 6 */}
          <button
            onClick={() => toggleOption(options[5].id)}
            className={`w-[156px] h-[227px] rounded-[15px] relative transition-all ${
              selectedItems.includes(options[5].id)
                ? "bg-[#E6502C]/30 border-[3px] border-[#E6502C]"
                : "border-[3px] border-[#1E293B]"
            }`}
          >
            <div className="absolute top-2.5 left-[9px] w-[138px] h-[43px] flex justify-end items-start z-10">
              <SelectionIcon isSelected={selectedItems.includes(options[5].id)} />
            </div>
            <div className="absolute top-[63px] left-[9px] w-[138px] h-[154px] flex flex-col items-center">
              <img
                src={options[5].icon}
                alt={options[5].label}
                className="w-[70px] h-[70px] mb-3"
              />
              <p
                className={`font-roboto-condensed font-bold text-xl leading-[23px] text-center whitespace-pre-line ${
                  selectedItems.includes(options[5].id)
                    ? "text-[#E6502C]"
                    : "text-[#1E293B]"
                }`}
              >
                {options[5].label}
              </p>
            </div>
          </button>
        </div>

        {/* Line 4 - Centered */}
        <div className="w-full px-[22px] py-[5px] flex justify-center items-center">
          {/* Option 7 */}
          <button
            onClick={() => toggleOption(options[6].id)}
            className={`w-[156px] h-[227px] rounded-[15px] relative transition-all ${
              selectedItems.includes(options[6].id)
                ? "bg-[#E6502C]/30 border-[3px] border-[#E6502C]"
                : "border-[3px] border-[#1E293B]"
            }`}
          >
            <div className="absolute top-2.5 left-[9px] w-[138px] h-[43px] flex justify-end items-start z-10">
              <SelectionIcon isSelected={selectedItems.includes(options[6].id)} />
            </div>
            <div className="absolute top-[63px] left-[9px] w-[138px] h-[154px] flex flex-col items-center">
              <img
                src={options[6].icon}
                alt={options[6].label}
                className="w-[70px] h-[70px] mb-3"
              />
              <p
                className={`font-roboto-condensed font-bold text-xl leading-[23px] text-center ${
                  selectedItems.includes(options[6].id)
                    ? "text-[#E6502C]"
                    : "text-[#1E293B]"
                }`}
              >
                {options[6].label}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Floating Button */}
      {selectedItems.length > 0 && (
        <NavigationButton
          onClick={handleContinue}
          variant="white-background"
        />
      )}
    </div>
  );
}

