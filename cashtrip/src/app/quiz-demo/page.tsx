import Image from "next/image";
import { QuizIcon, QuizIllustration } from "@/components/ui/QuizIcon";
import { QUIZ_ICONS } from "@/lib/quiz-icons";

/**
 * Página de demonstração dos ícones do quiz
 * Acesse: http://localhost:3000/quiz-demo
 */
export default function QuizDemoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1E293B] to-[#0f172a] text-white p-10">
      <div className="max-w-7xl mx-auto">
        {/* Logo */}
        <div className="mb-12 flex items-center gap-4">
          <Image 
            src="/logo.svg" 
            alt="Cash Trip Logo" 
            width={150} 
            height={50}
            className="brightness-0 invert"
          />
          <h1 className="text-4xl font-black">Demonstração dos Ícones</h1>
        </div>

        {/* Ilustrações de Hospedagens */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 border-b border-white/20 pb-3">
            📸 Ilustrações de Hospedagens
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <QuizIllustration 
                illustration="hospedagem-hotel" 
                alt="Hotel" 
                width={250}
                height={200}
              />
              <p className="text-center mt-4 font-semibold">Hotel</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <QuizIllustration 
                illustration="hospedagem-Resort-boutique" 
                alt="Resort Boutique" 
                width={250}
                height={200}
              />
              <p className="text-center mt-4 font-semibold">Resort Boutique</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <QuizIllustration 
                illustration="imagem-hospedagens-airbnb-casa" 
                alt="Airbnb/Casa" 
                width={250}
                height={200}
              />
              <p className="text-center mt-4 font-semibold">Airbnb/Casa</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <QuizIllustration 
                illustration="imagem-hospedagens-hostel" 
                alt="Hostel" 
                width={250}
                height={200}
              />
              <p className="text-center mt-4 font-semibold">Hostel</p>
            </div>
          </div>
        </section>

        {/* Ícones de Gênero */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 border-b border-white/20 pb-3">
            👤 Gênero
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-4">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm flex flex-col items-center gap-2">
              <QuizIcon icon={QUIZ_ICONS.genero.homem} alt="Homem" size={64} />
              <p className="text-xs text-center">Homem</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm flex flex-col items-center gap-2">
              <QuizIcon icon={QUIZ_ICONS.genero.mulher} alt="Mulher" size={64} />
              <p className="text-xs text-center">Mulher</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm flex flex-col items-center gap-2">
              <QuizIcon icon={QUIZ_ICONS.genero.naoBinario} alt="Não Binário" size={64} />
              <p className="text-xs text-center">Não Binário</p>
            </div>
          </div>
        </section>

        {/* Ícones de Pets */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 border-b border-white/20 pb-3">
            🐾 Pets
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-4">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm flex flex-col items-center gap-2">
              <QuizIcon icon={QUIZ_ICONS.pets.cachorro} alt="Cachorro" size={64} />
              <p className="text-xs text-center">Cachorro</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm flex flex-col items-center gap-2">
              <QuizIcon icon={QUIZ_ICONS.pets.gato} alt="Gato" size={64} />
              <p className="text-xs text-center">Gato</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm flex flex-col items-center gap-2">
              <QuizIcon icon={QUIZ_ICONS.pets.outroPet} alt="Outro Pet" size={64} />
              <p className="text-xs text-center">Outro Pet</p>
            </div>
          </div>
        </section>

        {/* Estilo de Viagem */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 border-b border-white/20 pb-3">
            ✈️ Estilo de Viagem
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-4">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm flex flex-col items-center gap-2">
              <QuizIcon icon={QUIZ_ICONS.estiloViagem.aventureiro} alt="Aventureiro" size={64} />
              <p className="text-xs text-center">Aventureiro</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm flex flex-col items-center gap-2">
              <QuizIcon icon={QUIZ_ICONS.estiloViagem.cultural} alt="Cultural" size={64} />
              <p className="text-xs text-center">Cultural</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm flex flex-col items-center gap-2">
              <QuizIcon icon={QUIZ_ICONS.estiloViagem.relax} alt="Relax" size={64} />
              <p className="text-xs text-center">Relax</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm flex flex-col items-center gap-2">
              <QuizIcon icon={QUIZ_ICONS.estiloViagem.gastronomico} alt="Gastronômico" size={64} />
              <p className="text-xs text-center">Gastronômico</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm flex flex-col items-center gap-2">
              <QuizIcon icon={QUIZ_ICONS.estiloViagem.luxo} alt="Luxo" size={64} />
              <p className="text-xs text-center">Luxo</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm flex flex-col items-center gap-2">
              <QuizIcon icon={QUIZ_ICONS.estiloViagem.economico} alt="Econômico" size={64} />
              <p className="text-xs text-center">Econômico</p>
            </div>
          </div>
        </section>

        {/* Alimentação */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 border-b border-white/20 pb-3">
            🍽️ Culinária
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-4">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm flex flex-col items-center gap-2">
              <QuizIcon icon={QUIZ_ICONS.alimentacao.brasileira} alt="Brasileira" size={64} />
              <p className="text-xs text-center">Brasileira</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm flex flex-col items-center gap-2">
              <QuizIcon icon={QUIZ_ICONS.alimentacao.italiana} alt="Italiana" size={64} />
              <p className="text-xs text-center">Italiana</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm flex flex-col items-center gap-2">
              <QuizIcon icon={QUIZ_ICONS.alimentacao.japonesaAsiatica} alt="Japonesa/Asiática" size={64} />
              <p className="text-xs text-center">Japonesa</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm flex flex-col items-center gap-2">
              <QuizIcon icon={QUIZ_ICONS.alimentacao.mexicanaLatina} alt="Mexicana/Latina" size={64} />
              <p className="text-xs text-center">Mexicana</p>
            </div>
          </div>
        </section>

        {/* Música */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 border-b border-white/20 pb-3">
            🎵 Estilos Musicais
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-4">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm flex flex-col items-center gap-2">
              <QuizIcon icon={QUIZ_ICONS.musica.rock} alt="Rock" size={64} />
              <p className="text-xs text-center">Rock</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm flex flex-col items-center gap-2">
              <QuizIcon icon={QUIZ_ICONS.musica.jazz} alt="Jazz" size={64} />
              <p className="text-xs text-center">Jazz</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm flex flex-col items-center gap-2">
              <QuizIcon icon={QUIZ_ICONS.musica.pop} alt="Pop" size={64} />
              <p className="text-xs text-center">Pop</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm flex flex-col items-center gap-2">
              <QuizIcon icon={QUIZ_ICONS.musica.sertanejo} alt="Sertanejo" size={64} />
              <p className="text-xs text-center">Sertanejo</p>
            </div>
          </div>
        </section>

        {/* Informação de uso */}
        <section className="mt-16 bg-blue-500/10 rounded-xl p-8 border border-blue-500/30">
          <h3 className="text-2xl font-bold mb-4">📝 Como Usar</h3>
          <div className="space-y-4 text-sm">
            <div className="bg-black/30 rounded p-4 font-mono">
              <p className="text-gray-300 mb-2">{'// Importar o componente:'}</p>
              <p>{'import { QuizIcon } from "@/components/ui/QuizIcon"'}</p>
              <p>{'import { QUIZ_ICONS } from "@/lib/quiz-icons"'}</p>
              <p className="text-gray-300 mt-4 mb-2">{'// Usar no JSX:'}</p>
              <p>{'<QuizIcon icon={QUIZ_ICONS.genero.homem} alt="Homem" size={64} />'}</p>
            </div>
            <p className="text-white/80">
              ✅ Todos os 127 arquivos SVG foram organizados em <code className="bg-black/30 px-2 py-1 rounded">/public/icons</code> e <code className="bg-black/30 px-2 py-1 rounded">/public/illustrations</code>
            </p>
            <p className="text-white/80">
              ✅ Use <code className="bg-black/30 px-2 py-1 rounded">QUIZ_ICONS</code> para acessar os ícones com type-safety
            </p>
            <p className="text-white/80">
              ✅ Componentes otimizados com Next.js Image para melhor performance
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}










