'use client'

import { useEffect, useState } from 'react'
import { ExploreHeader } from '@/components/explore/ExploreHeader'
import { PlaceCard } from '@/components/explore/PlaceCard'
import { TrendingListItem } from '@/components/explore/TrendingListItem'
import { BottomNav } from '@/components/dashboard/BottomNav'
import { getPhotos } from '@/services/unsplash'
import { FiTrendingUp } from 'react-icons/fi'

export default function ExplorePage() {
    const [recentImages, setRecentImages] = useState<string[]>([])
    const [compatibleImages, setCompatibleImages] = useState<string[]>([])

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

    return (
        <div className="min-h-screen bg-[var(--surface-main)] pb-24">
            <div className="p-6">
                <ExploreHeader />

                <section className="mb-8">
                    <h2 className="font-inria-sans font-bold text-[18px] text-[#64748B] dark:text-[#94A3B8] mb-4">
                        Últimos lugares pesquisados
                    </h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
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
                    <div className="bg-[var(--surface-card)] rounded-[20px] p-2 border border-[var(--border-line)]">
                        <TrendingListItem rank={1} destination="Kyoto" country="Japão" />
                        <TrendingListItem rank={2} destination="Santorini" />
                        <TrendingListItem rank={3} destination="Lisboa" />
                    </div>
                </section>

                <section>
                    <h2 className="font-inria-sans font-bold text-[18px] text-[#64748B] dark:text-[#94A3B8] mb-4">
                        Compatíveis com você
                    </h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
                        <PlaceCard
                            title="Bali"
                            subtitle="Indonésia"
                            imageUrl={compatibleImages[0] || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop'}
                            hasActionButton={false}
                        />
                        <PlaceCard
                            title="Queenstown"
                            subtitle="Nova Zelândia"
                            imageUrl={compatibleImages[1] || 'https://images.unsplash.com/photo-1507699622177-48857e0e5528?q=80&w=1000&auto=format&fit=crop'}
                            hasActionButton={false}
                        />
                    </div>
                </section>
            </div>
            <BottomNav />
        </div>
    )
}
