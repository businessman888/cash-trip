import Image from "next/image";

interface CheckIconProps {
  isSelected: boolean;
  className?: string;
}

export function CheckIcon({ isSelected, className = "" }: CheckIconProps) {
  return (
    <div className={`w-[40px] h-[40px] flex items-center justify-center ${className}`}>
      <Image
        src={isSelected ? "/icons/Icon check selecionado.svg" : "/icons/Icon check não selecionado.svg"}
        alt={isSelected ? "Check selecionado" : "Check não selecionado"}
        width={40}
        height={40}
        className="object-contain"
      />
    </div>
  );
}


