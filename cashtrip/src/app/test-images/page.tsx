'use client'

import { useState } from 'react'
import { usePlaceImages } from '@/hooks/usePlaceImages'
import { CTImage } from '@/components/ui/CTImage'

export default function TestImagesPage() {
  const [placeId, setPlaceId] = useState<string>('')
  const [searchPlaceId, setSearchPlaceId] = useState<string | null>(null)
  
  const { heroImage, galleryImages, loading, error, cached } = usePlaceImages(searchPlaceId)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (placeId.trim()) {
      setSearchPlaceId(placeId.trim())
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1E293B] to-[#0f172a] p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-black text-white mb-4">
          🖼️ Teste de Sistema de Imagens
        </h1>
        
        <p className="text-white/80 mb-8">
          Sistema híbrido com Supabase Storage + Unsplash API
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-10">
          <div className="flex gap-4">
            <input
              type="text"
              value={placeId}
              onChange={(e) => setPlaceId(e.target.value)}
              placeholder="Cole o UUID do place aqui..."
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white placeholder:text-white/50 border-2 border-[#FF5F38] focus:outline-none focus:ring-2 focus:ring-[#FF5F38]"
            />
            <button
              type="submit"
              disabled={!placeId.trim() || loading}
              className="px-8 py-3 bg-[#FF5F38] text-white font-bold rounded-lg hover:bg-[#E6502C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Buscando...' : 'Buscar Imagens'}
            </button>
          </div>
          <p className="text-sm text-white/60 mt-2">
            💡 Primeiro crie um place no Supabase e cole o ID aqui
          </p>
        </form>

        {/* Instructions */}
        {!searchPlaceId && (
          <div className="bg-white/10 rounded-xl p-8 backdrop-blur-sm border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              📋 Como Testar:
            </h2>
            <ol className="text-white/90 space-y-3 list-decimal list-inside">
              <li>Execute as migrations SQL no Supabase Dashboard</li>
              <li>Crie os buckets <code className="bg-black/30 px-2 py-1 rounded">places</code> e <code className="bg-black/30 px-2 py-1 rounded">users</code></li>
              <li>Habilite Image Transformations no Storage</li>
              <li>Crie um place de teste (ex: Cape Town) executando:
                <pre className="bg-black/50 p-4 rounded-lg mt-2 overflow-x-auto text-sm">
{`INSERT INTO public.places (name, city, country, country_code, is_popular)
VALUES ('Cape Town', 'Cape Town', 'South Africa', 'ZA', true)
RETURNING *;`}
                </pre>
              </li>
              <li>Copie o <code className="bg-black/30 px-2 py-1 rounded">id</code> retornado e cole no campo acima</li>
              <li>Clique em "Buscar Imagens"</li>
            </ol>
            <p className="text-white/70 mt-6">
              📖 Veja instruções completas em <code className="bg-black/30 px-2 py-1 rounded">SETUP_IMAGES.md</code>
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && searchPlaceId && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#FF5F38] border-t-transparent mb-4"></div>
            <p className="text-white text-xl">Buscando imagens no Unsplash...</p>
            <p className="text-white/60 text-sm mt-2">Primeira vez pode levar alguns segundos</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-6 mb-10">
            <h3 className="text-red-400 font-bold text-xl mb-2">❌ Erro</h3>
            <p className="text-white">{error}</p>
            <details className="mt-4">
              <summary className="text-white/70 cursor-pointer hover:text-white">
                Ver possíveis soluções
              </summary>
              <ul className="mt-2 text-white/80 space-y-2 list-disc list-inside">
                <li>Verifique se o place_id existe na tabela places</li>
                <li>Verifique se as credenciais Unsplash estão corretas</li>
                <li>Verifique se os buckets foram criados</li>
                <li>Veja o console do navegador (F12) para mais detalhes</li>
              </ul>
            </details>
          </div>
        )}

        {/* Success State */}
        {!loading && !error && searchPlaceId && (
          <>
            {/* Status Badge */}
            <div className="mb-8 flex items-center gap-4">
              <span className={`px-4 py-2 rounded-full font-bold ${
                cached 
                  ? 'bg-green-500/20 text-green-400 border-2 border-green-500' 
                  : 'bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500'
              }`}>
                {cached ? '✅ Cache Hit (Rápido!)' : '⏳ Primeira Busca (Unsplash)'}
              </span>
              <span className="text-white/60">
                {heroImage ? `${1 + galleryImages.length} imagem(ns) carregada(s)` : 'Nenhuma imagem encontrada'}
              </span>
            </div>

            {/* Hero Image */}
            {heroImage && (
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-white mb-4">Hero Image</h2>
                <div className="relative">
                  <CTImage
                    src={heroImage.urls.large_1080}
                    alt="Hero Image"
                    width={1080}
                    height={600}
                    dominantColor={heroImage.dominant_hex || undefined}
                    className="rounded-2xl shadow-2xl"
                    objectFit="cover"
                  />
                  {/* Attribution */}
                  {heroImage.author && (
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <p className="text-sm text-white">
                        📸 Foto por{' '}
                        <a 
                          href={heroImage.author_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="underline hover:text-[#FF5F38] transition-colors"
                        >
                          {heroImage.author}
                        </a>
                        {' '}no Unsplash
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Galeria ({galleryImages.length} imagens)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleryImages.map((img) => (
                    <div key={img.id} className="relative group">
                      <CTImage
                        src={img.urls.medium_720}
                        alt={`Gallery image ${img.id}`}
                        width={720}
                        height={480}
                        dominantColor={img.dominant_hex || undefined}
                        className="rounded-xl shadow-lg transition-transform group-hover:scale-105"
                        objectFit="cover"
                      />
                      {img.author && (
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-end p-4">
                          <p className="text-sm text-white">
                            📸 {img.author}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!heroImage && !galleryImages.length && (
              <div className="text-center py-20">
                <p className="text-white/60 text-xl">
                  Nenhuma imagem encontrada para este destino
                </p>
                <p className="text-white/40 mt-2">
                  Tente outro place_id ou verifique se o Unsplash retornou resultados
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}






