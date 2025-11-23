'use client'

import { FiCheck } from 'react-icons/fi'

interface ChecklistItemProps {
    label: string
    isChecked: boolean
    onToggle: () => void
}

export function ChecklistItem({ label, isChecked, onToggle }: ChecklistItemProps) {
    return (
        <div
            onClick={onToggle}
            className={`relative flex items-center p-4 rounded-[12px] mb-3 cursor-pointer transition-colors
        ${isChecked
                    ? 'bg-[#F1F5F9] dark:bg-[#1E293B]'
                    : 'bg-[var(--surface-card)] border border-[var(--border-line)]'
                }`}
        >
            {/* Checkbox */}
            <div className={`w-[32px] h-[32px] rounded-full flex items-center justify-center mr-4 transition-colors
        ${isChecked
                    ? 'bg-[#FF896F]/30 text-[#FF5F38]'
                    : 'border border-[#94A3B8]'
                }`}>
                {isChecked && <FiCheck className="text-lg" />}
            </div>

            {/* Label */}
            <span className={`font-inria-sans text-[16px] flex-1
        ${isChecked
                    ? 'text-[#94A3B8] line-through'
                    : 'text-[var(--text-primary)]'
                }`}>
                {label}
            </span>

            {/* Status Bar */}
            <div className={`w-[6px] h-[24px] rounded-full
        ${isChecked
                    ? 'bg-[#94A3B8]/50'
                    : 'bg-[#FF5F38]'
                }`}
            />
        </div>
    )
}
