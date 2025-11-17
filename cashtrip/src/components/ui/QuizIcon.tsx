import Image from "next/image";

interface QuizIconProps {
  icon: string;
  alt: string;
  size?: number;
  className?: string;
}

/**
 * Componente para exibir ícones do quiz
 * Uso: <QuizIcon icon="homem" alt="Homem" size={64} />
 */
export function QuizIcon({ 
  icon, 
  alt, 
  size = 48,
  className = ""
}: QuizIconProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Image
        src={`/icons/${icon}.svg`}
        alt={alt}
        fill
        className="object-contain"
      />
    </div>
  );
}

/**
 * Componente para ilustrações maiores (hospedagens, etc)
 */
interface QuizIllustrationProps {
  illustration: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function QuizIllustration({ 
  illustration, 
  alt, 
  width = 300,
  height = 200,
  className = ""
}: QuizIllustrationProps) {
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <Image
        src={`/illustrations/${illustration}.svg`}
        alt={alt}
        fill
        className="object-cover rounded-lg"
      />
    </div>
  );
}










