'use client'

import Image from 'next/image'

interface ChatBubbleProps {
    message: string
    isAgent?: boolean
    timestamp: string
}

export function ChatBubble({ message, isAgent = false, timestamp }: ChatBubbleProps) {
    return (
        <div className={`flex gap-3 mb-6 ${isAgent ? '' : 'flex-row-reverse'}`}>
            {isAgent && (
                <div className="w-[32px] h-[32px] rounded-full overflow-hidden flex-shrink-0">
                    <Image
                        src="/icons/icon.png" // Assuming this exists or use a placeholder
                        alt="Agent"
                        width={32}
                        height={32}
                        className="object-cover"
                    />
                </div>
            )}

            <div className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'} max-w-[80%]`}>
                <div
                    className={`p-4 rounded-[20px] text-[14px] font-inria-sans leading-relaxed shadow-sm
            ${isAgent
                            ? 'bg-white dark:bg-[#1E293B] text-[var(--text-primary)] rounded-tl-none border border-[var(--border-line)]'
                            : 'bg-[#FF5F38] text-white rounded-tr-none'
                        }`}
                >
                    {message}
                </div>
                <span className="text-[11px] text-[#94A3B8] mt-1 px-1">
                    {timestamp}
                </span>
            </div>
        </div>
    )
}
