'use client'

import { FiPaperclip, FiSend } from 'react-icons/fi'

export function ChatInput() {
    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--surface-main)] border-t border-[var(--border-line)]">
            <div className="max-w-[320px] mx-auto flex items-center gap-3">
                <button className="w-[40px] h-[40px] rounded-full bg-[var(--surface-card)] border border-[var(--border-line)] flex items-center justify-center text-[#94A3B8]">
                    <FiPaperclip className="text-lg" />
                </button>

                <div className="flex-1 h-[45px] bg-[var(--surface-card)] rounded-full border border-[var(--border-line)] flex items-center px-4 shadow-sm">
                    <input
                        type="text"
                        placeholder="Digite sua mensagem..."
                        className="w-full bg-transparent outline-none text-[14px] text-[var(--text-primary)] placeholder:text-[#94A3B8] font-inria-sans"
                    />
                    <button className="text-[#FF5F38] ml-2">
                        <FiSend className="text-lg" />
                    </button>
                </div>
            </div>
        </div>
    )
}
