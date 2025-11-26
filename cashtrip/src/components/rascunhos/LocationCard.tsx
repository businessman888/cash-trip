'use client'

import { useState, useEffect } from 'react'
import { getRandomPhoto, UnsplashImage } from '@/services/unsplash'
import { FaSun } from 'react-icons/fa'

interface LocationCardProps {
    name: string
    location: string
    temperature: number
    imageQuery: string
    onViewLocation?: () => void
}

export function LocationCard({
    name,
    location,
    temperature,
    imageQuery,
    onViewLocation
}: LocationCardProps) {
    const [image, setImage] = useState<UnsplashImage | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        const loadImage = async () => {
            setIsLoading(true)
            setHasError(false)

            try {
                const photo = await getRandomPhoto(imageQuery)
                if (photo) {
                    setImage(photo)
                } else {
                    setHasError(true)
                }
            } catch (error) {
                console.error('Error loading image:', error)
                setHasError(true)
            } finally {
                setIsLoading(false)
            }
        }

        loadImage()
    }, [imageQuery])

    return (
        <div
            className="rounded-[20px] p-4 flex flex-col gap-4 shadow-md transition-all hover:shadow-lg"
            style={{ background: 'var(--surface-card)' }}
        >
            {/* Top Section: Image, Name/Location, Temperature */}
            <div className="flex items-center gap-3">
                {/* Image */}
                <div className="w-[80px] h-[80px] rounded-[12px] overflow-hidden flex-shrink-0 bg-gray-200">
                    {isLoading ? (
                        <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ background: 'var(--surface-todos)' }}
                        >
                            <div className="animate-pulse text-sm" style={{ color: 'var(--text-secondary)' }}>
                                ...
                            </div>
                        </div>
                    ) : hasError ? (
                        <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ background: 'var(--surface-todos)' }}
                        >
                            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                📷
                            </span>
                        </div>
                    ) : (
                        <img
                            src={image?.url}
                            alt={image?.alt_description || name}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>

                {/* Name and Location */}
                <div className="flex-1">
                    <h3
                        className="text-[16px] font-bold font-roboto-condensed mb-1"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        {name}
                    </h3>
                    <p
                        className="text-[14px] font-roboto-condensed"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        {location}
                    </p>
                </div>

                {/* Temperature */}
                <div className="flex flex-col items-center gap-1">
                    <FaSun size={24} style={{ color: '#FF5F38' }} />
                    <span
                        className="text-[14px] font-bold font-roboto-condensed"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        {temperature}°C
                    </span>
                </div>
            </div>

            {/* Bottom Section: Ver Local Button */}
            <button
                onClick={onViewLocation}
                className="w-full h-[48px] rounded-[15px] flex items-center justify-center font-roboto-condensed font-semibold text-[15px] transition-opacity hover:opacity-90"
                style={{
                    background: '#FFB4A3',
                    color: '#1E293B',
                }}
            >
                Ver Local
            </button>
        </div>
    )
}
