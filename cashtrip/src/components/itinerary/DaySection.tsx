'use client'

interface DaySectionProps {
    day: string
    progress: number
    children: React.ReactNode
}

export function DaySection({ day, progress, children }: DaySectionProps) {
    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4 bg-[var(--surface-card)] p-3 rounded-[12px] border border-[var(--border-line)]">
                <span className="font-inria-sans font-bold text-[16px] text-[var(--text-primary)]">
                    {day}
                </span>
                <span className="font-inria-sans font-bold text-[14px] text-[#FF5F38]">
                    {progress}%
                </span>
            </div>
            <div className="pl-2">
                {children}
            </div>
        </div>
    )
}
