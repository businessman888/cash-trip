'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { NewTripChatBubble } from '@/components/trips/new/NewTripChatBubble'
import { NewTripChatInput } from '@/components/trips/new/NewTripChatInput'
import { LocationModal } from '@/components/trips/new/LocationModal'
import { DateSelectionModal } from '@/components/trips/new/DateSelectionModal'
import { BudgetTravelersModal } from '@/components/trips/new/BudgetTravelersModal'
import { ItineraryModal } from '@/components/trips/new/ItineraryModal'
import { FiMapPin, FiCalendar, FiDollarSign } from 'react-icons/fi'
import { IoAirplane, IoBed, IoMap } from 'react-icons/io5'

interface Message {
    id: string
    sender: 'aurora' | 'user'
    text: string
    type?: 'text' | 'action-location' | 'action-date' | 'action-budget' |
    'action-select-flight' | 'action-select-hotel' |
    'action-create-itinerary'
}

interface FlightOption {
    id: number
    airline: string
    departure: string
    arrival: string
    duration: string
    price: number
    details: string
}

interface HotelOption {
    id: number
    name: string
    rating: number
    location: string
    price: number
    details: string
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

    // New state for flight/hotel selection and itinerary
    const [flightOptions, setFlightOptions] = useState<FlightOption[]>([])
    const [hotelOptions, setHotelOptions] = useState<HotelOption[]>([])
    const [generatedItinerary, setGeneratedItinerary] = useState<any>(null)
    const [isItineraryModalOpen, setIsItineraryModalOpen] = useState(false)

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

        await sendMessageToAgent(agentMessages)
    }

    const sendMessageToAgent = async (agentMessages: any[]) => {
        console.log('[sendMessageToAgent] Calling API with:', { messages: agentMessages, userProfile: mockUserProfile, totalBudget: tripDetails.budget })

        // Create timeout controller
        const controller = new AbortController()
        const timeoutId = setTimeout(() => {
            console.error('[sendMessageToAgent] Request timeout after 60 seconds')
            controller.abort()
        }, 60000) // 60 second timeout

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: agentMessages,
                    userProfile: mockUserProfile,
                    totalBudget: tripDetails.budget
                }),
                signal: controller.signal
            })

            clearTimeout(timeoutId)

            if (!response.ok) {
                console.error('[sendMessageToAgent] HTTP error:', response.status, response.statusText)
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            console.log('[sendMessageToAgent] Received response:', data)

            if (data.error) {
                console.error('API Error:', data.error)
                setMessages(prev => [
                    ...prev,
                    {
                        id: Date.now().toString(),
                        sender: 'aurora',
                        text: `Erro no sistema: ${data.error}. Por favor, verifique as configurações (chaves de API).`,
                        type: 'text'
                    }
                ])
                return
            }

            // Handle Tool Calls
            if (data.stop_reason === 'tool_use') {
                const toolUse = data.tool_use

                if (toolUse.name === 'search_flights') {
                    // Mock flight options for now (in real app, these would come from the tool result)
                    const mockFlights = [
                        { id: 1, airline: 'Latam', departure: '10:00', arrival: '18:00', duration: '8h', price: 4500, details: 'Direto' },
                        { id: 2, airline: 'Azul', departure: '14:00', arrival: '23:00', duration: '9h', price: 4200, details: '1 Parada' }
                    ]
                    setFlightOptions(mockFlights)

                    // Add message with flight options
                    setMessages(prev => [
                        ...prev,
                        {
                            id: Date.now().toString(),
                            sender: 'aurora',
                            text: 'Encontrei algumas opções de voos para você. Qual prefere?',
                            type: 'action-select-flight'
                        }
                    ])
                } else if (toolUse.name === 'search_hotels') {
                    // Mock hotel options
                    const mockHotels = [
                        { id: 1, name: 'Park Hyatt Tokyo', rating: 5, location: 'Shinjuku', price: 7000, details: 'Luxo' },
                        { id: 2, name: 'Hotel Gracery Shinjuku', rating: 4, location: 'Shinjuku', price: 4500, details: 'Moderno' }
                    ]
                    setHotelOptions(mockHotels)

                    setMessages(prev => [
                        ...prev,
                        {
                            id: Date.now().toString(),
                            sender: 'aurora',
                            text: 'Ótimo! Agora, veja essas opções de hospedagem que selecionei:',
                            type: 'action-select-hotel'
                        }
                    ])
                } else if (toolUse.name === 'request_logistics_approval') {
                    // This step is skipped in the new flow as we do it sequentially
                    // But if the agent calls it, we can treat it as "Ready for Itinerary"
                    setMessages(prev => [
                        ...prev,
                        {
                            id: Date.now().toString(),
                            sender: 'aurora',
                            text: 'Perfeito! Com voo e hotel definidos, posso criar seu roteiro detalhado.',
                            type: 'action-create-itinerary'
                        }
                    ])
                } else if (toolUse.name === 'propose_itinerary') {
                    // Itinerary generated!
                    setGeneratedItinerary(data.content.find((c: any) => c.type === 'tool_use')?.input || toolUse.input)
                    setIsItineraryModalOpen(true)
                } else if (toolUse.name === 'submit_final_itinerary') {
                    setMessages(prev => [
                        ...prev,
                        {
                            id: Date.now().toString(),
                            sender: 'aurora',
                            text: 'Roteiro finalizado e salvo com sucesso! Boa viagem!',
                            type: 'text'
                        }
                    ])
                    setTimeout(() => router.push('/trips'), 2000)
                }
            }

            // Handle text response
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
                    text: 'Desculpe, tive um problema. Podemos tentar novamente?',
                    type: 'text'
                }
            ])
        } finally {
            setIsLoading(false)
        }
    }

    const handleFlightSelect = async (optionId: number) => {
        const selectedFlightData = flightOptions.find(f => f.id === optionId)
        if (selectedFlightData) {
            const userMessage = `Selecionei a opção ${optionId} de voo: ${selectedFlightData.airline}`

            setMessages(prev => [
                ...prev,
                {
                    id: Date.now().toString(),
                    sender: 'user',
                    text: userMessage,
                    type: 'text'
                }
            ])

            // Send selection to agent to trigger next step (Hotels)
            setIsLoading(true)
            // Reconstruct history + new message
            // In a real app, use a robust history state
            const history = [
                { role: 'assistant', content: 'Olá! Para onde vamos na próxima aventura?' },
                { role: 'user', content: tripDetails.location },
                { role: 'assistant', content: 'Ótima escolha! E quais são as datas?' },
                { role: 'user', content: `De ${tripDetails.startDate} até ${tripDetails.endDate}` },
                { role: 'user', content: `Somos ${tripDetails.travelers} adultos com orçamento total de ${tripDetails.budget}` },
                { role: 'assistant', content: 'Encontrei algumas opções de voos...' }, // Simplified context
                { role: 'user', content: userMessage }
            ]
            await sendMessageToAgent(history)
        }
    }

    const handleHotelSelect = async (optionId: number) => {
        const selectedHotelData = hotelOptions.find(h => h.id === optionId)
        if (selectedHotelData) {
            const userMessage = `Selecionei a opção ${optionId} de hotel: ${selectedHotelData.name}`

            setMessages(prev => [
                ...prev,
                {
                    id: Date.now().toString(),
                    sender: 'user',
                    text: userMessage,
                    type: 'text'
                }
            ])

            // Send selection to agent to trigger next step (Itinerary Button)
            setIsLoading(true)
            const history = [
                // ... previous history ...
                { role: 'user', content: `Selecionei a opção de voo...` }, // Simplified
                { role: 'assistant', content: 'Ótimo! Agora, veja essas opções de hospedagem...' },
                { role: 'user', content: userMessage }
            ]
            // We actually just want to trigger the "Ready for Itinerary" state, 
            // but let's send to agent so it acknowledges and maybe calls request_logistics_approval
            await sendMessageToAgent(history)
        }
    }

    const handleCreateItinerary = async () => {
        const userMessage = "Criar roteiro"
        console.log('[handleCreateItinerary] Starting itinerary creation...')
        console.log('[handleCreateItinerary] Trip Details:', tripDetails)
        console.log('[handleCreateItinerary] Flight Options:', flightOptions)
        console.log('[handleCreateItinerary] Hotel Options:', hotelOptions)

        // TEMPORARY: Alert to confirm function is called
        alert('DEBUG: handleCreateItinerary foi chamado! Verifique o console do navegador.')

        setMessages(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                sender: 'user',
                text: userMessage,
                type: 'text'
            }
        ])

        setIsLoading(true)

        // Reconstruct the FULL message history to send to backend
        const agentMessages = [
            { role: 'assistant', content: 'Olá! Para onde vamos na próxima aventura?' },
            { role: 'user', content: tripDetails.location },
            { role: 'assistant', content: 'Ótima escolha! E quais são as datas?' },
            { role: 'user', content: `De ${tripDetails.startDate} até ${tripDetails.endDate}` },
            { role: 'user', content: `Somos ${tripDetails.travelers} adultos com orçamento total de ${tripDetails.budget}` },
            { role: 'assistant', content: 'Perfeito! Encontrei essas opções de voo...' },
            { role: 'user', content: `Selecionei a opção de voo` },
            { role: 'assistant', content: 'Ótimo! Agora veja essas opções de hotel...' },
            { role: 'user', content: `Selecionei a opção de hotel` },
            { role: 'assistant', content: 'Perfeito! Voo e hotel selecionados com sucesso!' },
            { role: 'user', content: userMessage }
        ]

        console.log('[handleCreateItinerary] Sending messages:', agentMessages)
        await sendMessageToAgent(agentMessages)
    }

    const handleConfirmItinerary = async () => {
        setIsItineraryModalOpen(false)
        const userMessage = "Aprovado"
        setMessages(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                sender: 'user',
                text: userMessage,
                type: 'text'
            }
        ])

        setIsLoading(true)
        const history = [
            // ... previous history ...
            { role: 'assistant', content: 'Aqui está a proposta do roteiro...' },
            { role: 'user', content: userMessage }
        ]
        await sendMessageToAgent(history)
    }

    const handleRejectItinerary = async () => {
        setIsItineraryModalOpen(false)
        setMessages(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                sender: 'aurora',
                text: 'Sem problemas! O que você gostaria de mudar no roteiro? Manterei as mesmas opções de voo e hotel que você escolheu.',
                type: 'text'
            }
        ])
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

            if (data.error) {
                setMessages(prev => [
                    ...prev,
                    {
                        id: Date.now().toString(),
                        sender: 'aurora',
                        text: `Erro: ${data.error}`,
                        type: 'text'
                    }
                ])
                return
            }

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

                        {/* Action Buttons */}
                        {msg.sender === 'aurora' && msg.type === 'action-location' && !messages.some(m => m.id === '2') && (
                            <button onClick={handleLocationClick} className="action-btn">
                                <span>Escolher local</span> <FiMapPin className="text-xl" />
                            </button>
                        )}

                        {msg.sender === 'aurora' && msg.type === 'action-date' && !messages.some(m => m.id === '4') && (
                            <button onClick={handleDateClick} className="action-btn">
                                <span>Escolher Data</span> <FiCalendar className="text-xl" />
                            </button>
                        )}

                        {msg.sender === 'aurora' && msg.type === 'action-budget' && !messages.some(m => m.id === '6') && (
                            <button onClick={handleBudgetClick} className="action-btn">
                                <span>Definir detalhes</span> <FiDollarSign className="text-xl" />
                            </button>
                        )}

                        {/* Flight Selection Buttons */}
                        {msg.sender === 'aurora' && msg.type === 'action-select-flight' && !messages.some(m => m.text.includes('Selecionei a opção') && m.text.includes('voo')) && (
                            <div className="flex flex-col gap-3 w-full max-w-sm">
                                {flightOptions.map((flight, idx) => (
                                    <button
                                        key={flight.id}
                                        onClick={() => handleFlightSelect(flight.id)}
                                        className="w-full p-4 bg-white dark:bg-[#1E293B] rounded-[20px] border border-gray-200 dark:border-gray-700 shadow-sm hover:border-[#FF5F38] transition-all text-left group"
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-[#FF5F38]">Opção {idx + 1}</span>
                                            <IoAirplane className="text-gray-400 group-hover:text-[#FF5F38]" />
                                        </div>
                                        <p className="font-bold text-[var(--text-primary)]">{flight.airline}</p>
                                        <p className="text-sm text-[var(--text-secondary)]">{flight.details} • {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(flight.price)}</p>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Hotel Selection Buttons */}
                        {msg.sender === 'aurora' && msg.type === 'action-select-hotel' && !messages.some(m => m.text.includes('Selecionei a opção') && m.text.includes('hotel')) && (
                            <div className="flex flex-col gap-3 w-full max-w-sm">
                                {hotelOptions.map((hotel, idx) => (
                                    <button
                                        key={hotel.id}
                                        onClick={() => handleHotelSelect(hotel.id)}
                                        className="w-full p-4 bg-white dark:bg-[#1E293B] rounded-[20px] border border-gray-200 dark:border-gray-700 shadow-sm hover:border-[#FF5F38] transition-all text-left group"
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-[#FF5F38]">Opção {idx + 1}</span>
                                            <IoBed className="text-gray-400 group-hover:text-[#FF5F38]" />
                                        </div>
                                        <p className="font-bold text-[var(--text-primary)]">{hotel.name}</p>
                                        <p className="text-sm text-[var(--text-secondary)]">{hotel.details} • {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(hotel.price)}</p>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Create Itinerary Button */}
                        {msg.sender === 'aurora' && msg.type === 'action-create-itinerary' && !messages.some(m => m.text === 'Criar roteiro') && (
                            <button
                                onClick={handleCreateItinerary}
                                className="w-fit px-6 py-3 bg-[#FF5F38] text-white rounded-[20px] font-bold shadow-lg hover:bg-[#e04f2c] transition-colors flex items-center gap-2"
                            >
                                <span>Criar Roteiro</span>
                                <IoMap className="text-xl" />
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

            <ItineraryModal
                isOpen={isItineraryModalOpen}
                onClose={() => setIsItineraryModalOpen(false)}
                onConfirm={handleConfirmItinerary}
                onReject={() => setIsItineraryModalOpen(false)}
                itinerary={generatedItinerary}
            />

            <style jsx>{`
                .action-btn {
                    @apply w-fit px-6 py-3 bg-[#FFDdd6] rounded-[20px] border border-[#FF896F] flex items-center gap-2 text-[#FF5F38] font-inria-sans font-bold shadow-sm hover:bg-[#ffccc3] transition-colors self-start ml-0;
                }
            `}</style>
        </div>
    )
}
