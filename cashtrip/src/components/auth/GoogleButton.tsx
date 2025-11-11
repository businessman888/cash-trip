'use client'

import { FcGoogle } from 'react-icons/fc'
import { createClient } from '@/lib/supabase/client'

export function GoogleButton() {
  const handleGoogleLogin = async () => {
    const supabase = createClient()
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) {
      console.error('Erro ao fazer login com Google:', error.message)
    }
  }

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center justify-center gap-3 w-full max-w-[235px] h-[58px] bg-[#1E293B] text-white rounded-[40px] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)] font-black text-xl hover:bg-[#2d3e54] transition-colors"
    >
      <FcGoogle size={30} />
      <span>Entrar com Google</span>
    </button>
  )
}


