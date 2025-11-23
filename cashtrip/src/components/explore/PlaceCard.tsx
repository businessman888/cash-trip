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
}

export function PlaceCard({
    title,
    subtitle,
    imageUrl,
    hasActionButton = true,
    actionLabel = "Conhecer mais"
}: PlaceCardProps) {
    return (
        <div className="min-w-[200px] w-[200px] bg-[var(--surface-card)] rounded-[20px] p-3 shadow-sm border border-[var(--border-line)] snap-center flex flex-col h-[320px]">
            <div className="relative w-full h-[200px] rounded-[15px] overflow-hidden mb-3 flex-shrink-0">
                <Image
                    src={imageUrl}
                    alt={`${title}, ${subtitle}`}
                    fill
                    className="object-cover"
                />
                {/* Overlay arrow button if needed, based on design it might be separate or over image */}
                {!hasActionButton && (
                    <div className="absolute bottom-2 right-2 w-8 h-8 bg-[#FF5F38] rounded-full flex items-center justify-center shadow-lg">
                        <FiChevronRight className="text-white" />
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-inria-sans font-bold text-[16px] text-[var(--text-primary)] leading-tight">
                        {title}
                    </h3>
                    <div className="flex items-center gap-1 text-[#64748B] dark:text-[#94A3B8]">
                        <FiMapPin className="text-[10px]" />
                        <span className="font-inria-sans text-[11px]">{subtitle}</span>
                    </div>
                </div>

                {hasActionButton && (
                    <Link href={`/destination/${title.toLowerCase()}`} className="w-full block mt-2">
                        <button className="w-full h-[36px] bg-[#FF5F38] text-white rounded-[18px] font-inria-sans font-bold text-[12px] shadow-lg shadow-[#FF5F38]/20">
                            {actionLabel}
                        </button>
                    </Link>
                )}
            </div>
        </div>
    )
}
