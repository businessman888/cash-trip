'use client'

import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'

export function TripsHeader() {
    const { theme } = useTheme()

    // Light mode colors
    const searchBarBg = theme === 'light' ? '#FFFFFF' : '#313F56'
    const searchBarBorder = theme === 'light' ? '#E2E8F0' : '#FFFFFF'
    const placeholderColor = theme === 'light' ? '#94A3B8' : '#94A3B8'

    return (
        <div className="flex flex-col gap-6 mb-8">
            <div className="flex items-center justify-between gap-4">
                <Link href="/trips/new" className="flex flex-col items-center gap-2 group">
                    <div className="w-[60px] h-[60px] bg-[#FF5F38] rounded-[18px] flex items-center justify-center shadow-lg shadow-[#FF5F38]/30 transition-transform group-active:scale-95">
                        <FiPlus className="text-white text-3xl" />
                    </div>
                    <span className="font-inria-sans font-bold text-[13px] text-[var(--text-primary)]">
                        Nova viagem
                    </span>
                </Link>

                <div className="flex-1 flex flex-col items-end gap-2">
                    <div className="w-full flex items-center gap-3">
                        {/* Search Bar with dynamic theme-based colors */}
                        <div
                            className="flex-1 h-[45px] rounded-full flex items-center px-4 gap-2 shadow-sm"
                            style={{
                                backgroundColor: searchBarBg,
                                border: `1px solid ${searchBarBorder}`
                            }}
                        >
                            <input
                                type="text"
                                placeholder="Encontrar roteiro"
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
                            <button className="w-8 h-8 bg-[#FF896F] rounded-full flex items-center justify-center flex-shrink-0">
                                <FiSearch className="text-white text-sm" />
                            </button>
                        </div>
                        <button className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                            <FiFilter className="text-[#FF5F38] text-2xl" />
                        </button>
                    </div>
                    <span className="font-inria-sans text-[11px] text-[#64748B] dark:text-[#94A3B8] mr-1">
                        0 filtros selecionados
                    </span>
                </div>
            </div>
        </div>
    )
}
