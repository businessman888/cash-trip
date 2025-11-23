'use client'

interface NewTripChatBubbleProps {
    message: string
    sender: 'aurora' | 'user'
}

export function NewTripChatBubble({ message, sender }: NewTripChatBubbleProps) {
    const isAurora = sender === 'aurora'

    return (
        <div className={`flex flex-col ${isAurora ? 'items-start' : 'items-end'} mb-4`}>
            <span className="text-[12px] text-[#64748B] mb-1 ml-1">
                {isAurora ? 'Aurora' : 'Você'}
            </span>
            <div
                className={`p-5 rounded-[20px] text-[15px] font-inria-sans font-medium leading-relaxed max-w-[85%] shadow-sm
                ${isAurora
                        ? 'bg-[#FF5F38] text-white rounded-tl-none'
                        : 'bg-[#FF896F] text-white rounded-tr-none'
                    }`}
            >
                {message}
            </div>
        </div>
    )
}
