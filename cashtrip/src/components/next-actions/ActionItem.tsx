'use client'

import { FaCheck } from 'react-icons/fa'

interface ActionItemProps {
    icon: React.ReactNode
    title: string
    subtitle?: string
    completed: boolean
    onToggle: () => void
    showProgress?: boolean
    progress?: number
}

export function ActionItem({
    icon,
    title,
    subtitle,
    completed,
    onToggle,
    showProgress = false,
    progress = 0
}: ActionItemProps) {
    return (
        <div className="flex items-center gap-3 py-3">
            {/* Icon Container */}
            <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255, 95, 56, 0.2)' }}
            >
                {icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h4
                    className="text-[16px] font-roboto-condensed font-bold mb-0.5"
                    style={{ color: 'var(--text-primary)' }}
                >
                    {title}
                </h4>
                {subtitle && !showProgress && (
                    <p
                        className="text-[12px] font-roboto-condensed"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        {subtitle}
                    </p>
                )}
                {showProgress && (
                    <div className="mt-2">
                        <div
                            className="h-1.5 rounded-full overflow-hidden"
                            style={{ background: 'rgba(217, 217, 217, 0.5)' }}
                        >
                            <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                    background: 'var(--color-primary)',
                                    width: `${progress}%`,
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Checkbox */}
            {!showProgress && (
                <button
                    onClick={onToggle}
                    className="flex-shrink-0 transition-all"
                >
                    <div
                        className="w-6 h-6 rounded flex items-center justify-center transition-all"
                        style={{
                            background: completed ? 'var(--color-primary)' : 'transparent',
                            border: completed ? 'none' : '2px solid var(--text-secondary)',
                        }}
                    >
                        {completed && <FaCheck size={14} color="#FFFFFF" />}
                    </div>
                </button>
            )}
        </div>
    )
}
