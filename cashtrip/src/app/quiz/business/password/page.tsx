"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function QuizPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordMinLength = 6;

  const handleContinue = () => {
    if (!password || !confirmPassword) return;
    if (password.length < passwordMinLength) {
      alert(`A senha deve ter no mínimo ${passwordMinLength} caracteres!`);
      return;
    }
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    
    // Salvar senha (localStorage temporário, depois Supabase)
    localStorage.setItem("userPassword", password);
    
    // Redirecionar para próxima página do quiz
    router.push("/quiz/business/username");
  };

  const isPasswordValid = password.length >= passwordMinLength;
  const isPasswordMatch = password === confirmPassword;
  const isValid = password && confirmPassword && isPasswordValid && isPasswordMatch;

  return (
    <div className="min-h-screen bg-[#FF5F38] flex flex-col items-center justify-center px-4 py-5">
      {/* Header Section */}
      <div className="flex flex-col items-center justify-center gap-[7px] px-[10px] w-full max-w-[375px] h-[112px] mb-2">
        <h1 className="text-[40px] font-roboto-condensed font-bold text-white leading-[1.17em]">
          Etapa 2
        </h1>
        <h2 className="text-[32px] font-roboto-condensed font-medium text-white leading-[1.17em] text-center">
          Crie uma senha
        </h2>
      </div>

      {/* Password Input Section */}
      <div className="flex flex-col justify-center items-center gap-[10px] px-[10px] w-full max-w-[375px] h-[279px]">
        {/* Senha */}
        <div className="flex flex-col gap-[10px] p-[22px_25px] bg-white/20 rounded-2xl">
          <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 w-[263px]">
            {/* Lock Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="#FF5F38"/>
            </svg>
            {/* Password Input */}
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 outline-none text-gray-700 placeholder:text-gray-400"
            />
            {/* Eye Icon */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.87 13.26 16.64 13.83L19.56 16.75C21.07 15.49 22.26 13.86 22.99 12C21.26 7.61 16.99 4.5 11.99 4.5C10.59 4.5 9.25 4.75 8.01 5.2L10.17 7.36C10.74 7.13 11.35 7 12 7ZM2 4.27L4.28 6.55L4.74 7.01C3.08 8.3 1.78 10.02 1 12C2.73 16.39 7 19.5 12 19.5C13.55 19.5 15.03 19.2 16.38 18.66L16.8 19.08L19.73 22L21 20.73L3.27 3L2 4.27ZM7.53 9.8L9.08 11.35C9.03 11.56 9 11.78 9 12C9 13.66 10.34 15 12 15C12.22 15 12.44 14.97 12.65 14.92L14.2 16.47C13.53 16.8 12.79 17 12 17C9.24 17 7 14.76 7 12C7 11.21 7.2 10.47 7.53 9.8ZM11.84 9.02L14.99 12.17L15.01 12.01C15.01 10.35 13.67 9.01 12.01 9.01L11.84 9.02Z" fill="currentColor"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="currentColor"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Confirmar Senha */}
        <div className="flex flex-col gap-[10px] p-[22px_25px] bg-white/20 rounded-2xl">
          <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 w-[263px]">
            {/* Lock Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="#FF5F38"/>
            </svg>
            {/* Confirm Password Input */}
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="flex-1 outline-none text-gray-700 placeholder:text-gray-400"
            />
            {/* Eye Icon */}
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.87 13.26 16.64 13.83L19.56 16.75C21.07 15.49 22.26 13.86 22.99 12C21.26 7.61 16.99 4.5 11.99 4.5C10.59 4.5 9.25 4.75 8.01 5.2L10.17 7.36C10.74 7.13 11.35 7 12 7ZM2 4.27L4.28 6.55L4.74 7.01C3.08 8.3 1.78 10.02 1 12C2.73 16.39 7 19.5 12 19.5C13.55 19.5 15.03 19.2 16.38 18.66L16.8 19.08L19.73 22L21 20.73L3.27 3L2 4.27ZM7.53 9.8L9.08 11.35C9.03 11.56 9 11.78 9 12C9 13.66 10.34 15 12 15C12.22 15 12.44 14.97 12.65 14.92L14.2 16.47C13.53 16.8 12.79 17 12 17C9.24 17 7 14.76 7 12C7 11.21 7.2 10.47 7.53 9.8ZM11.84 9.02L14.99 12.17L15.01 12.01C15.01 10.35 13.67 9.01 12.01 9.01L11.84 9.02Z" fill="currentColor"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="currentColor"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Validation Messages */}
      <div className="flex flex-col justify-center items-center px-[10px] w-full max-w-[375px]">
        {password && password.length < passwordMinLength && (
          <p className="text-white text-sm text-center bg-yellow-500/20 px-4 py-2 rounded-lg">
            A senha deve ter no mínimo {passwordMinLength} caracteres
          </p>
        )}
        {password && confirmPassword && password !== confirmPassword && (
          <p className="text-white text-sm text-center bg-red-500/20 px-4 py-2 rounded-lg mt-2">
            As senhas não coincidem
          </p>
        )}
      </div>

      {/* Continue Button */}
      <div className="flex flex-col justify-center items-center gap-[10px] px-[10px] w-full max-w-[375px] h-[93px]">
        <button
          onClick={handleContinue}
          disabled={!isValid}
          className={`
            w-[232px] h-[61px] rounded-[40px] shadow-[2px_4px_4px_0px_rgba(0,0,0,0.25)] 
            flex items-center justify-center transition-all duration-200
            ${isValid 
              ? "bg-[#1E293B] hover:bg-[#2d3f5f] cursor-pointer" 
              : "bg-[#1E293B]/50 cursor-not-allowed"
            }
          `}
        >
          <span className="text-white font-roboto-condensed font-bold text-[20px] leading-[1.17em]">
            Continuar
          </span>
        </button>
      </div>
    </div>
  );
}

