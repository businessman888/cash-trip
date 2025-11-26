'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TabSelector } from '@/components/rascunhos/TabSelector'
import { LocationCard } from '@/components/rascunhos/LocationCard'
import { FaChevronLeft } from 'react-icons/fa'

interface SavedLocation {
    id: string
    name: string
    location: string
    temperature: number
    imageQuery: string
    type: 'saved' | 'pending'
}

// Mock data baseado no design do Figma
const mockLocations: SavedLocation[] = [
    {
        id: '1',
        name: 'Museu do Louvre',
        location: 'Paris, França',
        temperature: 25,
        imageQuery: 'louvre museum paris',
        type: 'saved'
    },
    {
        id: '2',
        name: 'Torre de Belém',
        location: 'Lisboa, Portugal',
        temperature: 15,
        imageQuery: 'belem tower lisbon',
        type: 'saved'
    },
    {
        id: '3',
        name: 'Café Majestic',
        location: 'Porto, Portugal',
        temperature: 12,
        imageQuery: 'majestic cafe porto',
        type: 'saved'
    }
]

export default function RascunhosPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'saved' | 'pending'>('saved')

    // Filter locations based on active tab
    const filteredLocations = mockLocations.filter(location => location.type === activeTab)

    const handleViewLocation = (locationId: string) => {
        // TODO: Navigate to location detail page
        console.log('View location:', locationId)
    }

    return (
        <div
            className="min-h-screen pb-20 font-roboto-condensed"
            style={{ background: 'var(--surface-main)' }}
        >
            {/* Header with Back Button and Title */}
            <div className="px-4 pt-6 pb-6 flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity"
                    aria-label="Voltar"
                >
                    <FaChevronLeft size={24} style={{ color: 'var(--text-primary)' }} />
                </button>

                <h1
                    className="text-[24px] font-bold font-roboto-condensed flex-1 text-center mr-10"
                    style={{ color: 'var(--text-primary)' }}
                >
                    Rascunhos
                </h1>
            </div>

            {/* Tab Selector */}
            <div className="px-4 mb-5 max-w-md mx-auto">
                <TabSelector
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
            </div>

            {/* Location Cards */}
            <div className="px-4 space-y-3 max-w-md mx-auto">
                {filteredLocations.length > 0 ? (
                    filteredLocations.map((location) => (
                        <LocationCard
                            key={location.id}
                            name={location.name}
                            location={location.location}
                            temperature={location.temperature}
                            imageQuery={location.imageQuery}
                            onViewLocation={() => handleViewLocation(location.id)}
                        />
                    ))
                ) : (
                    <div
                        className="text-center py-12 rounded-[20px]"
                        style={{ background: 'var(--surface-card)' }}
                    >
                        <p
                            className="text-[16px] font-roboto-condensed"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            {activeTab === 'saved'
                                ? 'Nenhum local salvo ainda'
                                : 'Nenhum roteiro pendente'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
