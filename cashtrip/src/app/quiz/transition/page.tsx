"use client";

import { useRouter } from "next/navigation";
import QuizAnimationWrapper from "@/components/quiz/QuizAnimationWrapper";
import { motion } from "framer-motion";

export default function QuizTransitionPage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/quiz/traveler-type");
  };

  const levels = ['Nível 1', 'Nível 2', 'Nível 3', 'Nível 4', 'Bônus'];

  return (
    <QuizAnimationWrapper className="min-h-screen bg-[#FF5F38] flex flex-col items-center justify-between py-12 px-6">
      {/* Progress Indicator */}
      <div className="w-full max-w-md flex items-end justify-center gap-2 pt-4">
        {levels.map((level, index) => (
          <div key={index} className="flex flex-col items-center gap-1.5">
            <span className="text-white font-roboto-condensed font-black text-[11px] whitespace-nowrap">
              {level}
            </span>
            <div
              className={`h-[6px] rounded-full bg-white/40 ${index === 4 ? 'w-[45px]' : 'w-[55px]'
                }`}
            />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-white font-roboto font-bold text-[32px] leading-[1.2] mb-6">
          Agora, para<br />
          entendermos melhor<br />
          sobre você e te<br />
          entregarmos as<br />
          melhores experiências
        </h1>

        <p className="text-white font-roboto text-[18px] leading-[1.3] mt-4">
          Vamos descobrir o seu perfil de<br />
          viajante.<br />
          Preparado(a)?
        </p>
      </div>

      {/* Continue Button */}
      <div className="w-full max-w-md flex justify-center pb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleContinue}
          className="w-[280px] h-[64px] rounded-[32px] bg-[#1E293B] shadow-[2px_2px_9px_0px_rgba(0,0,0,0.25)] flex items-center justify-center hover:bg-[#2d3f5f] transition-all duration-200"
        >
          <span className="text-[#FF5F38] font-roboto font-bold text-[18px]">
            Sim, estou
          </span>
        </motion.button>
      </div>
    </QuizAnimationWrapper>
  );
}

