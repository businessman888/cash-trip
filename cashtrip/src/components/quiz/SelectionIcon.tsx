import Image from "next/image";

interface SelectionIconProps {
  isSelected: boolean;
  className?: string;
}

export function SelectionIcon({ isSelected, className = "" }: SelectionIconProps) {
  return (
    <div className={`w-[40px] h-[40px] flex items-center justify-center ${className}`}>
      <Image
        src={isSelected ? "/icons/iconsquiznegocios/icon alternativa selecionada.svg" : "/icons/iconsquiznegocios/Icon alterntiva não selecionado.svg"}
        alt={isSelected ? "Opção selecionada" : "Opção não selecionada"}
        width={40}
        height={40}
        className="object-contain"
      />
    </div>
  );
}




