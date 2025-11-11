import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  // Se não estiver logado, redirecionar para login
  if (!user) {
    redirect('/login')
  }

  // Função de logout
  async function handleLogout() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1E293B] to-[#0f172a] text-white p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black mb-2">Bem-vindo ao Cash Trip!</h1>
            <p className="text-xl text-white/80">
              Olá, {user.email}
            </p>
          </div>
          
          <form action={handleLogout}>
            <button
              type="submit"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full font-bold transition-colors"
            >
              Sair
            </button>
          </form>
        </div>

        <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-4">Sua conta está ativa! 🎉</h2>
          <p className="text-white/90 mb-6">
            Autenticação com Supabase configurada com sucesso. 
            Em breve você poderá planejar suas viagens perfeitas com nosso agente inteligente.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/5 p-6 rounded-xl">
              <h3 className="font-bold text-lg mb-2">✅ Login Google</h3>
              <p className="text-sm text-white/70">OAuth configurado</p>
            </div>
            <div className="bg-white/5 p-6 rounded-xl">
              <h3 className="font-bold text-lg mb-2">✅ Magic Link</h3>
              <p className="text-sm text-white/70">Login por email</p>
            </div>
            <div className="bg-white/5 p-6 rounded-xl">
              <h3 className="font-bold text-lg mb-2">✅ Recuperação</h3>
              <p className="text-sm text-white/70">Redefinir senha</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}