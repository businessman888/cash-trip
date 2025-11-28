'use client'

import { useRouter } from 'next/navigation'
import {
    FiChevronLeft,
    FiUser,
    FiLock,
    FiDollarSign,
    FiBell,
    FiMoon,
    FiGlobe,
    FiHelpCircle,
    FiHeadphones,
    FiStar,
    FiShield,
    FiFileText
} from 'react-icons/fi'
import { SettingsSection } from '@/components/settings/SettingsSection'
import { SettingsItem } from '@/components/settings/SettingsItem'

export default function SettingsPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-[var(--surface-main)] pb-24">
            {/* Header */}
            <div className="px-4 py-6 flex items-center mb-2">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 -ml-2 flex items-center justify-center text-[var(--text-primary)]"
                >
                    <FiChevronLeft className="text-2xl" />
                </button>
                <h1 className="flex-1 text-center font-inria-sans font-bold text-[20px] text-[var(--text-primary)] mr-8">
                    Configurações
                </h1>
            </div>

            <div className="px-4">
                {/* Account Settings */}
                <SettingsSection title="Configurações da Conta">
                    <SettingsItem
                        icon={FiUser}
                        label="Perfil do Usuário"
                        onClick={() => { }}
                    />
                    <SettingsItem
                        icon={FiLock}
                        label="Alterar Senha"
                        onClick={() => { }}
                    />
                    <SettingsItem
                        icon={FiDollarSign}
                        label="Moeda Padrão"
                        onClick={() => { }}
                        isLast
                    />
                </SettingsSection>

                {/* Platform Settings */}
                <SettingsSection title="Configurações da Plataforma">
                    <SettingsItem
                        icon={FiBell}
                        label="Notificações"
                        onClick={() => router.push('/notifications')}
                    />
                    <SettingsItem
                        icon={FiMoon}
                        label="Aparência"
                        onClick={() => { }}
                    />
                    <SettingsItem
                        icon={FiGlobe}
                        label="Idioma"
                        onClick={() => { }}
                        isLast
                    />
                </SettingsSection>

                {/* Help & Support */}
                <SettingsSection title="Ajuda e Suporte">
                    <SettingsItem
                        icon={FiHelpCircle}
                        label="FAQ"
                        onClick={() => { }}
                    />
                    <SettingsItem
                        icon={FiHeadphones}
                        label="Fale Conosco"
                        onClick={() => { }}
                    />
                    <SettingsItem
                        icon={FiStar}
                        label="Avaliar o App"
                        onClick={() => { }}
                        isLast
                    />
                </SettingsSection>

                {/* Legal */}
                <SettingsSection title="Legal">
                    <SettingsItem
                        icon={FiShield}
                        label="Política de Privacidade"
                        onClick={() => { }}
                    />
                    <SettingsItem
                        icon={FiFileText}
                        label="Termos de Serviço"
                        onClick={() => { }}
                        isLast
                    />
                </SettingsSection>

                {/* Logout Button */}
                <button className="w-full h-[56px] bg-[#F1F5F9] dark:bg-white/5 rounded-[20px] text-[#FF5F38] font-inria-sans font-bold text-[16px] mt-4 mb-8 hover:bg-[#E2E8F0] dark:hover:bg-white/10 transition-colors">
                    Sair
                </button>
            </div>
        </div>
    )
}
