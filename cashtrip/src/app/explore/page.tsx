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

    // State for Recent Places Carousel
    const [showLeftArrow, setShowLeftArrow] = useState(false)
    const [showRightArrow, setShowRightArrow] = useState(true)

    // State for Compatible Places Carousel
    const [showCompatibleLeftArrow, setShowCompatibleLeftArrow] = useState(false)
    const [showCompatibleRightArrow, setShowCompatibleRightArrow] = useState(true)

    const handleScroll = () => {
        if (recentScrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = recentScrollRef.current
            setShowLeftArrow(scrollLeft > 0)
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
        }
    }

    const handleCompatibleScroll = () => {
        if (compatibleScrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = compatibleScrollRef.current
            setShowCompatibleLeftArrow(scrollLeft > 0)
            setShowCompatibleRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
        }
    }

    const scrollRecent = (direction: 'left' | 'right') => {
        if (recentScrollRef.current) {
            const scrollAmount = recentScrollRef.current.clientWidth
            recentScrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    const scrollCompatible = (direction: 'left' | 'right') => {
        if (compatibleScrollRef.current) {
            const scrollAmount = compatibleScrollRef.current.clientWidth
            compatibleScrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    return (
        <div className="min-h-screen bg-[var(--surface-main)] pb-24">
            <div className="px-4 py-6">
                <ExploreHeader />

                {/* Recent Places Section */}
                <section className="mb-8 relative group">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-inria-sans font-bold text-[18px] text-[var(--text-primary)]">
                            Últimos lugares pesquisados
                        </h2>
                    </div>

                    {/* Floating Navigation Buttons - Recent */}
                    {showLeftArrow && (
                        <button
                            onClick={() => scrollRecent('left')}
                            className="absolute left-2 top-[55%] -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#E6502C] flex items-center justify-center shadow-lg shadow-[#E6502C]/30 hover:scale-110 active:scale-95 transition-all duration-200"
                            aria-label="Anterior"
                        >
                            <FiChevronLeft className="text-white text-2xl" />
                        </button>
                    )}

                    {showRightArrow && (
                        <button
                            onClick={() => scrollRecent('right')}
                            className="absolute right-2 top-[55%] -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#E6502C] flex items-center justify-center shadow-lg shadow-[#E6502C]/30 hover:scale-110 active:scale-95 transition-all duration-200"
                            aria-label="Próximo"
                        >
                            <FiChevronRight className="text-white text-2xl" />
                        </button>
                    )}

                    <div
                        ref={recentScrollRef}
                        onScroll={handleScroll}
                        className="flex gap-2 overflow-x-auto pb-8 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory"
                    >
                        <PlaceCard
                            title="Paris"
                            subtitle="França"
                            imageUrl={recentImages[0] || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop'}
                            className="min-w-[calc(50%-4px)] w-[calc(50%-4px)]"
                        />
                        <PlaceCard
                            title="Roma"
                            subtitle="Itália"
                            imageUrl={recentImages[1] || 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000&auto=format&fit=crop'}
                            className="min-w-[calc(50%-4px)] w-[calc(50%-4px)]"
                        />
                    </div>
                </section>

                {/* Trending Places Section */}
                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="font-inria-sans font-bold text-[18px] text-[var(--text-primary)]">
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

                {/* Compatible Places Section */}
                <section className="relative group">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-inria-sans font-bold text-[18px] text-[var(--text-primary)]">
                            Compatíveis com você
                        </h2>
                    </div>

                    {/* Floating Navigation Buttons - Compatible */}
                    {showCompatibleLeftArrow && (
                        <button
                            onClick={() => scrollCompatible('left')}
                            className="absolute left-2 top-[55%] -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#E6502C] flex items-center justify-center shadow-lg shadow-[#E6502C]/30 hover:scale-110 active:scale-95 transition-all duration-200"
                            aria-label="Anterior"
                        >
                            <FiChevronLeft className="text-white text-2xl" />
                        </button>
                    )}

                    {showCompatibleRightArrow && (
                        <button
                            onClick={() => scrollCompatible('right')}
                            className="absolute right-2 top-[55%] -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#E6502C] flex items-center justify-center shadow-lg shadow-[#E6502C]/30 hover:scale-110 active:scale-95 transition-all duration-200"
                            aria-label="Próximo"
                        >
                            <FiChevronRight className="text-white text-2xl" />
                        </button>
                    )}

                    <div
                        ref={compatibleScrollRef}
                        onScroll={handleCompatibleScroll}
                        className="flex gap-2 overflow-x-auto pb-8 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory"
                    >
                        <PlaceCard
                            title="Bali"
                            subtitle="Indonésia"
                            imageUrl={compatibleImages[0] || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop'}
                            hasActionButton={false}
                            showArrowOverlay={false}
                            className="min-w-[calc(50%-4px)] w-[calc(50%-4px)]"
                        />
                        <PlaceCard
                            title="Queenstown"
                            subtitle="Nova Zelândia"
                            imageUrl={compatibleImages[1] || 'https://images.unsplash.com/photo-1507699622177-48857e0e5528?q=80&w=1000&auto=format&fit=crop'}
                            hasActionButton={false}
                            showArrowOverlay={false}
                            className="min-w-[calc(50%-4px)] w-[calc(50%-4px)]"
                        />
                    </div>
                </section>
            </div>
        </div>
    )
}
