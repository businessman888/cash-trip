'use client'

import { FiCalendar, FiUser, FiMapPin, FiCheckCircle, FiCircle, FiMessageSquare, FiEdit2 } from 'react-icons/fi'
import { FaBed } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'

interface ActiveTripCardProps {
    destination: string
    country: string
    startDate: string
    endDate: string
    duration: number
    travelers: number
    imageUrl: string
    status: {
        ticketsPurchased: boolean
        hotelReserved: boolean
        insurance: boolean
    }
    progress: number
}

export function ActiveTripCard({
    destination,
    country,
    startDate,
    endDate,
    duration,
    travelers,
    imageUrl,
    status,
    progress
}: ActiveTripCardProps) {
    return (
        <div className="bg-[var(--surface-card)] rounded-[20px] p-4 shadow-sm border border-[var(--border-line)] mb-8">
            <div className="relative w-full h-[180px] rounded-[15px] overflow-hidden mb-4">
                <Image
                    src={imageUrl}
                    alt={`${destination}, ${country}`}
                    fill
                    className="object-cover"
                />
            </div>

            <h3 className="font-inria-sans font-bold text-[20px] text-[var(--text-primary)] mb-4">
                {destination}, {country}
            </h3>

            <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-2 text-[#64748B] dark:text-[#94A3B8]">
                    <FiCalendar className="text-lg" />
                    <span className="text-[13px] font-inria-sans leading-tight">
                        {startDate} a<br />{endDate}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-[#64748B] dark:text-[#94A3B8]">
                    <FaBed className="text-lg" />
                    <span className="text-[13px] font-inria-sans">{duration} dias</span>
                </div>
                <div className="flex items-center gap-2 text-[#64748B] dark:text-[#94A3B8]">
                    <FiUser className="text-lg" />
                    <span className="text-[13px] font-inria-sans">{travelers} pessoas</span>
                </div>
            </div>

            <div className="mb-6">
                <h4 className="font-inria-sans font-bold text-[16px] text-[#64748B] dark:text-[#94A3B8] mb-3">
                    Status
                </h4>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        {status.ticketsPurchased ? (
                            <FiCheckCircle className="text-[#FF5F38]" />
                        ) : (
                            <FiCircle className="text-[#D9D9D9]" />
                        )}
                        <span className="text-[13px] font-inria-sans text-[var(--text-primary)]">Passagens compradas</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {status.hotelReserved ? (
                            <FiCheckCircle className="text-[#FF5F38]" />
                        ) : (
                            <FiCircle className="text-[#D9D9D9]" />
                        )}
                        <span className="text-[13px] font-inria-sans text-[var(--text-primary)]">Hotel reservado</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {status.insurance ? (
                            <FiCheckCircle className="text-[#FF5F38]" />
                        ) : (
                            <FiCircle className="text-[#D9D9D9]" />
                        )}
                        <span className="text-[13px] font-inria-sans text-[var(--text-primary)]">Seguro viagem</span>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-inria-sans font-bold text-[var(--text-primary)]">Conclusão do roteiro</span>
                    <span className="text-[11px] font-inria-sans font-bold text-[#FF5F38]">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-[#F1F5F9] dark:bg-[#1E293B] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#FF896F] rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <Link href="/itinerary" className="w-full h-[45px] bg-[#FF5F38] text-white rounded-[12px] font-inria-sans font-bold text-[15px] mb-4 shadow-lg shadow-[#FF5F38]/20 flex items-center justify-center">
                Abrir Roteiro
            </Link>

            <div className="flex gap-3">
                <button className="flex-1 h-[40px] bg-[#FF5F38]/10 rounded-[20px] flex items-center justify-center gap-2 text-[#FF5F38] font-inria-sans font-bold text-[11px]">
                    <span>Chat com Agente</span>
                    <FiMessageSquare />
                </button>
                <button className="flex-1 h-[40px] border border-[#FF5F38] rounded-[20px] flex items-center justify-center gap-2 text-[#FF5F38] font-inria-sans font-bold text-[11px]">
                    <span>Editar</span>
                    <FiEdit2 />
                </button>
            </div>
        </div>
    )
}
