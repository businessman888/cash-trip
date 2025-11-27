'use client'

import { ProfileSubPageHeader } from '@/components/profile/ProfileSubPageHeader'


export default function LegalPage() {
    return (
        <div className="min-h-screen bg-[var(--surface-main)] pb-24">
            <div className="p-6">
                <ProfileSubPageHeader title="Legal" />

                <div className="space-y-6">
                    <div className="p-6 rounded-2xl space-y-6" style={{ color: 'var(--text-primary)' }}>
                        <section>
                            <h3 className="font-inria-sans font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                                Termos de Uso
                            </h3>
                            <p className="text-sm leading-relaxed">
                                Ao utilizar o Cash Trip, você concorda com nossos termos de serviço. O aplicativo é fornecido "como está", e nos reservamos o direito de modificar ou descontinuar o serviço a qualquer momento.
                            </p>
                        </section>

                        <section>
                            <h3 className="font-inria-sans font-bold text-[#1E293B] dark:text-white mb-2">
                                Licenças
                            </h3>
                            <p className="text-sm leading-relaxed">
                                Todo o conteúdo, design e código deste aplicativo são propriedade intelectual do Cash Trip ou de seus licenciadores. O uso não autorizado é proibido.
                            </p>
                        </section>

                        <section>
                            <h3 className="font-inria-sans font-bold text-[#1E293B] dark:text-white mb-2">
                                Versão do Aplicativo
                            </h3>
                            <p className="text-sm leading-relaxed">
                                v1.0.0 (Beta)
                            </p>
                        </section>
                    </div>
                </div>
            </div>

        </div>
    )
}
