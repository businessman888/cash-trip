import Link from 'next/link'
import Image from 'next/image'
import { GoogleButton } from '@/components/auth/GoogleButton'
import { EmailButton } from '@/components/auth/EmailButton'

export default function LoginPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/login-background.webp"
          alt="Background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Overlay escuro para melhor legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E293B]/60 via-[#1E293B]/50 to-[#1E293B]/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-10 pt-[25px] px-4 pb-[150px]">
        {/* Logo */}
        <div className="w-full max-w-[308px] h-[158px] flex items-center justify-center">
          <Image
            src="/logo.svg"
            alt="Cash Trip Logo"
            width={308}
            height={158}
            priority
          />
        </div>

        {/* Texto principal */}
        <div className="text-center px-4">
          <h2 className="text-[48px] font-roboto-condensed font-normal text-white leading-[1.17em]">
            Sua próxima<br />
            <span className="text-[#FF5F38]">aventura</span><br />
            começa aqui
          </h2>
        </div>

        {/* Botões de autenticação */}
        <div className="w-full flex flex-col items-center gap-4 px-16">
          <GoogleButton />
          <EmailButton />

          {/* Links adicionais */}
          <div className="w-full max-w-[235px] flex items-center justify-between mt-4">
            <Link 
              href="/forgot-password" 
              className="text-white text-base font-normal hover:underline"
            >
              Esqueci a senha
            </Link>
            <Link 
              href="/quiz/travel-purpose" 
              className="text-[#E6502C] text-base font-black hover:underline"
            >
              Cadastrar-se
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


