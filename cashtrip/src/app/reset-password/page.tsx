'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MdLock } from 'react-icons/md'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      setLoading(false)
      return
    }

    const supabase = createClient()

    const { error: authError } = await supabase.auth.updateUser({
      password: password,
    })

    setLoading(false)

    if (authError) {
      setError(authError.message)
    } else {
      // Redirecionar para home após sucesso
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1E293B] to-[#0f172a] flex items-center justify-center px-4">
      <div className="w-full max-w-md flex flex-col items-center gap-10 py-12">
        {/* Logo placeholder */}
        <div className="w-full max-w-[308px] h-[158px] flex items-center justify-center">
          <h1 className="text-4xl font-black text-white">CASH TRIP</h1>
        </div>

        {/* Texto principal */}
        <div className="text-center px-4">
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Nova<br />
            senha
          </h2>
          <p className="text-white/80 text-base">
            Crie uma nova senha segura para sua conta.
          </p>
        </div>

        {/* Form de nova senha */}
        <div className="w-full flex flex-col items-center gap-4 px-16">
          <form onSubmit={handleUpdatePassword} className="w-full max-w-[235px] flex flex-col gap-4">
            <div className="relative">
              <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white" size={24} />
              <input
                type="password"
                placeholder="Nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-14 pr-4 py-3 rounded-[40px] border-2 border-[#FF5F38] bg-white/10 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#FF5F38]"
              />
            </div>

            <div className="relative">
              <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white" size={24} />
              <input
                type="password"
                placeholder="Confirmar senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-14 pr-4 py-3 rounded-[40px] border-2 border-[#FF5F38] bg-white/10 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#FF5F38]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full h-[56px] bg-[rgba(255,95,56,0.6)] border-[3px] border-[#FF5F38] text-white rounded-[40px] font-black text-xl hover:bg-[rgba(255,95,56,0.8)] transition-colors disabled:opacity-50"
            >
              {loading ? 'Atualizando...' : 'Atualizar Senha'}
            </button>
          </form>

          {error && (
            <p className="text-red-400 text-sm text-center max-w-[235px]">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}








