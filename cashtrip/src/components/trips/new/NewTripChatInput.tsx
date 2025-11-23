'use client'

import { useState } from 'react'
import { FiSend, FiMic } from 'react-icons/fi'

interface NewTripChatInputProps {
    onSendMessage: (text: string) => void
}

export function NewTripChatInput({ onSendMessage }: NewTripChatInputProps) {
    const [message, setMessage] = useState('')

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(message)
            setMessage('')
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSend()
        }
    }

    return (
        <div className="w-full flex items-center gap-3">
            <button className="w-[48px] h-[48px] rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#FF5F38] shadow-sm flex-shrink-0">
                <FiMic className="text-xl" />
            </button>

            <div className="flex-1 h-[48px] bg-white rounded-full border border-[#E2E8F0] flex items-center px-4 shadow-sm">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite aqui..."
                    className="flex-1 bg-transparent outline-none text-[14px] text-[#1E293B] placeholder:text-[#FFDdd6] font-inria-sans italic"
                />
                <button
                    onClick={handleSend}
                    className="text-[#FF5F38] ml-2 hover:scale-110 transition-transform"
                >
                    <FiSend className="text-xl" />
                </button>
            </div>
        </div>
    )
}
