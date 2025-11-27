'use client'

import { useRouter } from 'next/navigation'
import { FiChevronLeft } from 'react-icons/fi'

interface ProfileSubPageHeaderProps {
    title: string
}

export function ProfileSubPageHeader({ title }: ProfileSubPageHeaderProps) {
    const router = useRouter()

    return (
        <header className="flex items-center gap-4 mb-6">
            <button
                onClick={() => router.back()}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-[#1E293B] shadow-sm text-[#64748B] dark:text-[#94A3B8] hover:text-[var(--primary-color)] transition-colors"
            >
                <FiChevronLeft size={24} />
            </button>
            <h1 className="font-inria-sans font-bold text-xl text-[#1E293B] dark:text-white">
                {title}
            </h1>
        </header>
    )
}
