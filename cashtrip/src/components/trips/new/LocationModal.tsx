'use client'

import { useState, useEffect } from 'react'
import { FiX, FiSearch, FiMapPin, FiCheck } from 'react-icons/fi'
import { useGoogleAutocomplete } from '@/hooks/useGoogleAutocomplete'

interface LocationModalProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (location: string) => void
}

export function LocationModal({ isOpen, onClose, onSelect }: LocationModalProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const { predictions, fetchPredictions, getPlaceDetails } = useGoogleAutocomplete()

    // Debounce logic (300ms)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search.length > 2) { // Only search if more than 2 letters
                fetchPredictions(search)
            } else {
                // Clear predictions if search is too short
                fetchPredictions('')
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [search, fetchPredictions])

    const handleSelectPlace = async (placeId: string, description: string) => {
        try {
            const details = await getPlaceDetails(placeId)
            console.log("Coordenadas obtidas:", details)

            // Pass the description to the parent component
            onSelect(description)
            onClose()
        } catch (error) {
            console.error("Erro ao buscar detalhes:", error)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/50 backdrop-blur-sm">
            <div className="w-full sm:w-[400px] bg-white rounded-t-[30px] sm:rounded-[30px] p-6 animate-slide-up">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-inria-sans font-bold text-[20px] text-[#1E293B]">
                        Selecionar local
                    </h2>
                    <button onClick={onClose} className="text-[#1E293B]">
                        <FiX className="text-2xl" />
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF5F38] text-xl" />
                    <input
                        type="text"
                        placeholder="Digite uma cidade, país ou ponto de referência..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-[50px] pl-12 pr-4 rounded-[25px] border border-[#E2E8F0] text-[14px] font-inria-sans outline-none focus:border-[#FF5F38] placeholder:text-[#94A3B8]"
                    />
                </div>

                {/* List */}
                <div className="space-y-3 mb-8 max-h-[400px] overflow-y-auto">
                    {predictions.length > 0 ? (
                        predictions.map((place) => {
                            const isSelected = selectedId === place.place_id
                            return (
                                <button
                                    key={place.place_id}
                                    onClick={() => {
                                        setSelectedId(place.place_id)
                                        handleSelectPlace(place.place_id, place.description)
                                    }}
                                    className={`w-full p-4 rounded-[20px] border flex items-center justify-between transition-all duration-200
                                        ${isSelected
                                            ? 'bg-[#FF896F] border-[#FF896F]'
                                            : 'bg-white border-[#E2E8F0] hover:border-[#FF896F]'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-[48px] h-[48px] rounded-[16px] flex items-center justify-center
                                            ${isSelected ? 'bg-[#FF5F38]/20' : 'bg-[#E2E8F0]'}
                                        `}>
                                            <FiMapPin className={`text-2xl ${isSelected ? 'text-white' : 'text-[#1E293B]'}`} />
                                        </div>
                                        <div className="text-left">
                                            <h3 className={`font-inria-sans font-bold text-[16px] ${isSelected ? 'text-[#1E293B]' : 'text-[#1E293B]'}`}>
                                                {place.main_text}
                                            </h3>
                                            <p className={`font-inria-sans text-[13px] ${isSelected ? 'text-[#1E293B]' : 'text-[#64748B]'}`}>
                                                {place.secondary_text}
                                            </p>
                                        </div>
                                    </div>

                                    <div className={`w-[32px] h-[32px] rounded-full border-2 flex items-center justify-center
                                        ${isSelected
                                            ? 'bg-[#FF5F38] border-[#FF5F38]'
                                            : 'bg-white border-[#94A3B8]'
                                        }
                                    `}>
                                        {isSelected && <FiCheck className="text-white" />}
                                    </div>
                                </button>
                            )
                        })
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-[#94A3B8] font-inria-sans text-[14px]">
                                {search.length > 2
                                    ? 'Nenhum resultado encontrado'
                                    : 'Digite pelo menos 3 caracteres para buscar'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
