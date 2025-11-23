'use client'

import { FiMap } from 'react-icons/fi'
import Image from 'next/image'
import Link from 'next/link'

interface RecommendedTripCardProps {
    destination: string
    country: string
    category: string
    compatibility: number
    description: string
    imageUrl: string
}

export function RecommendedTripCard({
    destination,
    country,
    category,
    compatibility,
    description,
    imageUrl
}: RecommendedTripCardProps) {
    return (
        <div className="min-w-[280px] bg-[var(--surface-card)] rounded-[20px] p-4 shadow-sm border border-[var(--border-line)] snap-center">
            <div className="relative w-full h-[160px] rounded-[15px] overflow-hidden mb-4">
                <Image
                    src={imageUrl}
                    alt={`${destination}, ${country}`}
                    fill
                    className="object-cover"
                />
            </div>

            <h3 className="font-inria-sans font-bold text-[18px] text-[var(--text-primary)] mb-1">
                {destination}, {country}
            </h3>

            <div className="flex items-center gap-2 mb-4">
                <span className="text-[#94A3B8]">🏔️</span>
                <span className="font-inria-sans font-bold text-[13px] text-[#94A3B8]">{category}</span>
            </div>

            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-inria-sans text-[#64748B] dark:text-[#94A3B8]">Compatibilidade</span>
                    <span className="text-[11px] font-inria-sans font-bold text-[#FF5F38]">{compatibility}%</span>
                </div>
                <div className="w-full h-2 bg-[#F1F5F9] dark:bg-[#1E293B] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#FF5F38] rounded-full"
                        style={{ width: `${compatibility}%` }}
                    />
                </div>
            </div>

            <p className="font-inria-sans font-bold text-[13px] text-[#64748B] dark:text-[#94A3B8] mb-4 leading-tight">
                {description}
            </p>

            <div className="bg-[#F1F5F9] dark:bg-[#1E293B] rounded-[12px] p-3 flex items-center justify-between mb-4">
                <div className="flex flex-col">
                    <span className="font-inria-sans font-bold text-[13px] text-[#64748B] dark:text-[#94A3B8]">Ver no mapa</span>
                    <span className="font-inria-sans text-[10px] text-[#94A3B8]">Clique para Explorar</span>
                </div>
                <div className="w-[36px] h-[36px] bg-[#FF896F]/20 rounded-[8px] flex items-center justify-center">
                    <FiMap className="text-[#FF5F38] text-lg" />
                </div>
            </div>

            <Link href={`/destination/${destination.toLowerCase()}`} className="w-full block">
                <button className="w-full h-[40px] bg-[#FF896F] text-white rounded-[20px] font-inria-sans font-bold text-[13px] shadow-lg shadow-[#FF896F]/20">
                    Conhecer mais
                </button>
            </Link>
        </div>
    )
}
