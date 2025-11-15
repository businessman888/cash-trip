import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  // Verificar se as variáveis de ambiente estão configuradas
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // Se as variáveis não estiverem configuradas, mostrar página de configuração
  if (!supabaseUrl || !supabaseAnonKey || supabaseAnonKey === 'PLACEHOLDER_KEY_NEEDS_REPLACEMENT') {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#1E293B] to-[#0f172a] text-white p-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-black mb-4">⚙️ Configuração Necessária</h1>
            <p className="text-xl text-white/80">
              O Cash Trip precisa ser configurado antes de usar
            </p>
          </div>

          <div className="bg-red-500/20 border border-red-500 rounded-2xl p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              ⚠️ Variáveis de Ambiente Faltando
            </h2>
            <p className="text-white/90 mb-4">
              O arquivo <code className="bg-white/10 px-2 py-1 rounded">.env.local</code> precisa ser configurado com suas credenciais do Supabase.
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-3">📋 Passo 1: Obter a Chave ANON do Supabase</h3>
              <ol className="list-decimal list-inside space-y-2 text-white/80">
                <li>Acesse: <a href="https://supabase.com/dashboard/project/iqcjzgfghozcplndpmoo/settings/api" target="_blank" className="text-blue-400 hover:underline">Supabase API Settings</a></li>
                <li>Procure por &quot;Project API keys&quot;</li>
                <li>Copie a chave <code className="bg-white/10 px-2 py-1 rounded">anon public</code></li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">🔧 Passo 2: Atualizar o arquivo .env.local</h3>
              <p className="text-white/80 mb-3">
                Edite o arquivo <code className="bg-white/10 px-2 py-1 rounded">cashtrip/.env.local</code> e substitua <code className="bg-white/10 px-2 py-1 rounded">PLACEHOLDER_KEY_NEEDS_REPLACEMENT</code> pela chave que você copiou:
              </p>
              <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm">
{`# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://iqcjzgfghozcplndpmoo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
NEXT_PUBLIC_SITE_URL=http://localhost:3000`}
              </pre>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">🚀 Passo 3: Reiniciar o Servidor</h3>
              <p className="text-white/80">
                Após atualizar o arquivo, pare o servidor (Ctrl+C) e inicie novamente com:
              </p>
              <pre className="bg-black/50 p-4 rounded-lg mt-2">
                npm run dev
              </pre>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-sm text-white/60">
                💡 <strong>Dica:</strong> Certifique-se de que o arquivo .env.local está na raiz do projeto <code className="bg-white/10 px-2 py-1 rounded">cashtrip/</code>
              </p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const supabase = await createClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    // "Auth session missing!" é um estado normal (usuário não logado)
    // Apenas outros erros são problemas reais de configuração
    if (error && error.message !== 'Auth session missing!') {
      console.error('Erro de autenticação:', error.message)
      return (
        <main className="min-h-screen bg-gradient-to-b from-[#1E293B] to-[#0f172a] text-white p-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-500/20 border border-red-500 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">❌ Erro de Autenticação</h2>
              <p className="text-white/90 mb-4">
                Houve um problema ao verificar sua autenticação com o Supabase.
              </p>
              <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm">
                {error.message}
              </pre>
              <div className="mt-4">
                <a href="/login" className="text-blue-400 hover:underline">
                  Ir para a página de login
                </a>
              </div>
            </div>
          </div>
        </main>
      )
    }

    // Se não estiver logado (sem erro ou com "Auth session missing"), redirecionar para login
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
  } catch (error) {
    // Não capturar erros de redirecionamento do Next.js
    throw error
  }
}