'use client'

import { ProfileSubPageHeader } from '@/components/profile/ProfileSubPageHeader'


export default function AccountSettingsPage() {
    return (
        <div className="min-h-screen bg-[var(--surface-main)] pb-24">
            <div className="p-6">
                <ProfileSubPageHeader title="Configurações da conta" />

                <div className="space-y-6">
                    <div className="rounded-2xl">
                        <h3 className="font-inria-sans font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                            Informações Pessoais
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1" style={{ color: 'var(--text-primary)' }}>Nome</label>
                                <input
                                    type="text"
                                    defaultValue="Flávio"
                                    className="w-full p-3 rounded-xl bg-transparent border border-[#FF5F38] text-[#1E293B] dark:text-white focus:ring-2 focus:ring-[var(--primary-color)]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-1" style={{ color: 'var(--text-primary)' }}>Email</label>
                                <input
                                    type="email"
                                    defaultValue="flavio@example.com"
                                    className="w-full p-3 rounded-xl bg-transparent border border-[#FF5F38] text-[#1E293B] dark:text-white focus:ring-2 focus:ring-[var(--primary-color)]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl">
                        <h3 className="font-inria-sans font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                            Senhas
                        </h3>

                        <button className="w-full text-left p-3 rounded-xl bg-transparent border border-[#FF5F38] text-[#1E293B] dark:text-white hover:bg-[#FF5F38]/10 transition-colors flex justify-between items-center">
                            <span>Alterar senha</span>
                            <span className="text-2xl">›</span>
                        </button>
                    </div>

                    <button className="w-full py-4 bg-[#FF5F38] text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:bg-[#E64E28] transition-colors">
                        Salvar Alterações
                    </button>
                </div>
            </div>

        </div>
    )
}
