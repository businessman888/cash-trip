'use client'

import { FiCheck, FiSun, FiCompass } from 'react-icons/fi'

interface TimelineItemProps {
    title: string
    time: string
    status?: 'completed' | 'pending' | 'upcoming'
    weather?: string
    hasAction?: boolean
    actionLabel?: string
    isLast?: boolean
}

export function TimelineItem({
    title,
    time,
    status = 'upcoming',
    weather,
    hasAction,
    actionLabel,
    isLast
}: TimelineItemProps) {
    return (
        <div className="flex gap-4 relative">
            {/* Timeline Line */}
            {!isLast && (
                <div className="absolute left-[19px] top-[40px] bottom-[-16px] w-[2px] bg-[#E2E8F0] dark:bg-[#334155]" />
            )}

            {/* Status Indicator */}
            <div className="flex-shrink-0 pt-1">
                {status === 'completed' ? (
                    <div className="w-[40px] h-[40px] rounded-full bg-[#FF5F38] flex items-center justify-center text-white shadow-sm">
                        <FiCheck className="text-xl" />
                    </div>
                ) : status === 'pending' ? (
                    <div className="w-[40px] h-[40px] rounded-full border-2 border-[#FF5F38] bg-white dark:bg-[#1E293B] flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-[#FF5F38]" />
                    </div>
                ) : (
                    <div className="w-[40px] h-[40px] rounded-full border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B]" />
                )}
            </div>

            {/* Content */}
            <div className={`flex-1 bg-[var(--surface-card)] rounded-[16px] p-4 border border-[var(--border-line)] mb-4 ${status === 'completed' ? 'opacity-80' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-inria-sans font-bold text-[16px] text-[var(--text-primary)]">
                        {title}
                    </h3>
                    {status === 'completed' && (
                        <div className="w-[24px] h-[24px] rounded-full bg-[#FF5F38] flex items-center justify-center text-white">
                            <FiCheck className="text-sm" />
                        </div>
                    )}
                    {status === 'pending' && (
                        <div className="w-[24px] h-[24px] rounded-full border border-[#94A3B8]" />
                    )}
                </div>

                <p className="font-inria-sans text-[14px] text-[#64748B] dark:text-[#94A3B8] mb-3">
                    {time}
                </p>

                {(weather || hasAction) && (
                    <div className="flex items-center gap-3">
                        {weather && (
                            <div className="flex items-center gap-1 text-[#FF5F38]">
                                <FiSun />
                                <span className="text-[12px] font-bold">{weather}</span>
                            </div>
                        )}

                        {hasAction && (
                            <button className="flex items-center gap-1 bg-[#FF5F38]/10 text-[#FF5F38] px-3 py-1.5 rounded-full text-[11px] font-bold">
                                <FiCompass />
                                <span>{actionLabel || 'Conhecer local'}</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
