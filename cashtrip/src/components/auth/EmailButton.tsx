'use client'

import { useState } from 'react'
import { MdEmail } from 'react-icons/md'
import { createClient } from '@/lib/supabase/client'

export function EmailButton() {
  const [showEmailInput, setShowEmailInput] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    const supabase = createClient()

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    setLoading(false)

    if (authError) {
      setError(authError.message)
    } else {
      setMessage('Verifique seu email! Enviamos um link mágico para você.')
      setEmail('')
      setTimeout(() => {
        setShowEmailInput(false)
        setMessage('')
      }, 3000)
    }
  }

  if (showEmailInput) {
    return (
      <div className="w-full max-w-[235px] flex flex-col gap-3">
        <form onSubmit={handleEmailLogin} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-[40px] border-2 border-[#FF5F38] bg-white/10 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#FF5F38]"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-3 w-full h-[56px] bg-[rgba(255,95,56,0.6)] border-[3px] border-[#FF5F38] text-white rounded-[40px] font-black text-xl hover:bg-[rgba(255,95,56,0.8)] transition-colors disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar Magic Link'}
          </button>
        </form>
        <button
          onClick={() => {
            setShowEmailInput(false)
            setMessage('')
            setError('')
          }}
          className="text-white/80 text-sm underline hover:text-white"
        >
          Voltar
        </button>
        {message && <p className="text-green-400 text-sm text-center">{message}</p>}
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowEmailInput(true)}
      className="flex items-center justify-center gap-3 w-full max-w-[235px] h-[56px] bg-[rgba(255,95,56,0.6)] border-[3px] border-[#FF5F38] text-white rounded-[40px] font-black text-xl hover:bg-[rgba(255,95,56,0.8)] transition-colors"
    >
      <MdEmail size={30} />
      <span>Entrar com email</span>
    </button>
  )
}


