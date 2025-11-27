'use client'


import { useState, useEffect, useRef } from 'react'
import { NewTripChatBubble } from '@/components/trips/new/NewTripChatBubble'
import { NewTripChatInput } from '@/components/trips/new/NewTripChatInput'
import { LocationModal } from '@/components/trips/new/LocationModal'
import { DateSelectionModal } from '@/components/trips/new/DateSelectionModal'
import { BudgetTravelersModal } from '@/components/trips/new/BudgetTravelersModal'
import { FiMapPin, FiCalendar, FiDollarSign } from 'react-icons/fi'

interface Message {
    id: string
    sender: 'aurora' | 'user'
    text: string
    type?: 'text' | 'action-location' | 'action-date' | 'action-budget'
}

interface NewTripChatProps {
    currentStep: number
    onStepChange: (step: number) => void
}

export function NewTripChat({ currentStep, onStepChange }: NewTripChatProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
    const [isDateModalOpen, setIsDateModalOpen] = useState(false)
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        // Initial Greeting (Step 1)
        if (currentStep === 1 && messages.length === 0) {
            setMessages([
                {
                    id: '1',
                    sender: 'aurora',
                    text: 'Olá Alexandre! Bom te ter de volta, onde será nossa próxima aventura?',
                    type: 'action-location'
                }
            ])
        }

        // Date Selection (Step 2)
        if (currentStep === 2 && messages.length === 2) {
            setTimeout(() => {
                setMessages(prev => [
                    ...prev,
                    {
                        id: '3',
                        sender: 'aurora',
                        text: 'Que maravilha, alexandre! Para sabermos o dia exato em que iniciaremos essa aventura me informe aqui:',
                        type: 'action-date'
                    }
                ])
            }, 500)
        }

        // Budget Selection (Step 3)
        if (currentStep === 3 && messages.length === 4) {
            setTimeout(() => {
                setMessages(prev => [
                    ...prev,
                    {
                        id: '5',
                        sender: 'aurora',
                        text: 'Entendido! Agora, para planejarmos melhor, qual seria o orçamento ideal e quantas pessoas irão nessa viagem?',
                        type: 'action-budget'
                    }
                ])
            }, 500)
        }
    }, [currentStep, messages.length])

    const handleLocationClick = () => {
        setIsLocationModalOpen(true)
    }

    const handleLocationSelect = (location: string) => {
        setMessages(prev => [
            ...prev,
            {
                id: '2',
                sender: 'user',
                text: `Nosso próximo destino será em ${location}`,
                type: 'text'
            }
        ])
        setIsLocationModalOpen(false)
        onStepChange(2)
    }

    const handleDateClick = () => {
        setIsDateModalOpen(true)
    }

    const handleDateSelect = (start: string, end: string) => {
        setMessages(prev => [
            ...prev,
            {
                id: '4',
                sender: 'user',
                text: `A data do destino será de: ${start} até ${end}`,
                type: 'text'
            }
        ])
        setIsDateModalOpen(false)
        onStepChange(3)
    }

    const handleBudgetClick = () => {
        setIsBudgetModalOpen(true)
    }

    const handleBudgetSelect = (budget: string, travelers: number) => {
        setMessages(prev => [
            ...prev,
            {
                id: '6',
                sender: 'user',
                text: `O orçamento será de ${budget} para ${travelers} pessoa${travelers > 1 ? 's' : ''}`,
                type: 'text'
            }
        ])
        setIsBudgetModalOpen(false)
        onStepChange(4)
    }

    const handleSendMessage = (text: string) => {
        setMessages(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                sender: 'user',
                text,
                type: 'text'
            }
        ])
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className="flex flex-col gap-2">
                        <NewTripChatBubble
                            message={msg.text}
                            sender={msg.sender}
                        />

                        {/* Action Buttons rendered below Aurora's message */}
                        {msg.sender === 'aurora' && msg.type === 'action-location' && !messages.some(m => m.id === '2') && (
                            <button
                                onClick={handleLocationClick}
                                className="w-fit px-6 py-3 bg-[#FFDdd6] rounded-[20px] border border-[#FF896F] flex items-center gap-2 text-[#FF5F38] font-inria-sans font-bold shadow-sm hover:bg-[#ffccc3] transition-colors self-start ml-0"
                            >
                                <span>Escolher local</span>
                                <FiMapPin className="text-xl" />
                            </button>
                        )}

                        {msg.sender === 'aurora' && msg.type === 'action-date' && !messages.some(m => m.id === '4') && (
                            <button
                                onClick={handleDateClick}
                                className="w-fit px-6 py-3 bg-[#FFDdd6] rounded-[20px] border border-[#FF896F] flex items-center gap-2 text-[#FF5F38] font-inria-sans font-bold shadow-sm hover:bg-[#ffccc3] transition-colors self-start ml-0"
                            >
                                <span>Escolher Data</span>
                                <FiCalendar className="text-xl" />
                            </button>
                        )}

                        {msg.sender === 'aurora' && msg.type === 'action-budget' && !messages.some(m => m.id === '6') && (
                            <button
                                onClick={handleBudgetClick}
                                className="w-fit px-6 py-3 bg-[#FFDdd6] rounded-[20px] border border-[#FF896F] flex items-center gap-2 text-[#FF5F38] font-inria-sans font-bold shadow-sm hover:bg-[#ffccc3] transition-colors self-start ml-0"
                            >
                                <span>Definir detalhes</span>
                                <FiDollarSign className="text-xl" />
                            </button>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-[var(--surface-main)]">
                <NewTripChatInput onSendMessage={handleSendMessage} />
            </div>

            <LocationModal
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
                onSelect={handleLocationSelect}
            />

            <DateSelectionModal
                isOpen={isDateModalOpen}
                onClose={() => setIsDateModalOpen(false)}
                onSelect={handleDateSelect}
            />

            <BudgetTravelersModal
                isOpen={isBudgetModalOpen}
                onClose={() => setIsBudgetModalOpen(false)}
                onConfirm={handleBudgetSelect}
            />
        </div>
    )
}
