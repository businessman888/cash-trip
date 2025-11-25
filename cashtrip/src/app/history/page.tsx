'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SearchBar } from '@/components/history/SearchBar'
import { TabSelector } from '@/components/history/TabSelector'
import { TripHistoryCard } from '@/components/history/TripHistoryCard'
import { FaChevronLeft } from 'react-icons/fa'

interface Trip {
    id: string
    destination: string
    startDate: string
    endDate: string
    totalCost: number
    type: 'completed' | 'recent'
}

// Mock data baseado no design fornecido
const mockTrips: Trip[] = [
    {
        id: '1',
        destination: 'Tóquio, Japão',
        startDate: '2024-05-15',
        endDate: '2024-05-25',
        totalCost: 12580,
        type: 'completed'
    },
    {
        id: '2',
        destination: 'Rio de Janeiro, Brasil',
        startDate: '2024-02-01',
        endDate: '2024-02-05',
        totalCost: 2350,
        type: 'completed'
    },
    {
        id: '3',
        destination: 'Paris, França',
        startDate: '2023-09-10',
        endDate: '2023-09-18',
        totalCost: 9800,
        type: 'completed'
    },
    {
        id: '4',
        destination: 'Londres, Inglaterra',
        startDate: '2023-07-01',
        endDate: '2023-07-10',
        totalCost: 11300,
        type: 'recent'
    },
    {
        id: '5',
        destination: 'Barcelona, Espanha',
        startDate: '2023-05-15',
        endDate: '2023-05-22',
        totalCost: 8900,
        type: 'recent'
    }
]

export default function HistoryPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'completed' | 'recent'>('completed')
    const [searchQuery, setSearchQuery] = useState('')

    // Filter trips based on active tab and search query
    const filteredTrips = mockTrips.filter(trip => {
        const matchesTab = trip.type === activeTab
        const matchesSearch = trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesTab && matchesSearch
    })

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
                    Histórico
                </h1>
            </div>

            {/* Tab Selector */}
            <div className="px-4 mb-5 max-w-md mx-auto">
                <TabSelector
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
            </div>

            {/* Search Bar */}
            <div className="px-4 mb-6 max-w-md mx-auto">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                />
            </div>

            {/* Trip Cards */}
            <div className="px-4 space-y-3 max-w-md mx-auto">
                {filteredTrips.length > 0 ? (
                    filteredTrips.map((trip) => (
                        <TripHistoryCard
                            key={trip.id}
                            destination={trip.destination}
                            startDate={trip.startDate}
                            endDate={trip.endDate}
                            totalCost={trip.totalCost}
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
                            {searchQuery
                                ? 'Nenhuma viagem encontrada'
                                : activeTab === 'completed'
                                    ? 'Nenhuma viagem realizada ainda'
                                    : 'Nenhuma busca recente'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
