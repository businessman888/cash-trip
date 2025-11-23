'use client'

import { ChatBubble } from './ChatBubble'
import { ChatInput } from './ChatInput'

export function ChatInterface() {
    return (
        <div className="flex flex-col h-full pb-20">
            <div className="flex-1 overflow-y-auto px-2">
                <div className="text-center mb-6">
                    <p className="text-[12px] text-[#94A3B8] font-inria-sans">Hoje, 10:30</p>
                </div>

                <ChatBubble
                    isAgent
                    message="Olá! Vi que você tem uma viagem marcada para Cancún. Como posso ajudar com os preparativos?"
                    timestamp="10:30"
                />

                <ChatBubble
                    message="Oi! Gostaria de saber se preciso de visto para entrar no México."
                    timestamp="10:31"
                />

                <ChatBubble
                    isAgent
                    message="Para brasileiros, atualmente é necessário apresentar o visto físico válido ou o visto americano/canadense/japonês/europeu se você tiver algum desses. Caso contrário, precisa solicitar o visto mexicano no consulado."
                    timestamp="10:32"
                />
            </div>

            <ChatInput />
        </div>
    )
}
