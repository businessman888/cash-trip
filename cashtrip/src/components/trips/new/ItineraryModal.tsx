'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiDollarSign, FiMapPin, FiCalendar, FiUsers } from 'react-icons/fi'
import { MdFlight, MdHotel, MdRestaurant, MdAttractions } from 'react-icons/md'

interface ItineraryModalProps {
    isOpen: boolean
    onClose: () => void
    onApprove: () => void
    onReject: () => void
    itinerary: {
        trip_title: string
        destination: string
        start_date: string
        end_date: string
        travelers: number
        budget: string
        financial: {
            flights: number
            hotel: number
            activities: number
            food: number
            total: number
        }
        days: Array<{
            date: string
            activities: Array<{
                time: string
                title: string
                location: string
                type: 'morning' | 'lunch' | 'afternoon' | 'dinner'
                cost?: number
            }>
        }>
    }
}

export function ItineraryModal({ isOpen, onClose, onApprove, onReject, itinerary }: ItineraryModalProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
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
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed inset-x-0 bottom-0 z-50 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-4"
                    >
                        <div className="bg-white dark:bg-[#0F172A] rounded-t-[30px] sm:rounded-[30px] w-full sm:max-w-[600px] max-h-[90vh] overflow-y-auto shadow-2xl">
                            {/* Header */}
                            <div className="sticky top-0 bg-white dark:bg-[#0F172A] border-b border-[#E2E8F0] dark:border-[#1E293B] p-6 flex justify-between items-center z-10">
                                <div>
                                    <h2 className="font-inria-sans font-bold text-[24px] text-[#1E293B] dark:text-white">
                                        {itinerary.trip_title}
                                    </h2>
                                    <div className="flex items-center gap-4 mt-2 text-[14px] text-[#64748B] dark:text-[#94A3B8]">
                                        <div className="flex items-center gap-1">
                                            <FiMapPin className="text-[16px]" />
                                            <span>{itinerary.destination}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FiCalendar className="text-[16px]" />
                                            <span>{formatDate(itinerary.start_date)} - {formatDate(itinerary.end_date)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FiUsers className="text-[16px]" />
                                            <span>{itinerary.travelers} {itinerary.travelers > 1 ? 'pessoas' : 'pessoa'}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-white transition-colors"
                                >
                                    <FiX className="text-2xl" />
                                </button>
                            </div>

                            {/* Financial Breakdown */}
                            <div className="p-6 border-b border-[#E2E8F0] dark:border-[#1E293B]">
                                <h3 className="font-inria-sans font-bold text-[18px] text-[#1E293B] dark:text-white mb-4">
                                    Resumo Financeiro
                                </h3>
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] dark:bg-[#1E293B] rounded-[16px]">
                                        <div className="w-[40px] h-[40px] rounded-[12px] bg-[#FFE5E0] dark:bg-[#FF5F38]/20 flex items-center justify-center">
                                            <MdFlight className="text-[20px] text-[#FF5F38]" />
                                        </div>
                                        <div>
                                            <p className="text-[12px] text-[#64748B] dark:text-[#94A3B8]">Voos</p>
                                            <p className="font-inria-sans font-bold text-[16px] text-[#1E293B] dark:text-white">
                                                {formatCurrency(itinerary.financial.flights)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] dark:bg-[#1E293B] rounded-[16px]">
                                        <div className="w-[40px] h-[40px] rounded-[12px] bg-[#FFE5E0] dark:bg-[#FF5F38]/20 flex items-center justify-center">
                                            <MdHotel className="text-[20px] text-[#FF5F38]" />
                                        </div>
                                        <div>
                                            <p className="text-[12px] text-[#64748B] dark:text-[#94A3B8]">Hotel</p>
                                            <p className="font-inria-sans font-bold text-[16px] text-[#1E293B] dark:text-white">
                                                {formatCurrency(itinerary.financial.hotel)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] dark:bg-[#1E293B] rounded-[16px]">
                                        <div className="w-[40px] h-[40px] rounded-[12px] bg-[#FFE5E0] dark:bg-[#FF5F38]/20 flex items-center justify-center">
                                            <MdAttractions className="text-[20px] text-[#FF5F38]" />
                                        </div>
                                        <div>
                                            <p className="text-[12px] text-[#64748B] dark:text-[#94A3B8]">Atividades</p>
                                            <p className="font-inria-sans font-bold text-[16px] text-[#1E293B] dark:text-white">
                                                {formatCurrency(itinerary.financial.activities)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] dark:bg-[#1E293B] rounded-[16px]">
                                        <div className="w-[40px] h-[40px] rounded-[12px] bg-[#FFE5E0] dark:bg-[#FF5F38]/20 flex items-center justify-center">
                                            <MdRestaurant className="text-[20px] text-[#FF5F38]" />
                                        </div>
                                        <div>
                                            <p className="text-[12px] text-[#64748B] dark:text-[#94A3B8]">Alimentação</p>
                                            <p className="font-inria-sans font-bold text-[16px] text-[#1E293B] dark:text-white">
                                                {formatCurrency(itinerary.financial.food)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-[#FF5F38] rounded-[16px]">
                                    <span className="font-inria-sans font-bold text-[18px] text-white">Total Estimado</span>
                                    <span className="font-inria-sans font-bold text-[24px] text-white">
                                        {formatCurrency(itinerary.financial.total)}
                                    </span>
                                </div>
                            </div>

                            {/* Itinerary Days */}
                            <div className="p-6">
                                <h3 className="font-inria-sans font-bold text-[18px] text-[#1E293B] dark:text-white mb-4">
                                    Roteiro Dia a Dia
                                </h3>
                                <div className="space-y-6">
                                    {itinerary.days.map((day, dayIndex) => (
                                        <div key={dayIndex} className="relative">
                                            {/* Day Header */}
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-[48px] h-[48px] rounded-full bg-[#FF5F38] flex items-center justify-center">
                                                    <span className="font-inria-sans font-bold text-[18px] text-white">
                                                        {dayIndex + 1}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-inria-sans font-bold text-[16px] text-[#1E293B] dark:text-white">
                                                        Dia {dayIndex + 1}
                                                    </p>
                                                    <p className="text-[14px] text-[#64748B] dark:text-[#94A3B8]">
                                                        {formatDate(day.date)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Timeline */}
                                            <div className="ml-6 pl-6 border-l-2 border-[#E2E8F0] dark:border-[#334155] space-y-4">
                                                {day.activities.map((activity, actIndex) => (
                                                    <div key={actIndex} className="relative">
                                                        {/* Timeline dot */}
                                                        <div className="absolute -left-[29px] top-1 w-[14px] h-[14px] rounded-full bg-[#FF896F] border-2 border-white dark:border-[#0F172A]" />

                                                        <div className="bg-[#F8FAFC] dark:bg-[#1E293B] p-4 rounded-[16px]">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <div>
                                                                    <p className="text-[12px] text-[#FF5F38] font-bold mb-1">
                                                                        {activity.time}
                                                                    </p>
                                                                    <p className="font-inria-sans font-bold text-[16px] text-[#1E293B] dark:text-white">
                                                                        {activity.title}
                                                                    </p>
                                                                    <p className="text-[14px] text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1 mt-1">
                                                                        <FiMapPin className="text-[12px]" />
                                                                        {activity.location}
                                                                    </p>
                                                                </div>
                                                                {activity.cost && (
                                                                    <div className="text-right">
                                                                        <p className="font-inria-sans font-bold text-[16px] text-[#FF5F38]">
                                                                            {formatCurrency(activity.cost)}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="sticky bottom-0 bg-white dark:bg-[#0F172A] border-t border-[#E2E8F0] dark:border-[#1E293B] p-6 flex gap-3">
                                <button
                                    onClick={onReject}
                                    className="flex-1 px-6 py-4 bg-white dark:bg-[#1E293B] border-2 border-[#E2E8F0] dark:border-[#334155] rounded-[20px] font-inria-sans font-bold text-[16px] text-[#64748B] dark:text-[#94A3B8] hover:border-[#FF5F38] hover:text-[#FF5F38] transition-colors"
                                >
                                    Rejeitar
                                </button>
                                <button
                                    onClick={onApprove}
                                    className="flex-1 px-6 py-4 bg-[#FF5F38] rounded-[20px] font-inria-sans font-bold text-[16px] text-white hover:bg-[#FF4520] transition-colors shadow-lg"
                                >
                                    Aprovar Roteiro
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
