'use client'

import { FiChevronLeft } from 'react-icons/fi'
import Link from 'next/link'

export function ChecklistHeader() {
    return (
        <div className="flex items-center gap-4 mb-8">
            <Link href="/itinerary" className="text-[var(--text-primary)]">
                <FiChevronLeft className="text-2xl" />
            </Link>
            <h1 className="font-inria-sans font-bold text-[20px] text-[var(--text-primary)]">
                Checklist da bagagem
            </h1>
        </div>
    )
}
