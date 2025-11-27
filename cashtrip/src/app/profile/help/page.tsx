'use client'

import { ProfileSubPageHeader } from '@/components/profile/ProfileSubPageHeader'

import { FiChevronDown } from 'react-icons/fi'

export default function HelpPage() {
    const faqs = [
        { question: "Como criar uma nova viagem?", answer: "Para criar uma nova viagem, vá até a aba 'Viagens' e clique no botão '+' no canto superior direito." },
        { question: "Como adicionar despesas?", answer: "Dentro de uma viagem, clique no botão de adicionar despesa e preencha os detalhes." },
        { question: "Posso compartilhar minha viagem?", answer: "Sim! Use a opção 'Convidar um amigo' nas configurações ou dentro dos detalhes da viagem." },
    ]

    return (
        <div className="min-h-screen bg-[var(--surface-main)] pb-24">
            <div className="p-6">
                <ProfileSubPageHeader title="Ajuda" />

                <div className="space-y-4">
                    <div className="p-6 rounded-2xl text-center mb-6">
                        <h3 className="font-inria-sans font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                            Precisa de mais ajuda?
                        </h3>
                        <p className="mb-4" style={{ color: 'var(--text-primary)' }}>
                            Entre em contato com nosso suporte
                        </p>
                        <button className="px-6 py-2 bg-[#FF5F38] text-white rounded-full font-bold text-sm hover:bg-[#E64E28] transition-colors">
                            Fale Conosco
                        </button>
                    </div>

                    <h3 className="font-inria-sans font-bold ml-2" style={{ color: 'var(--text-primary)' }}>
                        Perguntas Frequentes
                    </h3>

                    {faqs.map((faq, index) => (
                        <div key={index} className="border border-[#FF5F38] p-4 rounded-2xl">
                            <details className="group">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span style={{ color: 'var(--text-primary)' }}>{faq.question}</span>
                                    <span className="transition group-open:rotate-180 text-[#FF5F38]">
                                        <FiChevronDown />
                                    </span>
                                </summary>
                                <div className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                                    {faq.answer}
                                </div>
                            </details>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}
