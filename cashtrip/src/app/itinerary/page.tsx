'use client'

import { useState } from 'react'
import { ItineraryHeader } from '@/components/itinerary/ItineraryHeader'
import { ItineraryTabs } from '@/components/itinerary/ItineraryTabs'
import { TripProgress } from '@/components/itinerary/TripProgress'
import { MapPreview } from '@/components/itinerary/MapPreview'
import { DaySection } from '@/components/itinerary/DaySection'
import { TimelineItem } from '@/components/itinerary/TimelineItem'
import { ChatInterface } from '@/components/chat/ChatInterface'
import { FiCheckCircle, FiCircle } from 'react-icons/fi'
import Link from 'next/link'

export default function ItineraryPage() {
    const [activeTab, setActiveTab] = useState<'roteiro' | 'chat'>('roteiro')

    return (
        <div className="min-h-screen bg-[var(--surface-main)] pb-8">
            <div className="p-6">
                <ItineraryHeader title="Roteiro de Cancún" />
                <ItineraryTabs activeTab={activeTab} onTabChange={setActiveTab} />

                {activeTab === 'roteiro' ? (
                    <>
                        <TripProgress progress={50} />
                        <MapPreview />

                        <div className="bg-[#F8FAFC] dark:bg-[#0F172A] rounded-[20px] p-4 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-inria-sans font-bold text-[16px] text-[var(--text-primary)]">
                                    Preparação
                                </h3>
                                <span className="font-inria-sans font-bold text-[14px] text-[#FF5F38]">
                                    100%
                                </span>
                            </div>
                            <div className="w-full h-[6px] bg-[#E2E8F0] dark:bg-[#334155] rounded-full overflow-hidden mb-6">
                                <div className="h-full bg-[#FF5F38] w-full rounded-full" />
                            </div>

                            <div className="relative pl-4 border-l-2 border-[#FF5F38]/20 ml-2 space-y-6">
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-0 w-[10px] h-[10px] rounded-full bg-[#FF5F38]" />
                                    <div className="flex items-start gap-4">
                                        <div className="w-[40px] h-[40px] rounded-full bg-[#FF5F38]/10 flex items-center justify-center text-[#FF5F38]">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-inria-sans font-bold text-[14px] text-[var(--text-primary)]">
                                                Passagem reservada
                                            </h4>
                                            <p className="font-inria-sans text-[12px] text-[#64748B] dark:text-[#94A3B8]">
                                                Check-in disponível em 24h.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="absolute -left-[21px] top-0 w-[10px] h-[10px] rounded-full bg-[#FF5F38]" />
                                    <div className="bg-[#FFD7D7] rounded-[16px] p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-[40px] h-[40px] rounded-full bg-[#FF5F38] flex items-center justify-center text-white">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                                    <polyline points="9 22 9 12 15 12 15 22" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-inria-sans font-bold text-[14px] text-[#1E293B]">
                                                    Hotel reservado
                                                </h4>
                                                <p className="font-inria-sans text-[12px] text-[#64748B]">
                                                    Cancun grand Hotel
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-[32px] h-[32px] rounded-full bg-[#FF5F38] flex items-center justify-center text-white">
                                            <FiCheckCircle />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DaySection day="Dia 1" progress={50}>
                            <TimelineItem
                                title="Praia la-blanca"
                                time="09:00"
                                status="completed"
                                weather="22°C"
                                hasAction
                                actionLabel="Conhecer local"
                            />
                            <TimelineItem
                                title="Restaurante habla"
                                time="12:30"
                                status="pending"
                                weather="22°C"
                                hasAction
                                actionLabel="Conhecer local"
                                isLast
                            />
                        </DaySection>

                        <DaySection day="Dia 2" progress={0}>
                            <TimelineItem
                                title="Mergulho com tubarão"
                                time="09:00"
                                status="upcoming"
                                weather="22°C"
                                hasAction
                                actionLabel="Conhecer local"
                            />
                            <TimelineItem
                                title="Restaurante Kendall"
                                time="12:30"
                                status="upcoming"
                                weather="22°C"
                                hasAction
                                actionLabel="Conhecer local"
                                isLast
                            />
                        </DaySection>

                        <DaySection day="Último dia" progress={0}>
                            <TimelineItem
                                title="Fazer as malas"
                                time="09:00"
                                status="upcoming"
                                isLast
                            />
                        </DaySection>
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
