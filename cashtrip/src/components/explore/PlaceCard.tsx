'use client'

import Image from 'next/image'
import { FiChevronRight, FiMapPin } from 'react-icons/fi'
import Link from 'next/link'

interface PlaceCardProps {
    title: string
    subtitle: string
    imageUrl: string
    hasActionButton?: boolean
    actionLabel?: string
    showArrowOverlay?: boolean
    className?: string
}

export function PlaceCard({
    title,
    subtitle,
    imageUrl,
    hasActionButton = true,
    actionLabel = "Conhecer mais",
    showArrowOverlay = true,
    className
}: PlaceCardProps) {
    const widthClass = className || "min-w-[180px] w-[180px]"

    return (
        <div className={`relative ${widthClass} h-[320px] bg-[var(--surface-card)] rounded-[24px] shadow-[0.8px_0.8px_4px_0_rgba(0,0,0,0.25)] snap-center flex flex-col overflow-hidden group`}>
            {/* Border Overlay - Ensures border is always visible on top of image */}
            <div className="absolute inset-0 rounded-[24px] border border-[#FF896F] pointer-events-none z-20" />

            {/* Image Section - 60% height */}
            <div className="relative w-full h-[60%] overflow-hidden flex-shrink-0">
                <Image
                    src={imageUrl}
                    alt={`${title}, ${subtitle}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Content Section */}
            <div className="flex-1 p-4 flex flex-col justify-between bg-[var(--surface-card)]">
                <div className="mt-1">
                    <h3 className="font-inria-sans font-bold text-[18px] text-[var(--text-primary)] leading-tight mb-1">
                        {title}
                    </h3>
                    <div className="flex items-center gap-1 text-[#64748B] dark:text-[#94A3B8]">
                        <FiMapPin className="text-[12px]" />
                        <span className="font-inria-sans text-[12px]">{subtitle}</span>
                    </div>
                </div>

                {hasActionButton && (
                    <Link href={`/destination/${title.toLowerCase()}`} className="w-full block mt-4 relative z-30">
                        <button className="w-full h-[36px] bg-[#E6502C] text-white rounded-[18px] font-inria-sans font-bold text-[12px] shadow-md shadow-[#E6502C]/20 hover:bg-[#d6401e] transition-colors">
                            {actionLabel}
                        </button>
                    </Link>
                )}
            </div>
        </div>
    )
}
