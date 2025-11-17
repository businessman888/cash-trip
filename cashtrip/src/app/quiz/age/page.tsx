"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/contexts/QuizContext";

export default function QuizAgePage() {
  const router = useRouter();
  const { responses, saveResponse } = useQuiz();
  const [day, setDay] = useState<number>(6);
  const [month, setMonth] = useState<number>(2);
  const [year, setYear] = useState<number>(2002);

  const dayRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  // Gerar arrays de dias, meses e anos
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: 1, label: "JAN" },
    { value: 2, label: "Fev" },
    { value: 3, label: "Mar" },
    { value: 4, label: "Abr" },
    { value: 5, label: "Mai" },
    { value: 6, label: "Jun" },
    { value: 7, label: "Jul" },
    { value: 8, label: "Ago" },
    { value: 9, label: "Set" },
    { value: 10, label: "Out" },
    { value: 11, label: "Nov" },
    { value: 12, label: "Dez" },
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const handleContinue = async () => {
    const birthDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const age = new Date().getFullYear() - year;
    
    await saveResponse("age", age);
    await saveResponse("birthDate", birthDate);
    
    router.push("/quiz/income");
  };

  const handleScroll = (type: 'day' | 'month' | 'year', index: number) => {
    if (type === 'day') {
      setDay(index + 1);
      scrollToCenter(dayRef, index, 54);
    } else if (type === 'month') {
      setMonth(index + 1);
      scrollToCenter(monthRef, index, 54);
    } else {
      setYear(years[index]);
      scrollToCenter(yearRef, index, 54);
    }
  };

  const scrollToCenter = (ref: React.RefObject<HTMLDivElement>, index: number, itemHeight: number) => {
    if (ref.current) {
      const containerHeight = ref.current.clientHeight;
      const scrollPosition = index * itemHeight - (containerHeight / 2) + (itemHeight / 2);
      ref.current.scrollTo({
        top: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
    }
  };

  const handleScrollEvent = (type: 'day' | 'month' | 'year', ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const scrollTop = ref.current.scrollTop;
      const itemHeight = 54;
      const index = Math.round(scrollTop / itemHeight);
      
      if (type === 'day') {
        setDay(Math.max(1, Math.min(31, index + 1)));
      } else if (type === 'month') {
        setMonth(Math.max(1, Math.min(12, index + 1)));
      } else {
        const newYear = years[Math.max(0, Math.min(years.length - 1, index))];
        setYear(newYear);
      }
    }
  };

  useEffect(() => {
    // Scroll inicial para o valor selecionado
    const dayIndex = day - 1;
    const monthIndex = month - 1;
    const yearIndex = years.findIndex(y => y === year);
    
    setTimeout(() => {
      const itemHeight = 54;
      const paddingTop = 65;
      
      if (dayRef.current) {
        dayRef.current.scrollTop = dayIndex * itemHeight;
      }
      if (monthRef.current) {
        monthRef.current.scrollTop = monthIndex * itemHeight;
      }
      if (yearRef.current) {
        yearRef.current.scrollTop = yearIndex * itemHeight;
      }
    }, 100);
  }, []);

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex flex-col items-center gap-[10px] px-4 py-[25px] pb-[80px]">
      {/* Header com Progresso */}
      <div className="w-full flex flex-col items-center gap-[21px]">
        {/* Barra de Progresso */}
        <div className="w-full flex flex-col items-center gap-[10px] px-[9px] py-[8px]">
          <div className="relative w-[325px] h-[31px]">
            <span className="absolute left-0 top-0 text-[#64748B] font-inria-sans font-normal text-[16px] leading-[1.2em]">
              Pergunta 3 de 4
            </span>
            <span className="absolute right-0 top-0 text-[#FF5F38] font-inria-sans font-normal text-[16px] leading-[1.2em]">
              99%
            </span>
            <div className="absolute left-0 top-[25px] w-[325px] h-[6px] bg-[rgba(100,116,139,0.1)] rounded-[20px]">
              <div 
                className="h-full bg-[#FF5F38] rounded-[20px] transition-all duration-300"
                style={{ width: '316px' }}
              />
            </div>
          </div>
        </div>

        {/* Textos */}
        <div className="flex flex-col items-center gap-[10px] py-[11px]">
          <h1 className="text-[32px] font-roboto-condensed font-bold text-[#FF5F38] leading-[1.17em] text-center">
            Qual a sua<br />
            idade?
          </h1>
          <p className="text-[16px] font-inria-sans font-bold text-[#64748B] leading-[1.2em] text-center">
            Escolha uma opção que melhor te representa
          </p>
        </div>
      </div>

      {/* Seletores de Data */}
      <div className="w-full flex flex-col items-center gap-[10px] px-[2px] py-[15px]">
        <div className="flex items-center justify-center gap-[15px] px-[10px] py-[7px]">
          {/* Seletor de Dia */}
          <div className="relative w-[96px] h-[185px] overflow-hidden">
            <div 
              ref={dayRef}
              onScroll={() => handleScrollEvent('day', dayRef)}
              className="w-full h-full overflow-y-scroll scrollbar-hide"
              style={{ 
                paddingTop: '65px',
                paddingBottom: '65px',
              }}
            >
              {days.map((d, index) => {
                const isSelected = d === day;
                
                return (
                  <div
                    key={d}
                    onClick={() => handleScroll('day', index)}
                    className={`
                      w-[84px] h-[54px] mx-auto flex items-center justify-center cursor-pointer
                      ${isSelected ? 'bg-[#1E293B] rounded-[5px]' : 'bg-transparent'}
                    `}
                    style={{
                      marginLeft: '6px',
                    }}
                  >
                    <span className={`
                      font-inria-sans font-bold leading-[1.2em]
                      ${isSelected ? 'text-[#FF5F38] text-[20px]' : 'text-[rgba(230,80,44,0.3)] text-[15px]'}
                    `}>
                      {String(d).padStart(2, '0')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seletor de Mês */}
          <div className="relative w-[96px] h-[185px] overflow-hidden">
            <div 
              ref={monthRef}
              onScroll={() => handleScrollEvent('month', monthRef)}
              className="w-full h-full overflow-y-scroll scrollbar-hide"
              style={{ 
                paddingTop: '65px',
                paddingBottom: '65px',
              }}
            >
              {months.map((m, index) => {
                const isSelected = m.value === month;
                
                return (
                  <div
                    key={m.value}
                    onClick={() => handleScroll('month', index)}
                    className={`
                      w-[84px] h-[54px] mx-auto flex items-center justify-center cursor-pointer
                      ${isSelected ? 'bg-[#1E293B] rounded-[5px]' : 'bg-transparent'}
                    `}
                    style={{
                      marginLeft: '6px',
                    }}
                  >
                    <span className={`
                      font-inria-sans font-bold leading-[1.2em]
                      ${isSelected ? 'text-[#FF5F38] text-[20px]' : 'text-[rgba(230,80,44,0.3)] text-[15px]'}
                    `}>
                      {m.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seletor de Ano */}
          <div className="relative w-[96px] h-[185px] overflow-hidden">
            <div 
              ref={yearRef}
              onScroll={() => handleScrollEvent('year', yearRef)}
              className="w-full h-full overflow-y-scroll scrollbar-hide"
              style={{ 
                paddingTop: '65px',
                paddingBottom: '65px',
              }}
            >
              {years.map((y, index) => {
                const isSelected = y === year;
                
                return (
                  <div
                    key={y}
                    onClick={() => handleScroll('year', index)}
                    className={`
                      w-[84px] h-[54px] mx-auto flex items-center justify-center cursor-pointer
                      ${isSelected ? 'bg-[#1E293B] rounded-[5px]' : 'bg-transparent'}
                    `}
                    style={{
                      marginLeft: '6px',
                    }}
                  >
                    <span className={`
                      font-inria-sans font-bold leading-[1.2em]
                      ${isSelected ? 'text-[#FF5F38] text-[20px]' : 'text-[rgba(230,80,44,0.3)] text-[15px]'}
                    `}>
                      {y}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Botão Próxima Pergunta */}
      <div className="w-full flex justify-center items-center py-[28px] px-[67px]">
        <button
          onClick={handleContinue}
          className="relative w-[240px] h-[51px] rounded-[30px] bg-[#FF896F] flex items-center justify-center gap-2 hover:bg-[#FF7A5C] transition-colors cursor-pointer"
        >
          <span className="text-white font-inria-sans font-bold text-[20px] leading-[1.2em]">
            Próxima pergunta
          </span>
          <img 
            src="/icons/icon seta para direita.svg" 
            alt="Seta para direita" 
            width={32} 
            height={18}
            className="object-contain"
          />
        </button>
      </div>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
