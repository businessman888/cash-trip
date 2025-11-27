'use client'

import { ProfileSubPageHeader } from '@/components/profile/ProfileSubPageHeader'

import { useState } from 'react'

export default function PrivacyPage() {
    const [settings, setSettings] = useState({
        publicProfile: true,
        showPastTrips: true,
        allowEmailSearch: false,
        shareData: false
    })

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }))
    }

    return (
        <div className="min-h-screen bg-[var(--surface-main)] pb-24">
            <div className="p-6">
                <ProfileSubPageHeader title="Privacidade" />

                <div className="space-y-6">
                    <div className="p-4 rounded-2xl">
                        <h3 className="font-inria-sans font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                            Configurações de Privacidade
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between border border-[#FF5F38] p-3 rounded-xl">
                                <span style={{ color: 'var(--text-primary)' }}>Perfil Público</span>
                                <button
                                    onClick={() => toggleSetting('publicProfile')}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${settings.publicProfile ? 'bg-[#FF5F38]' : 'bg-gray-300 dark:bg-gray-600'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.publicProfile ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between border border-[#FF5F38] p-3 rounded-xl">
                                <span style={{ color: 'var(--text-primary)' }}>Mostrar viagens passadas</span>
                                <button
                                    onClick={() => toggleSetting('showPastTrips')}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${settings.showPastTrips ? 'bg-[#FF5F38]' : 'bg-gray-300 dark:bg-gray-600'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.showPastTrips ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between border border-[#FF5F38] p-3 rounded-xl">
                                <span style={{ color: 'var(--text-primary)' }}>Permitir busca por email</span>
                                <button
                                    onClick={() => toggleSetting('allowEmailSearch')}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${settings.allowEmailSearch ? 'bg-[#FF5F38]' : 'bg-gray-300 dark:bg-gray-600'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.allowEmailSearch ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl space-y-6" style={{ color: 'var(--text-primary)' }}>
                        <section>
                            <h3 className="font-inria-sans font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                                Coleta de Dados
                            </h3>
                            <p className="text-sm leading-relaxed">
                                Coletamos apenas os dados necessários para o funcionamento do aplicativo, como seu nome, email e informações sobre suas viagens.
                            </p>
                        </section>

                        <section>
                            <h3 className="font-inria-sans font-bold text-[#1E293B] dark:text-white mb-2">
                                Compartilhamento
                            </h3>
                            <p className="text-sm leading-relaxed">
                                Não vendemos nem compartilhamos seus dados pessoais com terceiros para fins de marketing.
                            </p>
                        </section>
                    </div>
                </div>
            </div>

        </div>
    )
}
