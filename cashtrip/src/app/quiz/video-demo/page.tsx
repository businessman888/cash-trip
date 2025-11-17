"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavigationButton } from "@/components/quiz/NavigationButton";
import Lottie from "lottie-react";
import { AnimatePresence, motion } from "framer-motion";

// Array com os paths das 7 animações em ordem
const ANIMATIONS = [
  "/animations/primeiro.json",
  "/animations/segundo.json",
  "/animations/terceiro.json",
  "/animations/quarto.json",
  "/animations/quinto.json",
  "/animations/sexto.json",
  "/animations/setimo.json",
];

export default function QuizVideoDemoPage() {
  const router = useRouter();
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);
  const [animationData, setAnimationData] = useState<any>(null);

  const handleContinue = () => {
    router.push("/quiz/testimonials");
  };

  // Carregar animação atual
  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const response = await fetch(ANIMATIONS[currentAnimationIndex]);
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error("Erro ao carregar animação:", error);
      }
    };

    loadAnimation();
  }, [currentAnimationIndex]);

  // Mudar animação a cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimationIndex((prevIndex) => {
        // Loop: volta ao primeiro após o último
        return (prevIndex + 1) % ANIMATIONS.length;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-8 px-4">
      {/* Container das Animações */}
      <div 
        style={{ 
          width: '100%', 
          maxWidth: '400px',
          margin: '20px auto',
          position: 'relative',
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AnimatePresence mode="wait">
          {animationData && (
            <motion.div
              key={currentAnimationIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                duration: 0.5, 
                ease: "easeInOut" 
              }}
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Lottie
                animationData={animationData}
                loop={true}
                autoplay={true}
                style={{ 
                  width: "100%", 
                  height: "100%",
                  backgroundColor: "transparent",
                }}
                rendererSettings={{
                  preserveAspectRatio: "xMidYMid meet",
                  clearCanvas: true,
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Botão Continuar - Fixo no canto inferior direito */}
      <NavigationButton
        onClick={handleContinue}
        variant="white-background"
      />
    </div>
  );
}

