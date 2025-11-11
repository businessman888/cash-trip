'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MdEmail } from 'react-icons/md'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    const supabase = createClient()

    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    })

    setLoading(false)

    if (authError) {
      setError(authError.message)
    } else {
      setMessage('Enviamos um link de recuperação para seu email!')
      setEmail('')
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
            Esqueceu<br />
            sua senha?
          </h2>
          <p className="text-white/80 text-base">
            Digite seu email e enviaremos um link para redefinir sua senha.
          </p>
        </div>

        {/* Form de recuperação */}
        <div className="w-full flex flex-col items-center gap-4 px-16">
          <form onSubmit={handleResetPassword} className="w-full max-w-[235px] flex flex-col gap-4">
            <div className="relative">
              <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-white" size={24} />
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-14 pr-4 py-3 rounded-[40px] border-2 border-[#FF5F38] bg-white/10 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#FF5F38]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full h-[56px] bg-[rgba(255,95,56,0.6)] border-[3px] border-[#FF5F38] text-white rounded-[40px] font-black text-xl hover:bg-[rgba(255,95,56,0.8)] transition-colors disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar Link'}
            </button>
          </form>

          {message && (
            <p className="text-green-400 text-sm text-center max-w-[235px]">{message}</p>
          )}
          {error && (
            <p className="text-red-400 text-sm text-center max-w-[235px]">{error}</p>
          )}

          <Link 
            href="/login" 
            className="text-white/80 text-base hover:text-white hover:underline mt-2"
          >
            Voltar para login
          </Link>
        </div>
      </div>
    </div>
  )
}

