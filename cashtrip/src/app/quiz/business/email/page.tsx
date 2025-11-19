"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuizEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!email.trim()) {
      setError("Por favor, digite um email");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email inválido");
      return;
    }
    
    localStorage.setItem("userEmail", email);
    router.push("/quiz/business/password");
  };

  return (
    <div className="min-h-screen bg-[#FF5F38] flex flex-col items-center justify-center px-4 py-[100px]">
      {/* Header Section */}
      <div className="flex flex-col items-center justify-center gap-[7px] px-[10px] w-full mb-10">
        <h1 className="text-[40px] font-roboto-condensed font-bold text-white leading-[1.17em]">
          Vamos começar
        </h1>
        <h2 className="text-[32px] font-roboto-condensed font-medium text-white leading-[1.17em] text-center">
          Qual seu email?
        </h2>
      </div>

      {/* Email Input Section */}
      <div className="flex flex-col items-center gap-[10px] px-[10px] w-full mb-10">
        <div className="flex flex-col gap-[10px] p-[22px_25px] bg-white/20 rounded-2xl">
          <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 w-[263px]">
            {/* Email Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#FF5F38"/>
            </svg>
            {/* Email Input */}
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleContinue()}
              className="flex-1 outline-none text-gray-700 placeholder:text-gray-400"
            />
          </div>
          {error && (
            <p className="text-white text-sm mt-2 text-center bg-red-500/20 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex flex-col justify-center items-center gap-[10px] px-[10px] w-full h-[93px]">
        <button 
          onClick={handleContinue}
          className="w-[232px] h-[61px] bg-[#1E293B] rounded-[40px] shadow-[2px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center hover:bg-[#2d3e54] transition-colors"
        >
          <span className="text-white font-roboto-condensed font-bold text-[20px] leading-[1.17em]">
            Continuar
          </span>
        </button>
      </div>
    </div>
  );
}


