'use client'

import { FiTrendingUp } from 'react-icons/fi'
import Image from 'next/image'

interface TrendingPlaceCardProps {
    destination: string
    country: string
    description: string
    imageUrl: string
}

export function TrendingPlaceCard({
    destination,
    country,
    description,
    imageUrl
}: TrendingPlaceCardProps) {
    return (
        <div className="bg-[var(--surface-card)] rounded-[20px] p-3 flex gap-4 items-center shadow-sm border border-[var(--border-line)] mb-4">
            <div className="relative w-[100px] h-[100px] rounded-[15px] overflow-hidden flex-shrink-0">
                <Image
                    src={imageUrl}
                    alt={`${destination}, ${country}`}
                    fill
                    className="object-cover"
                />
            </div>

            <div className="flex-1">
                <h3 className="font-inria-sans font-bold text-[16px] text-[var(--text-primary)] mb-1">
                    {destination}, {country}
                </h3>
                <p className="font-inria-sans text-[11px] text-[#64748B] dark:text-[#94A3B8] leading-tight pr-8">
                    {description}
                </p>
            </div>

            <div className="w-[40px] h-[40px] rounded-full border border-[#FF5F38] flex items-center justify-center flex-shrink-0 bg-[#FF5F38]/10">
                <FiTrendingUp className="text-[#FF5F38] text-lg" />
            </div>
        </div>
    )
}
