'use client'

import { FiMap } from 'react-icons/fi'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'

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
    const { theme } = useTheme()

    // Define colors based on theme
    const mapButtonBg = theme === 'light' ? '#EAEDEF' : '#1E293B'
    const mapButtonTextColor = theme === 'light' ? '#1E293B' : '#94A3B8'
    const progressBarBg = theme === 'light' ? '#F1F5F9' : '#1E293B'

    return (
        <div className="min-w-[300px] bg-[var(--surface-card)] rounded-[24px] p-5 shadow-sm border border-[var(--border-line)] dark:border-transparent snap-center">
            <div className="relative w-full h-[180px] rounded-[20px] overflow-hidden mb-5">
                <Image
                    src={imageUrl}
                    alt={`${destination}, ${country}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="text-[12px]">🏔️</span>
                    <span className="font-inria-sans font-bold text-[12px] text-[#1E293B] dark:text-white">{category}</span>
                </div>
            </div>

            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-inria-sans font-bold text-[20px] text-[var(--text-primary)] leading-tight">
                        {destination}
                    </h3>
                    <span className="font-inria-sans text-[14px] text-[#64748B] dark:text-[#94A3B8]">
                        {country}
                    </span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="font-inria-sans font-bold text-[18px] text-[#FF5F38]">{compatibility}%</span>
                    <span className="text-[10px] font-inria-sans text-[#64748B] dark:text-[#94A3B8]">Compatível</span>
                </div>
            </div>

            <div className="mb-5">
                <div
                    className="w-full h-[6px] rounded-full overflow-hidden"
                    style={{ backgroundColor: progressBarBg }}
                >
                    <div
                        className="h-full bg-[#FF5F38] rounded-full"
                        style={{ width: `${compatibility}%` }}
                    />
                </div>
            </div>

            <p className="font-inria-sans text-[13px] text-[#64748B] dark:text-[#94A3B8] mb-5 leading-relaxed line-clamp-2">
                {description}
            </p>

            <div className="flex gap-3">
                <button
                    className="w-[44px] h-[44px] rounded-[14px] flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{ backgroundColor: mapButtonBg }}
                >
                    <FiMap className="text-[#FF5F38] text-xl" />
                </button>

                <Link href={`/destination/${destination.toLowerCase()}`} className="flex-1">
                    <button className="w-full h-[44px] bg-[#FF5F38] text-white rounded-[14px] font-inria-sans font-bold text-[14px] shadow-lg shadow-[#FF5F38]/20 hover:bg-[#E6502C] transition-colors flex items-center justify-center gap-2">
                        Conhecer mais
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 12L10 8L6 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </Link>
            </div>
        </div>
    )
}
