'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const devPages = [
    { name: 'Dashboard Financeiro', path: '/dashboard', description: 'Visualizar métricas e viagens' },
    { name: 'Login', path: '/login', description: 'Página de autenticação' },
    { name: 'Quiz - Início', path: '/quiz/travel-purpose', description: 'Começar o quiz' },
    { name: 'Quiz - Level Unlocked', path: '/quiz/level-unlocked', description: 'Página de nível desbloqueado' },
    { name: 'Quiz - All Ready', path: '/quiz/all-ready', description: 'Perfil do viajante' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1E293B] to-[#0f172a] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.svg"
            alt="Cash Trip Logo"
            width={200}
            height={100}
            priority
          />
        </div>

        {/* Título */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white mb-4">
            🚀 Modo Desenvolvimento
          </h1>
          <p className="text-white/80 text-lg">
            Acesse qualquer página diretamente sem autenticação
          </p>
        </div>

        {/* Grid de páginas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {devPages.map((page) => (
            <Link
              key={page.path}
              href={page.path}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-6 transition-all border border-white/20 hover:border-white/40"
            >
              <h2 className="text-xl font-bold text-white mb-2">
                {page.name}
              </h2>
              <p className="text-white/70 text-sm">
                {page.description}
              </p>
              <div className="mt-4 text-[#FF5F38] font-bold flex items-center gap-2">
                Acessar →
              </div>
            </Link>
          ))}
        </div>

        {/* Aviso */}
        <div className="mt-12 bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 text-center">
          <p className="text-yellow-200 text-sm">
            ⚠️ Autenticação desabilitada para desenvolvimento
          </p>
        </div>
      </div>
    </div>
  )
}

