"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function QuizUsernamePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = async () => {
    if (!username.trim()) return;

    setIsLoading(true);
    setError("");

    // Verificar se o Supabase está configurado
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const isSupabaseConfigured = supabaseUrl &&
      supabaseKey &&
      !supabaseUrl.includes('placeholder') &&
      !supabaseKey.includes('placeholder');

    // Se Supabase não estiver configurado, usar modo dev
    if (!isSupabaseConfigured) {
      try {
        console.log("🔧 Modo Dev: Supabase não configurado, usando localStorage");
        localStorage.setItem("username", username.trim());
        // Simulate a small delay
        await new Promise(resolve => setTimeout(resolve, 800));
        router.push("/quiz/gender");
        return;
      } catch (e) {
        console.error("Dev mode error:", e);
        setError("Erro ao salvar dados. Tente novamente.");
        setIsLoading(false);
        return;
      }
    }

    // Modo produção com Supabase
    try {
      const supabase = createClient();

      // Buscar email e senha do localStorage
      const email = localStorage.getItem("userEmail");
      const password = localStorage.getItem("userPassword");

      if (!email || !password) {
        setError("Dados de cadastro incompletos. Por favor, comece novamente.");
        setIsLoading(false);
        return;
      }

      // Validar senha antes de tentar criar conta
      if (password.length < 6) {
        setError("A senha deve ter no mínimo 6 caracteres. Por favor, volte e crie uma senha mais longa.");
        setIsLoading(false);
        return;
      }

      // Criar conta no Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username.trim(),
          }
        }
      });

      if (signUpError) {
        console.error("Supabase signup error:", signUpError);

        // Se houver erro de conexão, usar modo dev como fallback
        if (signUpError.message.toLowerCase().includes("fetch") ||
          signUpError.message.toLowerCase().includes("network")) {
          console.log("🔧 Erro de conexão, usando modo dev como fallback");
          localStorage.setItem("username", username.trim());
          await new Promise(resolve => setTimeout(resolve, 500));
          router.push("/quiz/gender");
          return;
        }

        // Tratar outros erros específicos do Supabase
        if (signUpError.message.toLowerCase().includes("password")) {
          setError("A senha deve ter no mínimo 6 caracteres. Por favor, volte e crie uma senha mais longa.");
        } else if (signUpError.message.toLowerCase().includes("already") || signUpError.message.toLowerCase().includes("registered")) {
          setError("Este email já está cadastrado. Tente fazer login ou use outro email.");
        } else {
          setError(signUpError.message || "Erro ao criar conta. Tente novamente.");
        }
        setIsLoading(false);
        return;
      }

      // Salvar username no localStorage também
      localStorage.setItem("username", username.trim());

      // Limpar senha do localStorage por segurança
      localStorage.removeItem("userPassword");

      // Redirecionar para próxima página (começar perguntas do quiz)
      router.push("/quiz/gender");

    } catch (err: any) {
      console.error("Error creating account:", err);

      // Se houver qualquer erro, usar modo dev como fallback
      console.log("🔧 Erro inesperado, usando modo dev como fallback");
      try {
        localStorage.setItem("username", username.trim());
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push("/quiz/gender");
      } catch (fallbackErr) {
        setError("Erro ao salvar dados. Tente novamente.");
        setIsLoading(false);
      }
    }
  };

  const isValid = username.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#FF5F38] flex flex-col items-center justify-center px-4 py-5 gap-[78px]">
      {/* Header Section */}
      <div className="flex flex-col items-center justify-center gap-[7px] px-[10px] w-full max-w-[375px]">
        <h1 className="text-[40px] font-roboto-condensed font-bold text-white leading-[1.17em]">
          Etapa 3
        </h1>
        <h2 className="text-[32px] font-roboto-condensed font-medium text-white leading-[1.17em] text-center">
          Como deseja ser<br />
          chamado?
        </h2>
      </div>

      {/* Username Input Section */}
      <div className="flex flex-col items-center gap-[10px] px-[10px] w-full max-w-[375px] h-[106px]">
        <div className="flex flex-col gap-[10px] p-[22px_25px] bg-white/20 rounded-2xl">
          <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 w-[263px]">
            {/* User Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#FF5F38" />
            </svg>
            {/* Username Input */}
            <input
              type="text"
              placeholder="Seu nome"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && isValid && handleContinue()}
              className="flex-1 outline-none text-gray-700 placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex justify-center px-[10px] w-full max-w-[375px]">
          <p className="text-white text-sm text-center bg-red-500/20 px-4 py-3 rounded-lg">
            {error}
          </p>
        </div>
      )}

      {/* Continue Button */}
      <div className="flex flex-col justify-center items-center gap-[10px] px-[10px] w-full max-w-[375px] h-[93px]">
        <button
          onClick={handleContinue}
          disabled={!isValid || isLoading}
          className={`
            w-[232px] h-[61px] rounded-[40px] shadow-[2px_4px_4px_0px_rgba(0,0,0,0.25)] 
            flex items-center justify-center transition-all duration-200
            ${isValid && !isLoading
              ? "bg-[#1E293B] hover:bg-[#2d3f5f] cursor-pointer"
              : "bg-[#1E293B]/50 cursor-not-allowed"
            }
          `}
        >
          <span className="text-white font-roboto-condensed font-bold text-[20px] leading-[1.17em]">
            {isLoading ? "Criando conta..." : "Continuar"}
          </span>
        </button>
      </div>
    </div>
  );
}










