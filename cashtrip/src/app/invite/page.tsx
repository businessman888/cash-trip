'use client'

import { useRouter } from 'next/navigation'
import { FiChevronLeft } from 'react-icons/fi'
import { ShareIllustration } from '@/components/invite/ShareIllustration'
import { InviteCodeCard } from '@/components/invite/InviteCodeCard'

export default function InvitePage() {
    const router = useRouter()

    const handleShare = () => {
        // Mock share functionality
        if (navigator.share) {
            navigator.share({
                title: 'Convide amigos para o CashTrip',
                text: 'Use meu código e ganhe benefícios!',
                url: window.location.origin
            }).catch(err => console.log('Error sharing:', err))
        } else {
            alert('Funcionalidade de compartilhamento não disponível neste navegador.')
        }
    }

    return (
        <div className="min-h-screen bg-[var(--surface-main)] flex flex-col pb-24">
            {/* Header */}
            <div className="px-4 py-6 flex items-center mb-4">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 -ml-2 flex items-center justify-center text-[var(--text-primary)]"
                >
                    <FiChevronLeft className="text-2xl" />
                </button>
                <h1 className="flex-1 text-center font-inria-sans font-bold text-[20px] text-[var(--text-primary)] mr-8">
                    Indique um Amigo
                </h1>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center px-6 pt-8">
                <ShareIllustration />

                <h2 className="font-inria-sans font-bold text-[28px] text-[var(--text-primary)] mt-8 mb-3 text-center leading-tight">
                    Convide amigos<br />e ganhe!
                </h2>

                <p className="text-center text-[#64748B] dark:text-[#94A3B8] font-inria-sans text-[15px] mb-10 max-w-[320px] leading-relaxed">
                    Compartilhe seu código com amigos e ganhe benefícios na sua próxima viagem
                </p>

                <InviteCodeCard />
            </div>

            {/* Share Button */}
            <div className="px-6 mt-8">
                <button
                    onClick={handleShare}
                    className="w-full h-[56px] bg-[#FF5F38] text-white rounded-[20px] font-inria-sans font-bold text-[16px] shadow-lg shadow-[#FF5F38]/20 hover:bg-[#E6502C] transition-colors"
                >
                    Compartilhar link
                </button>
            </div>
        </div>
    )
}
