'use client'

import { useParams } from 'next/navigation'
import { DestinationHeader } from '@/components/destination/DestinationHeader'
import { GenerateItineraryButton } from '@/components/destination/GenerateItineraryButton'
import { WeatherWidget } from '@/components/destination/WeatherWidget'
import { AccordionSection } from '@/components/destination/AccordionSection'
import { useEffect, useState } from 'react'
import { getRandomPhoto } from '@/services/unsplash'

// Mock data for demonstration
const MOCK_DATA: Record<string, any> = {
    'paris': {
        title: 'Paris, França',
        description: 'Tóquio, a movimentada capital do Japão, mistura o ultramoderno e o tradicional, desde arranha-céus iluminados por neon a templos históricos. Ops, descrição de Paris: A Cidade Luz, famosa pela Torre Eiffel, Museu do Louvre e sua culinária requintada.',
        weather: {
            current: 28,
            forecast: [
                { day: 'Hoje', icon: 'sun', temp: 28 },
                { day: 'Seg', icon: 'cloud', temp: 26 },
                { day: 'Ter', icon: 'cloud', temp: 27 },
                { day: 'Qua', icon: 'rain', temp: 24 },
                { day: 'Qui', icon: 'cloud', temp: 25 },
                { day: 'Sex', icon: 'sun', temp: 29 },
                { day: 'Sab', icon: 'sun', temp: 30 },
            ]
        }
    },
    'default': {
        title: 'Destino Incrível',
        description: 'Um lugar maravilhoso para explorar, com rica cultura, paisagens deslumbrantes e experiências inesquecíveis esperando por você.',
        weather: {
            current: 25,
            forecast: [
                { day: 'Hoje', icon: 'sun', temp: 25 },
                { day: 'Seg', icon: 'sun', temp: 26 },
                { day: 'Ter', icon: 'cloud', temp: 24 },
                { day: 'Qua', icon: 'rain', temp: 22 },
                { day: 'Qui', icon: 'cloud', temp: 23 },
                { day: 'Sex', icon: 'sun', temp: 27 },
                { day: 'Sab', icon: 'sun', temp: 28 },
            ]
        }
    }
}

export default function DestinationPage() {
    const params = useParams()
    const rawSlug = typeof params.slug === 'string' ? params.slug : 'default'
    const decodedSlug = decodeURIComponent(rawSlug)

    // Format title from slug (e.g., "patagonia-argentina" -> "Patagonia Argentina")
    const formattedTitle = decodedSlug
        .split(/[- ]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

    // Try to find exact match in mock data, otherwise use default with dynamic title
    const mockEntry = MOCK_DATA[decodedSlug.toLowerCase()]
    const data = mockEntry || {
        ...MOCK_DATA['default'],
        title: formattedTitle
    }

    const [imageUrl, setImageUrl] = useState('')

    useEffect(() => {
        const fetchImage = async () => {
            // Use the formatted title for better search results
            const query = formattedTitle
            const photo = await getRandomPhoto(query)
            if (photo) {
                setImageUrl(photo.url)
            }
        }
        fetchImage()
    }, [formattedTitle])

    return (
        <div className="min-h-screen bg-white pb-8">
            <DestinationHeader
                title={data.title}
                imageUrl={imageUrl || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop'}
            />

            <div className="px-6 mt-6">
                <GenerateItineraryButton />

                <WeatherWidget
                    currentTemp={data.weather.current}
                    forecast={data.weather.forecast}
                />

                <div className="bg-[#F1F1F1] rounded-[24px] p-6 space-y-6 shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
                    <AccordionSection title="Descrição" defaultOpen>
                        <p>{data.description}</p>
                    </AccordionSection>

                    <div className="h-[1px] bg-[#E2E8F0] w-full" />

                    <AccordionSection title="Pontos de interesse">
                        <ul className="list-disc pl-4 space-y-2">
                            <li>Museus históricos e galerias de arte</li>
                            <li>Parques e jardins botânicos</li>
                            <li>Monumentos famosos</li>
                            <li>Bairros tradicionais</li>
                        </ul>
                    </AccordionSection>

                    <div className="h-[1px] bg-[#E2E8F0] w-full" />

                    <AccordionSection title="Gastronomia">
                        <p>Experimente os pratos locais em restaurantes renomados e descubra os sabores únicos da região.</p>
                    </AccordionSection>

                    <div className="h-[1px] bg-[#E2E8F0] w-full" />

                    <AccordionSection title="Dicas locais">
                        <p>Utilize o transporte público para se locomover com facilidade e evite horários de pico nas atrações mais populares.</p>
                    </AccordionSection>
                </div>
            </div>
        </div>
    )
}
