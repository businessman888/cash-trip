'use client'

import { useEffect, useState } from 'react'
import { TripsHeader } from '@/components/trips/TripsHeader'
import { ActiveTripCard } from '@/components/trips/ActiveTripCard'
import { RecommendedTripCard } from '@/components/trips/RecommendedTripCard'
import { TrendingPlaceCard } from '@/components/trips/TrendingPlaceCard'
import { BottomNav } from '@/components/dashboard/BottomNav'
import { getPhotos, getRandomPhoto } from '@/services/unsplash'

export default function TripsPage() {
    const [activeTripImage, setActiveTripImage] = useState('')
    const [recommendedImages, setRecommendedImages] = useState<string[]>([])
    const [trendingImages, setTrendingImages] = useState<string[]>([])

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

    return (
        <div className="min-h-screen bg-[var(--surface-main)] pb-24">
            <div className="p-6">
                <TripsHeader />

                <section className="mb-8">
                    <h2 className="font-inria-sans font-bold text-[20px] text-[#64748B] dark:text-[#94A3B8] mb-4">
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

                <section className="mb-8">
                    <h2 className="font-inria-sans font-bold text-[20px] text-[#64748B] dark:text-[#94A3B8] mb-4">
                        Viagens Recomendadas
                    </h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
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
                    <h2 className="font-inria-sans font-bold text-[20px] text-[#64748B] dark:text-[#94A3B8] mb-4">
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
            <BottomNav />
        </div>
    )
}
