'use client'

import { FiAlertTriangle, FiThumbsUp } from 'react-icons/fi'

interface ChecklistSectionProps {
    title: string
    currentCount: number
    totalCount: number
    type: 'essentials' | 'recommended'
}

export function ChecklistSection({ title, currentCount, totalCount, type }: ChecklistSectionProps) {
    return (
        <div className="flex items-center gap-2 mb-4 mt-6">
            {type === 'essentials' ? (
                <div className="w-[20px] h-[20px] bg-[#FF5F38] rotate-45 flex items-center justify-center rounded-[4px]">
                    <FiAlertTriangle className="text-white text-[10px] -rotate-45" />
                </div>
            ) : (
                <FiThumbsUp className="text-[#FF5F38] text-lg" />
            )}

            <h2 className="font-inria-sans font-bold text-[14px] text-[#FF5F38]">
                {title} ({currentCount}/{totalCount})
            </h2>
        </div>
    )
}
