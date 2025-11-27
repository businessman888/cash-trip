'use client'

import { useEffect, useRef, useState } from 'react'
import { ExploreHeader } from '@/components/explore/ExploreHeader'
import { PlaceCard } from '@/components/explore/PlaceCard'
import { TrendingListItem } from '@/components/explore/TrendingListItem'

import { getPhotos } from '@/services/unsplash'
import { FiTrendingUp, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function ExplorePage() {
    const [recentImages, setRecentImages] = useState<string[]>([])
    const [compatibleImages, setCompatibleImages] = useState<string[]>([])
    const recentScrollRef = useRef<HTMLDivElement>(null)
    const compatibleScrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchImages = async () => {
            // Recent Places Images (Paris, Roma)
            const recent = await getPhotos('Paris Eiffel Tower Rome Colosseum', 2)
            setRecentImages(recent.map(img => img.url))

            // Compatible Places Images (Bali, Queenstown)
            const compatible = await getPhotos('Bali rice terrace Queenstown lake', 2)
            setCompatibleImages(compatible.map(img => img.url))
        }

        fetchImages()
    }, [])

    const scrollRecent = (direction: 'left' | 'right') => {
        if (recentScrollRef.current) {
            const scrollAmount = 220
            recentScrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    const scrollCompatible = (direction: 'left' | 'right') => {
        if (compatibleScrollRef.current) {
            const scrollAmount = 220
            compatibleScrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    return (
        <div className="min-h-screen bg-[var(--surface-main)] pb-24">
            <div className="p-6">
                <ExploreHeader />

                <section className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-inria-sans font-bold text-[18px] text-[#64748B] dark:text-[#94A3B8]">
                            Últimos lugares pesquisados
                        </h2>
                        <button
                            onClick={() => scrollRecent('right')}
                            className="w-10 h-10 rounded-full bg-[#FF5F38] flex items-center justify-center shadow-lg shadow-[#FF5F38]/20 hover:shadow-xl transition-shadow"
                        >
                            <FiChevronRight className="text-white" />
                        </button>
                    </div>
                    <div
                        ref={recentScrollRef}
                        className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide"
                    >
                        <PlaceCard
                            title="Paris"
                            subtitle="França"
                            imageUrl={recentImages[0] || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop'}
                        />
                        <PlaceCard
                            title="Roma"
                            subtitle="Itália"
                            imageUrl={recentImages[1] || 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000&auto=format&fit=crop'}
                        />
                    </div>
                </section>

                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="font-inria-sans font-bold text-[18px] text-[#64748B] dark:text-[#94A3B8]">
                            Lugares em alta
                        </h2>
                        <FiTrendingUp className="text-[#64748B] dark:text-[#94A3B8]" />
                    </div>
                    <div className="bg-[var(--surface-card)] rounded-[20px] p-2 border border-[var(--border-line)] dark:border-transparent">
                        <TrendingListItem rank={1} destination="Kyoto" country="Japão" />
                        <TrendingListItem rank={2} destination="Santorini" />
                        <TrendingListItem rank={3} destination="Lisboa" />
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-inria-sans font-bold text-[18px] text-[#64748B] dark:text-[#94A3B8]">
                            Compatíveis com você
                        </h2>
                        <button
                            onClick={() => scrollCompatible('right')}
                            className="w-10 h-10 rounded-full bg-[#FF5F38] flex items-center justify-center shadow-lg shadow-[#FF5F38]/20 hover:shadow-xl transition-shadow"
                        >
                            <FiChevronRight className="text-white" />
                        </button>
                    </div>
                    <div
                        ref={compatibleScrollRef}
                        className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide"
                    >
                        <PlaceCard
                            title="Bali"
                            subtitle="Indonésia"
                            imageUrl={compatibleImages[0] || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop'}
                            hasActionButton={false}
                            showArrowOverlay={false}
                        />
                        <PlaceCard
                            title="Queenstown"
                            subtitle="Nova Zelândia"
                            imageUrl={compatibleImages[1] || 'https://images.unsplash.com/photo-1507699622177-48857e0e5528?q=80&w=1000&auto=format&fit=crop'}
                            hasActionButton={false}
                            showArrowOverlay={false}
                        />
                    </div>
                </section>
            </div>

        </div>
    )
}
