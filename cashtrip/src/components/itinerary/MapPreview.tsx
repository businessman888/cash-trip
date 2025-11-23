'use client'

import Image from 'next/image'
import { FiMap } from 'react-icons/fi'

export function MapPreview() {
    return (
        <div className="relative w-full h-[200px] rounded-[20px] overflow-hidden mb-8 border border-[var(--border-line)]">
            <Image
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop"
                alt="Map Preview"
                fill
                className="object-cover opacity-80"
            />
            <button className="absolute bottom-4 right-4 w-[48px] h-[48px] bg-[#FF5F38] rounded-full flex items-center justify-center shadow-lg text-white hover:scale-105 transition-transform">
                <FiMap className="text-xl" />
            </button>
        </div>
    )
}
