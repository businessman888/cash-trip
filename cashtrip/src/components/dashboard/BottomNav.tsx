'use client'

import Image from 'next/image'
import { FaHome, FaPlane, FaSearch, FaUser } from 'react-icons/fa'
import { useTheme } from '@/contexts/ThemeContext'

export function BottomNav() {
    const { theme } = useTheme()

    return (
        <div className="fixed bottom-0 left-0 right-0 z-30 flex justify-center pb-0 pointer-events-none">
            <div
                className={`pointer-events-auto rounded-tl-[30px] rounded-tr-[30px] pt-[6px] pr-[19px] pb-[6px] pl-[19px] gap-[10px] flex items-center justify-between w-full max-w-[320px] ${theme === 'light'
                        ? 'border-t border-r border-l border-[#E2E8F0] shadow-[0px_-2px_10px_rgba(0,0,0,0.1)]'
                        : 'shadow-[0px_0px_4px_rgba(100,116,139,0.4)]'
                    }`}
                style={{ background: 'var(--surface-nav)' }}
            >
                <button className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 bg-[#FF5F38] rounded-full flex items-center justify-center text-white shadow-md">
                        <FaHome size={20} />
                    </div>
                </button>

                <button className="flex flex-col items-center gap-1 text-[#94A3B8] hover:text-[#FF5F38] transition-colors">
                    <FaPlane size={20} />
                </button>

                <button className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity">
                    <Image
                        src="/icons/icon central down bar.svg"
                        alt="Central Action"
                        width={20}
                        height={20}
                        className="w-5 h-5"
                    />
                </button>

                <button className="flex flex-col items-center gap-1 text-[#94A3B8] hover:text-[#FF5F38] transition-colors">
                    <FaSearch size={20} />
                </button>

                <button className="flex flex-col items-center gap-1 text-[#94A3B8] hover:text-[#FF5F38] transition-colors">
                    <FaUser size={20} />
                </button>
            </div>
        </div>
    )
}
