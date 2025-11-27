'use client'

import { ProfileSubPageHeader } from '@/components/profile/ProfileSubPageHeader'

import { FiShare2, FiCopy, FiRefreshCw } from 'react-icons/fi'
import { useState } from 'react'

export default function InvitePage() {
    const [copied, setCopied] = useState(false)
    const [inviteCode, setInviteCode] = useState("CASHTRIP2024")
    const [isGenerating, setIsGenerating] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const generateNewCode = () => {
        setIsGenerating(true)
        // Mock generation
        setTimeout(() => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
            let result = ''
            for (let i = 0; i < 8; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length))
            }
            setInviteCode(result)
            setIsGenerating(false)
        }, 800)
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Cash Trip',
                    text: `Venha planejar suas viagens comigo no Cash Trip! Use meu código: ${inviteCode}`,
                    url: 'https://cashtrip.app',
                })
            } catch (error) {
                console.log('Error sharing', error)
            }
        }
    }

    return (
        <div className="min-h-screen bg-[var(--surface-main)] pb-24">
            <div className="p-6">
                <ProfileSubPageHeader title="Convidar um amigo" />

                <div className="flex flex-col items-center justify-center py-8 space-y-6">
                    <div className="w-32 h-32 border-4 border-[#FF5F38] rounded-full flex items-center justify-center mb-4">
                        <FiShare2 className="text-5xl text-[#FF5F38]" />
                    </div>

                    <div className="text-center space-y-2">
                        <h2 className="font-inria-sans font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
                            Convide amigos e ganhe!
                        </h2>
                        <p className="max-w-[280px] mx-auto text-sm" style={{ color: 'var(--text-primary)' }}>
                            Compartilhe seu código com amigos e ganhe benefícios exclusivos na sua próxima viagem
                        </p>
                    </div>

                    <div className="w-full space-y-4">
                        <div className="flex items-center justify-between bg-white dark:bg-[#313F56] border border-[#FF5F38]/30 p-4 rounded-xl">
                            <div className="font-mono font-bold text-lg tracking-wider" style={{ color: 'var(--text-primary)' }}>
                                {inviteCode}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={generateNewCode}
                                    disabled={isGenerating}
                                    className="p-2 text-[#FF5F38] hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                                    title="Gerar novo código"
                                >
                                    <FiRefreshCw size={20} className={isGenerating ? 'animate-spin' : ''} />
                                </button>
                                <button
                                    onClick={handleCopy}
                                    className="p-2 text-[#FF5F38] hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                                    title="Copiar código"
                                >
                                    {copied ? <span className="text-sm font-bold">✓</span> : <FiCopy size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleShare}
                            className="w-full py-4 bg-[#FF5F38] text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 hover:bg-[#E64E28] transition-colors"
                        >
                            <FiShare2 size={20} />
                            Compartilhar link
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}
