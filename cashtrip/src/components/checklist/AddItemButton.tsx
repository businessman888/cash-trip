'use client'

import { FiPlus } from 'react-icons/fi'

export function AddItemButton() {
    return (
        <button className="fixed bottom-6 right-6 w-[56px] h-[56px] bg-[#FF5F38] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform">
            <FiPlus className="text-2xl" />
        </button>
    )
}
