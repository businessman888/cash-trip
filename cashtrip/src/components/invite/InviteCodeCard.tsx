'use client'

import { useState } from 'react'
import { FiRefreshCw, FiCopy } from 'react-icons/fi'

export function InviteCodeCard() {
    const [code, setCode] = useState('CshTwyxtyi-890')
    const [copied, setCopied] = useState(false)

    const generateNewCode = () => {
        // Generate a random code (mock implementation)
        const randomCode = `Csh${Math.random().toString(36).substring(2, 9)}-${Math.floor(Math.random() * 1000)}`
        setCode(randomCode)
    }

    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    return (
        <div className="w-full max-w-[380px] bg-[var(--surface-card)] p-6 rounded-[24px] shadow-sm border border-[var(--border-line)] dark:border-transparent">
            {/* Code Display */}
            <div className="border-2 border-dashed border-[#FF5F38]/30 bg-[#FF5F38]/5 rounded-[16px] p-4 mb-6 flex justify-center">
                <span className="text-[#FF5F38] font-inria-sans font-bold text-[20px]">
                    {code}
                </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
                <button
                    onClick={generateNewCode}
                    className="flex items-center gap-2 px-5 py-3 rounded-[16px] border border-[#FF5F38] text-[#FF5F38] font-inria-sans font-semibold text-[14px] hover:bg-[#FF5F38]/5 transition-colors"
                >
                    <FiRefreshCw className="text-lg" />
                    Gerar outro
                </button>
                <button
                    onClick={copyCode}
                    className="flex items-center gap-2 px-5 py-3 rounded-[16px] bg-[#FF5F38]/10 text-[#FF5F38] font-inria-sans font-semibold text-[14px] hover:bg-[#FF5F38]/20 transition-colors"
                >
                    <FiCopy className="text-lg" />
                    {copied ? 'Copiado!' : 'Copiar'}
                </button>
            </div>
        </div>
    )
}
