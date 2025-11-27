'use client'

import { useEffect, useRef, useState } from 'react'
import { TripsHeader } from '@/components/trips/TripsHeader'
import { ActiveTripCard } from '@/components/trips/ActiveTripCard'
import { RecommendedTripCard } from '@/components/trips/RecommendedTripCard'
import { TrendingPlaceCard } from '@/components/trips/TrendingPlaceCard'
import { FloatingActionButton } from '@/components/trips/FloatingActionButton'

import { getPhotos, getRandomPhoto } from '@/services/unsplash'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function TripsPage() {
    const [activeTripImage, setActiveTripImage] = useState('')
    const [recommendedImages, setRecommendedImages] = useState<string[]>([])
    const [trendingImages, setTrendingImages] = useState<string[]>([])
    const recommendedScrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchImages = async () => {
            // Active Trip Image
            const active = await getRandomPhoto('Cancun beach resort')
            if (active) setActiveTripImage(active.url)

            // Recommended Images
            const recommended = await getPhotos('Patagonia mountains landscape', 2)
            setRecommendedImages(recommended.map(img => img.url))

            // Trending Images
            const trending = await getPhotos('Lisbon city landmark Bali beach', 2)
            setTrendingImages(trending.map(img => img.url))
        }

        fetchImages()
    }, [])

    const scrollRecommended = (direction: 'left' | 'right') => {
        if (recommendedScrollRef.current) {
            const scrollAmount = 300
            recommendedScrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    return (
        <div className="min-h-screen bg-[var(--surface-main)] pb-24">
            <div className="px-4 py-6">
                <TripsHeader />

                <section className="mb-6">
                    <h2 className="font-inria-sans font-bold text-[18px] text-[var(--text-primary)] mb-4">
                        Viagens Ativas
                    </h2>
                    <ActiveTripCard
                        destination="Cancún"
                        country="México"
                        startDate="20/07"
                        endDate="10/08"
                        duration={21}
                        travelers={2}
                        imageUrl={activeTripImage || 'https://images.unsplash.com/photo-1552074291-ad4dfd8b11f0?q=80&w=1000&auto=format&fit=crop'}
                        status={{
                            ticketsPurchased: true,
                            hotelReserved: true,
                            insurance: false
                        }}
                        progress={75}
                    />
                </section>

                <section className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-inria-sans font-bold text-[18px] text-[var(--text-primary)]">
                            Viagens Recomendadas
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => scrollRecommended('left')}
                                className="w-10 h-10 rounded-full bg-white dark:bg-[var(--surface-card)] border border-[#E2E8F0] dark:border-transparent flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                            >
                                <FiChevronLeft className="text-[#94A3B8]" />
                            </button>
                            <button
                                onClick={() => scrollRecommended('right')}
                                className="w-10 h-10 rounded-full bg-[#FF5F38] flex items-center justify-center shadow-lg shadow-[#FF5F38]/20 hover:shadow-xl transition-shadow"
                            >
                                <FiChevronRight className="text-white" />
                            </button>
                        </div>
                    </div>
                    <div
                        ref={recommendedScrollRef}
                        className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory"
                    >
                        <RecommendedTripCard
                            destination="Patagônia"
                            country="Argentina"
                            category="Aventura"
                            compatibility={92}
                            description="Perfeito para quem ama trilhas e natureza."
                            imageUrl={recommendedImages[0] || 'https://images.unsplash.com/photo-1533435137002-455932d8570a?q=80&w=1000&auto=format&fit=crop'}
                        />
                        <RecommendedTripCard
                            destination="Machu Picchu"
                            country="Peru"
                            category="História"
                            compatibility={88}
                            description="Explore as ruínas incas e a cultura local."
                            imageUrl={recommendedImages[1] || 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1000&auto=format&fit=crop'}
                        />
                    </div>
                </section>

                <section>
                    <h2 className="font-inria-sans font-bold text-[18px] text-[var(--text-primary)] mb-4">
                        Lugares em Alta
                    </h2>
                    <TrendingPlaceCard
                        destination="Lisboa"
                        country="Portugal"
                        description="Destino popular por sua culinária e história."
                        imageUrl={trendingImages[0] || 'https://images.unsplash.com/photo-1555881400-74d7acaacd81?q=80&w=1000&auto=format&fit=crop'}
                    />
                    <TrendingPlaceCard
                        destination="Bali"
                        country="Indonésia"
                        description="Praias exóticas e um refúgio espiritual."
                        imageUrl={trendingImages[1] || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop'}
                    />
                </section>
            </div>

            <FloatingActionButton />
        </div>
    )
}
