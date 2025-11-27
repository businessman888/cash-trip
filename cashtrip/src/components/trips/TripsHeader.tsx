'use client'

import { FiSearch, FiFilter } from 'react-icons/fi'
import { useTheme } from '@/contexts/ThemeContext'

export function TripsHeader() {
    const { theme } = useTheme()

    // Light mode colors
    const searchBarBg = theme === 'light' ? '#FFFFFF' : '#313F56'
    const searchBarBorder = theme === 'light' ? '#E2E8F0' : '#FFFFFF'
    const placeholderColor = theme === 'light' ? '#94A3B8' : '#94A3B8'

    return (
        <div className="flex items-center gap-3 mb-6">
            {/* Search Bar with dynamic theme-based colors */}
            <div
                className="flex-1 h-[48px] rounded-[25px] flex items-center px-5 gap-3 shadow-sm"
                style={{
                    backgroundColor: searchBarBg,
                    border: `1px solid ${searchBarBorder}`
                }}
            >
                <input
                    type="text"
                    placeholder="Pesquisar viagem"
                    style={{
                        color: 'var(--text-primary)',
                    }}
                    className="flex-1 bg-transparent border-none outline-none text-[14px] font-inria-sans"
                />
                <style jsx>{`
                    input::placeholder {
                        color: ${placeholderColor};
                    }
                `}</style>
                <button className="w-9 h-9 bg-[#FF5F38] rounded-full flex items-center justify-center flex-shrink-0">
                    <FiSearch className="text-white text-[16px]" />
                </button>
            </div>
            <button className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                <FiFilter className="text-[#FF5F38] text-2xl" />
            </button>
        </div>
    )
}
