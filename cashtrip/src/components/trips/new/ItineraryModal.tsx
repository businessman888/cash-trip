'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiCheck } from 'react-icons/fi'
import { IoAirplane, IoBed, IoRestaurant, IoCamera } from 'react-icons/io5'

interface Activity {
    time: string
    title: string
    description: string
    icon: 'plane' | 'hotel' | 'food' | 'camera'
    cost: number
}

interface DayItinerary {
    date: string
    title: string
    activities: Activity[]
}

interface ItineraryData {
    trip_title: string
    destination: string
    start_date: string
    end_date: string
    budget: string
    travelers: number
    flight_summary: {
        airline: string
        price: number
    }
    hotel_summary: {
        name: string
        price: number
    }
    days: DayItinerary[]
}

interface ItineraryModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    onReject: () => void
    itinerary: ItineraryData | null
}

export function ItineraryModal({ isOpen, onClose, onConfirm, onReject, itinerary }: ItineraryModalProps) {
    if (!itinerary) return null

    // Calculate total estimated cost
    const flightCost = itinerary.flight_summary?.price || 0
    const hotelCost = itinerary.hotel_summary?.price || 0
    const activitiesCost = itinerary.days.reduce((acc, day) => {
        return acc + day.activities.reduce((dAcc, act) => dAcc + (act.cost || 0), 0)
    }, 0)
    const totalCost = flightCost + hotelCost + activitiesCost

    // Helper to get icon component
    const getIcon = (type: string) => {
        switch (type) {
            case 'plane': return <IoAirplane className="text-[#FF5F38]" />
            case 'hotel': return <IoBed className="text-[#FF5F38]" />
            case 'food': return <IoRestaurant className="text-[#FF5F38]" />
            case 'camera': return <IoCamera className="text-[#FF5F38]" />
            default: return <IoCamera className="text-[#FF5F38]" />
        }
    }

    // Format currency
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--surface-card)] rounded-t-[30px] h-[90vh] overflow-hidden flex flex-col shadow-2xl border-t border-white/10"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
                            <h2 className="text-xl font-bold text-[var(--text-primary)] font-inria-sans">
                                Seu Roteiro Completo
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                            >
                                <FiX className="text-2xl text-[var(--text-secondary)]" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">

                            {/* Hero Image */}
                            <div className="relative h-48 w-full rounded-[20px] overflow-hidden shadow-md">
                                <img
                                    src={`https://source.unsplash.com/800x400/?${itinerary.destination},travel`}
                                    alt={itinerary.destination}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                                    <h1 className="text-2xl font-bold text-white font-inria-sans">{itinerary.trip_title}</h1>
                                    <p className="text-white/90 text-sm">
                                        {itinerary.start_date} a {itinerary.end_date} • {itinerary.days.length} dias
                                    </p>
                                </div>
                            </div>

                            {/* Cost Breakdown Card */}
                            <div className="bg-white dark:bg-[#1E293B] rounded-[20px] p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-[#FFDdd6] rounded-xl">
                                            <IoAirplane className="text-xl text-[#FF5F38]" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-[var(--text-primary)]">Passagem Aérea</p>
                                            <p className="text-xs text-[var(--text-secondary)]">{itinerary.flight_summary?.airline || 'Ida e volta'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-[#FF5F38]">{formatCurrency(flightCost)}</p>
                                        <p className="text-[10px] text-[var(--text-secondary)]">por pessoa</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-[#FFDdd6] rounded-xl">
                                            <IoBed className="text-xl text-[#FF5F38]" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-[var(--text-primary)]">{itinerary.hotel_summary?.name || 'Hotel'}</p>
                                            <p className="text-xs text-[var(--text-secondary)]">{itinerary.days.length} diárias</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-[#FF5F38]">{formatCurrency(hotelCost)}</p>
                                        <p className="text-[10px] text-[var(--text-secondary)]">Total</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-dashed border-gray-200 dark:border-gray-700 pt-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-[#FFDdd6] rounded-xl">
                                            <IoRestaurant className="text-xl text-[#FF5F38]" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-[var(--text-primary)]">Outras despesas</p>
                                            <p className="text-xs text-[var(--text-secondary)]">Atividades, alimentação</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-[#FF5F38]">{formatCurrency(activitiesCost)}</p>
                                        <p className="text-[10px] text-[var(--text-secondary)]">estimado</p>
                                    </div>
                                </div>
                            </div>

                            {/* Total Cost Highlight */}
                            <div className="bg-[#FFDdd6] rounded-[20px] p-6 text-center">
                                <p className="text-[#FF5F38] font-bold text-sm uppercase tracking-wide mb-1">Custo total da viagem</p>
                                <p className="text-4xl font-bold text-[#FF5F38] font-inria-sans">{formatCurrency(totalCost)}</p>
                                <p className="text-[#FF5F38]/80 text-xs mt-1">por pessoa (estimado)</p>
                            </div>

                            {/* Daily Timeline */}
                            <div className="space-y-8">
                                {itinerary.days.map((day, index) => (
                                    <div key={index} className="relative pl-4 border-l-2 border-[#FFDdd6] space-y-6">
                                        {/* Day Header */}
                                        <div className="absolute -left-[21px] top-0 bg-[#FFDdd6] p-2 rounded-lg">
                                            <span className="font-bold text-[#FF5F38] text-xs">DIA {index + 1}</span>
                                        </div>

                                        <div className="pt-1">
                                            <h3 className="font-bold text-lg text-[var(--text-primary)]">{day.date}</h3>
                                            <p className="text-[var(--text-primary)] font-medium">{day.title}</p>
                                        </div>

                                        {/* Activities */}
                                        {day.activities.map((activity, actIndex) => (
                                            <div key={actIndex} className="flex gap-4 items-start">
                                                <div className="flex flex-col items-center gap-1 min-w-[50px]">
                                                    <span className="text-sm font-bold text-[var(--text-secondary)]">{activity.time}</span>
                                                    <div className="w-[2px] h-full bg-[#FFDdd6] rounded-full" />
                                                </div>
                                                <div className="flex-1 pb-4">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {getIcon(activity.icon)}
                                                        <h4 className="font-bold text-[var(--text-primary)]">{activity.title}</h4>
                                                    </div>
                                                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                                        {activity.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>

                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 bg-[var(--surface-card)] border-t border-gray-100 dark:border-gray-800 shrink-0 flex flex-col gap-3">
                            <button
                                onClick={onConfirm}
                                className="w-full py-4 bg-[#FF5F38] text-white rounded-[20px] font-bold text-lg shadow-lg hover:bg-[#e04f2c] transition-colors flex items-center justify-center gap-2"
                            >
                                <FiCheck className="text-2xl" />
                                Confirmar Roteiro
                            </button>
                            <button
                                onClick={onReject}
                                className="w-full py-3 text-[var(--text-secondary)] font-medium hover:text-[var(--text-primary)] transition-colors"
                            >
                                Quero fazer alterações
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
