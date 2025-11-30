'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { ItineraryHeader } from '@/components/itinerary/ItineraryHeader'
import { ItineraryTabs } from '@/components/itinerary/ItineraryTabs'
import { TripProgress } from '@/components/itinerary/TripProgress'
import { MapPreview } from '@/components/itinerary/MapPreview'
import { DaySection } from '@/components/itinerary/DaySection'
import { TimelineItem } from '@/components/itinerary/TimelineItem'
import { ChatInterface } from '@/components/chat/ChatInterface'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ItineraryPage() {
    const [activeTab, setActiveTab] = useState<'roteiro' | 'chat'>('roteiro')
    const [trip, setTrip] = useState<any>(null)
    const [itineraryItems, setItineraryItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        async function fetchLatestTrip() {
            try {
                // First, check localStorage for the latest itinerary
                const savedItinerary = localStorage.getItem('latest_itinerary')

                if (savedItinerary) {
                    console.log('[Itinerary Page] Found itinerary in localStorage')
                    const itineraryData = JSON.parse(savedItinerary)
                    console.log('[Itinerary Page] Itinerary data:', itineraryData)

                    // Transform the itinerary data to match the expected format
                    const transformedTrip = {
                        id: 'local-' + Date.now(),
                        title: itineraryData.trip_title || 'Minha Viagem',
                        destination: itineraryData.destination,
                        start_date: itineraryData.start_date,
                        end_date: itineraryData.end_date,
                        budget: itineraryData.budget || 'Não definido',
                        travelers: itineraryData.travelers || 1,
                        created_at: new Date().toISOString()
                    }

                    setTrip(transformedTrip)

                    // Transform the days/activities to itinerary items
                    const transformedItems: any[] = []

                    if (itineraryData.days && Array.isArray(itineraryData.days)) {
                        itineraryData.days.forEach((day: any) => {
                            if (day.activities && Array.isArray(day.activities)) {
                                day.activities.forEach((activity: any) => {
                                    // Map time to period
                                    let period = 'morning'
                                    if (activity.time) {
                                        const hour = parseInt(activity.time.split(':')[0])
                                        if (hour >= 12 && hour < 14) period = 'lunch'
                                        else if (hour >= 14 && hour < 18) period = 'afternoon'
                                        else if (hour >= 18) period = 'dinner'
                                    }

                                    transformedItems.push({
                                        id: `item-${day.date}-${activity.time}`,
                                        date: day.date,
                                        period: period,
                                        title: activity.title,
                                        location: activity.description || activity.title,
                                        details: activity
                                    })
                                })
                            }
                        })
                    }

                    console.log('[Itinerary Page] Transformed items:', transformedItems)
                    setItineraryItems(transformedItems)
                    setLoading(false)
                    return
                }

                // Fallback to Supabase if no localStorage data
                console.log('[Itinerary Page] No localStorage data, checking Supabase...')
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    console.log('[Itinerary Page] No user found, redirecting to login')
                    router.push('/login')
                    return
                }

                // Fetch the most recent trip
                const { data: trips, error: tripError } = await supabase
                    .from('trips')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(1)

                if (tripError) throw tripError

                if (trips && trips.length > 0) {
                    const latestTrip = trips[0]
                    setTrip(latestTrip)

                    // Fetch itinerary items for this trip
                    const { data: items, error: itemsError } = await supabase
                        .from('itinerary_items')
                        .select('*')
                        .eq('trip_id', latestTrip.id)
                        .order('date', { ascending: true })

                    if (itemsError) throw itemsError
                    setItineraryItems(items || [])
                }
            } catch (error) {
                console.error('Error fetching itinerary:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchLatestTrip()
    }, [router, supabase])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--surface-main)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5F38]"></div>
            </div>
        )
    }

    if (!trip) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--surface-main)] p-6 text-center">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Nenhuma viagem encontrada</h2>
                <p className="text-gray-500 mb-8">Crie sua primeira viagem para ver o roteiro aqui.</p>
                <Link href="/trips/new" className="bg-[#FF5F38] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-[#E6502C] transition-colors">
                    Criar Nova Viagem
                </Link>
            </div>
        )
    }

    // Group items by date
    const groupedItems: { [key: string]: any[] } = {}
    itineraryItems.forEach(item => {
        if (!groupedItems[item.date]) {
            groupedItems[item.date] = []
        }
        groupedItems[item.date].push(item)
    })

    // Sort items within each day by period (morning, lunch, afternoon, dinner)
    const periodOrder = { morning: 1, lunch: 2, afternoon: 3, dinner: 4 }
    Object.keys(groupedItems).forEach(date => {
        groupedItems[date].sort((a, b) => {
            return (periodOrder[a.period as keyof typeof periodOrder] || 99) - (periodOrder[b.period as keyof typeof periodOrder] || 99)
        })
    })

    return (
        <div className="min-h-screen bg-[var(--surface-main)] pb-8">
            <div className="p-6">
                <ItineraryHeader title={`Roteiro de ${trip.destination || trip.title}`} />
                <ItineraryTabs activeTab={activeTab} onTabChange={setActiveTab} />

                {activeTab === 'roteiro' ? (
                    <>
                        <TripProgress progress={0} />
                        <MapPreview />

                        <div className="bg-[#F8FAFC] dark:bg-[#0F172A] rounded-[20px] p-4 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-inria-sans font-bold text-[16px] text-[var(--text-primary)]">
                                    Resumo
                                </h3>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Data:</strong> {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Orçamento:</strong> {trip.budget}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Viajantes:</strong> {trip.travelers}</p>
                            </div>
                        </div>

                        {Object.entries(groupedItems).map(([date, items], index) => (
                            <DaySection key={date} day={`Dia ${index + 1} - ${new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}`} progress={0}>
                                {items.map((item, idx) => (
                                    <TimelineItem
                                        key={item.id}
                                        title={item.title}
                                        time={item.period === 'morning' ? 'Manhã' : item.period === 'lunch' ? 'Almoço' : item.period === 'afternoon' ? 'Tarde' : 'Noite'}
                                        status="upcoming"
                                        weather="--"
                                        hasAction={!!item.location}
                                        actionLabel="Ver local"
                                        isLast={idx === items.length - 1}
                                    />
                                ))}
                            </DaySection>
                        ))}
                    </>
                ) : (
                    <ChatInterface />
                )}
            </div>

            <div className="fixed bottom-6 right-6">
                <Link href="/checklist" className="w-[56px] h-[56px] bg-[#FF5F38] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                </Link>
            </div>
        </div>
    )
}
