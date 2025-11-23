'use client'

import { useState } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

interface AccordionSectionProps {
    title: string
    children: React.ReactNode
    defaultOpen?: boolean
}

export function AccordionSection({ title, children, defaultOpen = false }: AccordionSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    return (
        <div className="mb-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-2"
            >
                <h3 className="font-inria-sans font-bold text-[16px] text-[#1E293B]">
                    {title}
                </h3>
                {isOpen ? (
                    <FiChevronUp className="text-[#1E293B] text-xl" />
                ) : (
                    <FiChevronDown className="text-[#1E293B] text-xl" />
                )}
            </button>

            {isOpen && (
                <div className="mt-2 font-inria-sans text-[14px] text-[#64748B] leading-relaxed pb-2">
                    {children}
                </div>
            )}
        </div>
    )
}
