"use client";

import { useRouter } from "next/navigation";

export default function QuizTransitionPage() {
  const router = useRouter();

  const handleContinue = () => {
    // Redirecionar para próxima pergunta do quiz (Nível 2)
    router.push("/quiz/traveler-type");
  };

  return (
    <div className="min-h-screen bg-[#FF5F38] flex flex-col items-center justify-center gap-[30px] py-[52px] px-4">
      {/* Seção Superior com Níveis e Texto */}
      <div className="w-full max-w-md flex flex-col items-center justify-center gap-[18px] py-[26px] px-[21px]">
        {/* Indicador de Níveis */}
        <div className="relative w-[307px] h-[31px]">
          {/* Barra de progresso base */}
          <div className="absolute left-0 top-[5px] w-full h-[5px] bg-[rgba(100,116,139,0.1)] rounded-[20px]" />
          
          {/* Nível 1 */}
          <div className="absolute left-[38px] top-0 w-[15px] h-[15px] bg-white rounded-full shadow-[1px_1px_4px_0px_rgba(0,0,0,0.25)]" />
          <span className="absolute left-[29px] top-[17px] text-white font-roboto-condensed font-black text-[12px] leading-[1.17em]">
            Nível 1
          </span>

          {/* Nível 2 */}
          <div className="absolute left-[104px] top-0 w-[15px] h-[15px] bg-white rounded-full shadow-[1px_1px_4px_0px_rgba(0,0,0,0.25)]" />
          <span className="absolute left-[95px] top-[17px] text-white font-roboto-condensed font-black text-[12px] leading-[1.17em]">
            Nível 2
          </span>

          {/* Nível 3 */}
          <div className="absolute left-[171px] top-0 w-[15px] h-[15px] bg-white rounded-full shadow-[1px_1px_4px_0px_rgba(0,0,0,0.25)]" />
          <span className="absolute left-[162px] top-[17px] text-white font-roboto-condensed font-black text-[12px] leading-[1.17em]">
            Nível 3
          </span>

          {/* Nível 4 */}
          <div className="absolute left-[237px] top-0 w-[15px] h-[15px] bg-white rounded-full shadow-[1px_1px_4px_0px_rgba(0,0,0,0.25)]" />
          <span className="absolute left-[227px] top-[17px] text-white font-roboto-condensed font-black text-[12px] leading-[1.17em]">
            Nível 4
          </span>

          {/* Bônus */}
          <div className="absolute left-[284px] top-[3px] w-[10px] h-[10px] bg-white rounded-full shadow-[1px_1px_4px_0px_rgba(0,0,0,0.25)]" />
          <span className="absolute left-[274px] top-[17px] text-white font-roboto-condensed font-black text-[12px] leading-[1.17em]">
            Bônus
          </span>
        </div>

        {/* Texto Principal */}
        <div className="w-full text-center">
          <p className="text-white font-roboto font-bold text-[36px] leading-[1.17em]">
            Agora,<br />
            Para entendermos<br />
            melhor sobre você<br />
            e te entregarmos<br />
            as melhores<br />
            experiências<br />
            <br />
            Vamos descobrir<br />
            o seu perfil de<br />
            viajante<br />
            <br />
            Preparado(a)?
          </p>
        </div>
      </div>

      {/* Botão Continuar */}
      <div className="w-full max-w-md flex justify-center items-center py-[15px] px-[40px]">
        <button
          onClick={handleContinue}
          className="w-[232px] h-[61px] rounded-[40px] bg-[#1E293B] shadow-[2px_2px_9px_0px_rgba(0,0,0,0.25)] flex items-center justify-center hover:bg-[#2d3f5f] transition-all duration-200"
        >
          <span className="text-white font-roboto font-bold text-[20px] leading-[1.17em]">
            Sim estou
          </span>
        </button>
      </div>
    </div>
  );
}

