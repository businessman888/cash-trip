'use client'

import { FiUser, FiHelpCircle, FiShield, FiUsers, FiFileText, FiLogOut, FiChevronRight } from 'react-icons/fi'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const settingsItems = [
    { icon: FiUser, label: 'Configurações da conta', color: 'bg-[#FFD7D7] text-[#E6502C]', href: '/profile/account' },
    { icon: FiHelpCircle, label: 'Ajuda', color: 'bg-[#FFD7D7] text-[#E6502C]', href: '/profile/help' },
    { icon: FiShield, label: 'Privacidade', color: 'bg-[#FFD7D7] text-[#E6502C]', href: '/profile/privacy' },
    { icon: FiUsers, label: 'Convidar um amigo', color: 'bg-[#FFD7D7] text-[#E6502C]', href: '/invite' },
    { icon: FiFileText, label: 'Legal', color: 'bg-[#FFD7D7] text-[#E6502C]', href: '/profile/legal' },
]

export function SettingsList() {
    const router = useRouter()

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div className="flex flex-col gap-4 mb-8">
            <h2 className="font-inria-sans font-bold text-[18px] text-[#FF5F38] mb-2">
                Configurações
            </h2>

            {settingsItems.map((item, index) => (
                <Link
                    key={index}
                    href={item.href}
                    className="flex items-center justify-between w-full group"
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-[48px] h-[48px] rounded-[12px] ${item.color} flex items-center justify-center`}>
                            <item.icon className="text-[24px]" />
                        </div>
                        <span className="font-inria-sans text-[16px] text-[#64748B] dark:text-[#94A3B8] group-hover:text-[var(--text-primary)] transition-colors">
                            {item.label}
                        </span>
                    </div>
                    <FiChevronRight className="text-[#94A3B8] text-xl" />
                </Link>
            ))}

            <button
                onClick={handleLogout}
                className="flex items-center gap-4 mt-2 w-full group"
            >
                <div className="w-[48px] h-[48px] rounded-[12px] bg-[#FFD7D7] text-[#E6502C] flex items-center justify-center">
                    <FiLogOut className="text-[24px]" />
                </div>
                <span className="font-inria-sans text-[16px] text-[#64748B] dark:text-[#94A3B8] group-hover:text-red-500 transition-colors">
                    Sair
                </span>
            </button>
        </div>
    )
}
