'use client'

import { FiPlus } from 'react-icons/fi'
import Link from 'next/link'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export function FloatingActionButton() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    if (!mounted) return null

    return createPortal(
        <Link
            href="/trips/new"
            className="fixed bottom-20 right-4 z-[90] w-[60px] h-[60px] bg-[#FF5F38] rounded-full flex items-center justify-center shadow-[0px_4px_10px_rgba(0,0,0,0.2)] hover:scale-110 active:scale-95 transition-transform duration-200"
            aria-label="Nova viagem"
        >
            <FiPlus className="text-white text-3xl" />
        </Link>,
        document.body
    )
}
