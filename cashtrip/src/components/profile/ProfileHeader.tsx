'use client'

import { FiChevronLeft } from 'react-icons/fi'
import Link from 'next/link'

export function ProfileHeader() {
    return (
        <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard" className="text-[var(--text-primary)]">
                <FiChevronLeft className="text-2xl" />
            </Link>
            <h1 className="font-inria-sans font-bold text-[20px] text-[var(--text-primary)]">
                Perfil
            </h1>
        </div>
    )
}
