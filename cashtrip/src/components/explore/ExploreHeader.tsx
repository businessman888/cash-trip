'use client'

import { FiChevronLeft, FiSearch } from 'react-icons/fi'
import Link from 'next/link'

export function ExploreHeader() {
    return (
        <div className="flex flex-col gap-6 mb-8">
            <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-[var(--text-primary)]">
                    <FiChevronLeft className="text-2xl" />
                </Link>
                <h1 className="font-inria-sans font-bold text-[20px] text-[var(--text-primary)]">
                    Explorar
                </h1>
            </div>

            <div className="relative w-full h-[50px]">
                <input
                    type="text"
                    placeholder="Para onde você deseja ir?"
                    className="w-full h-full bg-[var(--surface-card)] rounded-full pl-14 pr-6 border border-[var(--border-line)] outline-none text-[14px] text-[var(--text-primary)] placeholder:text-[#94A3B8] font-inria-sans shadow-sm"
                />
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-[38px] h-[38px] bg-[#FF5F38] rounded-full flex items-center justify-center shadow-lg shadow-[#FF5F38]/20">
                    <FiSearch className="text-white text-lg" />
                </div>
            </div>
        </div>
    )
}
