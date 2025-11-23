'use client'

import { FiCpu } from 'react-icons/fi'

export function GenerateItineraryButton() {
    return (
        <button className="w-full h-[56px] bg-[#1E293B] rounded-[20px] flex items-center justify-center gap-3 shadow-lg mb-8 hover:bg-[#0F172A] transition-colors">
            <span className="font-inria-sans font-bold text-[16px] text-[#FF5F38]">
                Gerar Roteiro
            </span>
            <FiCpu className="text-[#FF5F38] text-xl" />
        </button>
    )
}
