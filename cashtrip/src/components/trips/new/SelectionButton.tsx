'use client'

import { motion } from 'framer-motion'

interface SelectionButtonProps {
    label: string
    details: string
    price: string
    isSelected?: boolean
    onClick: () => void
}

export function SelectionButton({ label, details, price, isSelected = false, onClick }: SelectionButtonProps) {
    return (
        <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClick}
            className={`w-full p-4 rounded-[20px] border flex flex-col gap-2 transition-all duration-200 text-left
                ${isSelected
                    ? 'bg-[#FF896F] border-[#FF896F]'
                    : 'bg-white dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] hover:border-[#FF896F]'
                }
            `}
        >
            <div className="flex items-center justify-between">
                <span className={`font-inria-sans font-bold text-[16px] ${isSelected ? 'text-white' : 'text-[#1E293B] dark:text-white'}`}>
                    {label}
                </span>
                <div className={`w-[24px] h-[24px] rounded-full border-2 flex items-center justify-center
                    ${isSelected
                        ? 'bg-[#FF5F38] border-[#FF5F38]'
                        : 'bg-white dark:bg-transparent border-[#94A3B8]'
                    }
                `}>
                    {isSelected && (
                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                            <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </div>
            </div>

            <p className={`font-inria-sans text-[14px] ${isSelected ? 'text-white' : 'text-[#64748B] dark:text-[#94A3B8]'}`}>
                {details}
            </p>

            <div className={`font-inria-sans font-bold text-[18px] ${isSelected ? 'text-white' : 'text-[#FF5F38]'}`}>
                {price}
            </div>
        </motion.button>
    )
}
