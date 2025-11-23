'use client'

import { FiChevronLeft, FiMoreHorizontal } from 'react-icons/fi'
import Link from 'next/link'

interface ItineraryHeaderProps {
    title: string
}

export function ItineraryHeader({ title }: ItineraryHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-6">
            <Link href="/trips" className="text-[var(--text-primary)]">
                <FiChevronLeft className="text-2xl" />
            </Link>
            <h1 className="font-inria-sans font-bold text-[20px] text-[var(--text-primary)]">
                {title}
            </h1>
            <button className="text-[var(--text-primary)]">
                <FiMoreHorizontal className="text-2xl" />
            </button>
        </div>
    )
}
