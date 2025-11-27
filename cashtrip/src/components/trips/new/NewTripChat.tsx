'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
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

// Mock user profile based on documentation
const mockUserProfile = {
    user_type: "leisure",
    basic_info: {
        gender: "Masculino",
        location: { city: "São Paulo", state: "SP" },
        age: 30,
        monthly_income_range: "R$ 10.000 - R$ 20.000"
    },
    psychographics: {
        travel_styles: ["Cultural", "Gastronômico"],
        pace: "Equilibrado",
        day_vibe: ["Museus", "Parques", "Cafés"],
        night_vibe: ["Bares tranquilos", "Restaurantes"],
        social_mode: "Casal"
    },
    accommodation_prefs: {
        types: ["Hotel Boutique", "Resort"],
        location_priority: ["Centro", "Perto de transporte"],
        amenities_required: ["Wi-Fi", "Café da manhã", "Piscina"],
        budget_tier: "Conforto"
    },
    gastronomy: {
        cuisines: ["Italiana", "Japonesa", "Local"],
        dietary_restrictions: [],
        dining_style: "Casual Premium"
    },
    logistics: {
        has_vehicle: false,
        local_transport_pref: "Uber/Táxi",
        flight_class: "Econômica Premium",
        connection_tolerance: "Sem escalas se possível"
    },
    lifestyle: {
        gym_routine: "Ocasional",
        music_genres: ["Jazz", "Pop", "Rock"],
        attraction_types: ["Históricas", "Naturais"],
        must_haves: "Boa comida e conforto",
        splurge_willingness: "Gastronomia",
        pets: "Não"
    }
};

export function NewTripChat({ currentStep, onStepChange }: NewTripChatProps) {
    const router = useRouter()
    const [messages, setMessages] = useState<Message[]>([])
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
    const [isDateModalOpen, setIsDateModalOpen] = useState(false)
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // State to store trip details for handover
    const [tripDetails, setTripDetails] = useState({
        location: '',
        startDate: '',
        endDate: '',
        budget: '',
        travelers: 0
    })

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isLoading])

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
        setTripDetails(prev => ({ ...prev, location }))
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
        setTripDetails(prev => ({ ...prev, startDate: start, endDate: end }))
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

    const handleBudgetSelect = async (budget: string, travelers: number) => {
        const updatedTripDetails = { ...tripDetails, budget, travelers }
        setTripDetails(updatedTripDetails)

        const newMessages = [
            ...messages,
            {
                id: '6',
                sender: 'user' as const,
                text: `O orçamento será de ${budget} para ${travelers} pessoa${travelers > 1 ? 's' : ''}`,
                type: 'text' as const
            }
        ]

        setMessages(newMessages)
        setIsBudgetModalOpen(false)
        onStepChange(4)

        // Initiate Handover to Agent
        await initiateAgentHandover(updatedTripDetails, newMessages)
    }

    const initiateAgentHandover = async (details: typeof tripDetails, currentMessages: Message[]) => {
        setIsLoading(true)

        // Construct the message history for the agent
        const agentMessages = [
            { role: 'assistant', content: 'Olá! Para onde vamos na próxima aventura?' },
            { role: 'user', content: details.location },
            { role: 'assistant', content: 'Ótima escolha! E quais são as datas?' },
            { role: 'user', content: `De ${details.startDate} até ${details.endDate}` },
            { role: 'user', content: `Somos ${details.travelers} adultos com orçamento total de ${details.budget}` }
        ]

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: agentMessages,
                    userProfile: mockUserProfile,
                    totalBudget: details.budget
                })
            })

            const data = await response.json()

            if (data.content) {
                const assistantMessage = data.content.find((c: any) => c.type === 'text')?.text
                if (assistantMessage) {
                    setMessages(prev => [
                        ...prev,
                        {
                            id: Date.now().toString(),
                            sender: 'aurora',
                            text: assistantMessage,
                            type: 'text'
                        }
                    ])
                }
            }
        } catch (error) {
            console.error('Error connecting to agent:', error)
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now().toString(),
                    sender: 'aurora',
                    text: 'Desculpe, tive um problema ao processar suas informações. Podemos tentar novamente?',
                    type: 'text'
                }
            ])
        } finally {
            setIsLoading(false)
        }
    }

    const handleSendMessage = async (text: string) => {
        // Add user message to UI
        const newMessages = [
            ...messages,
            {
                id: Date.now().toString(),
                sender: 'user' as const,
                text,
                type: 'text' as const
            }
        ]
        setMessages(newMessages)
        setIsLoading(true)

        // Convert UI messages to Agent format
        // Note: In a real app, we should maintain a separate history or map correctly
        // For now, we'll just append the new user message to a simplified history
        // or re-construct based on the flow.
        // A better approach for this demo is to keep the "agentMessages" context in state or ref.
        // But for simplicity, let's just send the last few messages + context.

        // Re-constructing context + new message
        const agentMessages = [
            { role: 'assistant', content: 'Olá! Para onde vamos na próxima aventura?' },
            { role: 'user', content: tripDetails.location },
            { role: 'assistant', content: 'Ótima escolha! E quais são as datas?' },
            { role: 'user', content: `De ${tripDetails.startDate} até ${tripDetails.endDate}` },
            { role: 'user', content: `Somos ${tripDetails.travelers} adultos com orçamento total de ${tripDetails.budget}` },
            // Add recent chat history (filtering out the initial UI steps to avoid duplication if we were strict, 
            // but here we just append the conversation that happened AFTER the handover)
            ...messages.filter(m => parseInt(m.id) > 6).map(m => ({
                role: m.sender === 'aurora' ? 'assistant' : 'user',
                content: m.text
            })),
            { role: 'user', content: text }
        ]

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: agentMessages,
                    userProfile: mockUserProfile,
                    totalBudget: tripDetails.budget
                })
            })

            const data = await response.json()

            // Handle Tool Calls (specifically submit_final_itinerary)
            if (data.stop_reason === 'tool_use' && data.tool_use?.name === 'submit_final_itinerary') {
                // Success! Redirect or show success message
                setMessages(prev => [
                    ...prev,
                    {
                        id: Date.now().toString(),
                        sender: 'aurora',
                        text: 'Roteiro finalizado! Estou salvando os detalhes...',
                        type: 'text'
                    }
                ])
                // Simulate saving delay then redirect
                setTimeout(() => {
                    router.push('/trips') // Or to the specific trip page
                }, 2000)
                return
            }

            // Handle regular text response
            if (data.content) {
                const assistantMessage = data.content.find((c: any) => c.type === 'text')?.text
                if (assistantMessage) {
                    setMessages(prev => [
                        ...prev,
                        {
                            id: Date.now().toString(),
                            sender: 'aurora',
                            text: assistantMessage,
                            type: 'text'
                        }
                    ])
                }
            }

            // Handle other tool results (like search_flights) that return data to be displayed
            // In this simplified version, if the agent returns a tool use that ISN'T submit, 
            // we might want to display the result or just let the agent continue.
            // Since our API route returns the tool result, we should probably feed it back to the agent
            // to get a text response. But for this demo, let's see if the agent included text WITH the tool use.
            // Often Claude explains what it's doing.

            // If there's a tool_result in the response (from our API mock), it means the server executed it.
            // We should probably display something or trigger another call.
            // For now, let's rely on the text content if present.

        } catch (error) {
            console.error('Error in chat:', error)
        } finally {
            setIsLoading(false)
        }
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
                {isLoading && (
                    <div className="flex items-center gap-2 text-gray-500 italic ml-4">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                        <span>Aurora está pensando...</span>
                    </div>
                )}
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
