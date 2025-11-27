'use client'

import Image from 'next/image'
import { FaHome, FaPlane, FaSearch, FaUser } from 'react-icons/fa'
import { useTheme } from '@/contexts/ThemeContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function BottomNav() {
    const { theme } = useTheme()
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path

    const activeStyle = {
        background: 'linear-gradient(180deg, #FF896F 0%, #FF5F38 50%, #E6502C 100%)',
        boxShadow: '0.6px 0.6px 9px 0 rgba(255, 95, 56, 0.60)'
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center pb-0 pointer-events-none">
            <div
                className={`pointer-events-auto rounded-tl-[30px] rounded-tr-[30px] pt-[6px] pr-[19px] pb-[6px] pl-[19px] gap-[10px] flex items-center justify-between w-full max-w-[320px] ${theme === 'light'
                    ? 'border-t border-r border-l border-[#E2E8F0] shadow-[0px_-2px_10px_rgba(0,0,0,0.1)]'
                    : 'shadow-[0px_0px_4px_rgba(100,116,139,0.4)]'
                    }`}
                style={{ background: 'var(--surface-nav)' }}
            >
                <Link href="/dashboard" className="flex flex-col items-center gap-1">
                    {isActive('/dashboard') ? (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={activeStyle}>
                            <FaHome size={20} />
                        </div>
                    ) : (
                        <FaHome size={20} className="text-[#94A3B8] hover:text-[#FF5F38] transition-colors" />
                    )}
                </Link>

                <Link href="/trips" className="flex flex-col items-center gap-1">
                    {isActive('/trips') ? (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={activeStyle}>
                            <FaPlane size={20} />
                        </div>
                    ) : (
                        <FaPlane size={20} className="text-[#94A3B8] hover:text-[#FF5F38] transition-colors" />
                    )}
                </Link>

                <Link href="/trips/new" className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity">
                    <Image
                        src="/icons/icon central down bar.svg"
                        alt="Central Action"
                        width={20}
                        height={20}
                        className="w-5 h-5"
                    />
                </Link>

                <Link href="/explore" className="flex flex-col items-center gap-1">
                    {isActive('/explore') ? (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={activeStyle}>
                            <FaSearch size={20} />
                        </div>
                    ) : (
                        <FaSearch size={20} className="text-[#94A3B8] hover:text-[#FF5F38] transition-colors" />
                    )}
                </Link>

                <Link href="/profile" className="flex flex-col items-center gap-1">
                    {isActive('/profile') ? (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={activeStyle}>
                            <FaUser size={20} />
                        </div>
                    ) : (
                        <FaUser size={20} className="text-[#94A3B8] hover:text-[#FF5F38] transition-colors" />
                    )}
                </Link>
            </div>
        </div>
    )
}
