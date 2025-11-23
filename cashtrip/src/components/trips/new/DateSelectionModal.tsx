'use client'

import { useState, useEffect, useRef } from 'react'
import { FiX } from 'react-icons/fi'

interface DateSelectionModalProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (startDate: string, endDate: string) => void
}

interface DateItem {
    date: Date
    day: number
    month: string
    label: string
}

// Helper to generate dates for the next 365 days
const generateDateItems = (): DateItem[] => {
    const dates: DateItem[] = []
    const today = new Date()
    const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

    for (let i = 0; i < 365; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        dates.push({
            date: date,
            day: date.getDate(),
            month: months[date.getMonth()],
            label: `${date.getDate()} ${months[date.getMonth()]}`
        })
    }
    return dates
}

interface DateWheelProps {
    label: string
    items: DateItem[]
    selectedIndex: number
    onChange: (index: number) => void
}

function DateWheel({ label, items, selectedIndex, onChange }: DateWheelProps) {
    const wheelRef = useRef<HTMLDivElement>(null)

    const handleWheel = (e: React.WheelEvent) => {
        if (e.deltaY > 0) {
            onChange(Math.min(items.length - 1, selectedIndex + 1))
        } else {
            onChange(Math.max(0, selectedIndex - 1))
        }
    }

    // Simple touch handling for mobile "scroll" feel
    const touchStartY = useRef<number>(0)

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.touches[0].clientY
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        const touchEndY = e.touches[0].clientY
        const diff = touchStartY.current - touchEndY

        if (Math.abs(diff) > 20) { // Threshold
            if (diff > 0) {
                onChange(Math.min(items.length - 1, selectedIndex + 1))
            } else {
                onChange(Math.max(0, selectedIndex - 1))
            }
            touchStartY.current = touchEndY // Reset to avoid rapid scrolling
        }
    }

    // Get visible items (prev, current, next)
    const prevItem = selectedIndex > 0 ? items[selectedIndex - 1] : null
    const currentItem = items[selectedIndex]
    const nextItem = selectedIndex < items.length - 1 ? items[selectedIndex + 1] : null

    return (
        <div className="flex flex-col items-center gap-2">
            <span className="font-inria-sans font-bold text-[18px] text-[#64748B] mb-2">
                {label}
            </span>
            <div
                ref={wheelRef}
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                className="flex flex-col gap-2 cursor-grab active:cursor-grabbing select-none"
            >
                {/* Previous */}
                <div
                    onClick={() => prevItem && onChange(selectedIndex - 1)}
                    className={`w-[100px] py-2 bg-[#F1F5F9] rounded-[12px] text-center transition-colors hover:bg-[#E2E8F0] ${!prevItem ? 'opacity-0 pointer-events-none' : 'cursor-pointer'}`}
                >
                    <span className="font-inria-sans font-bold text-[14px] text-[#FF896F]">
                        {prevItem?.label || '-'}
                    </span>
                </div>

                {/* Selected */}
                <div className="w-[120px] py-3 bg-[#1E293B] rounded-[16px] text-center shadow-lg scale-110 z-10 transition-transform">
                    <span className="font-inria-sans font-bold text-[18px] text-[#FF5F38]">
                        {currentItem?.label}
                    </span>
                </div>

                {/* Next */}
                <div
                    onClick={() => nextItem && onChange(selectedIndex + 1)}
                    className={`w-[100px] py-2 bg-[#F1F5F9] rounded-[12px] text-center transition-colors hover:bg-[#E2E8F0] ${!nextItem ? 'opacity-0 pointer-events-none' : 'cursor-pointer'}`}
                >
                    <span className="font-inria-sans font-bold text-[14px] text-[#FF896F]">
                        {nextItem?.label || '-'}
                    </span>
                </div>
            </div>
        </div>
    )
}

export function DateSelectionModal({ isOpen, onClose, onSelect }: DateSelectionModalProps) {
    const [dateItems] = useState<DateItem[]>(generateDateItems())
    // Default to tomorrow for start, and 5 days later for end
    const [startIndex, setStartIndex] = useState(1)
    const [endIndex, setEndIndex] = useState(6)

    if (!isOpen) return null

    const handleConfirm = () => {
        const start = dateItems[startIndex]
        const end = dateItems[endIndex]

        // Format: "16/05/2025"
        const formatDate = (date: Date) => {
            const d = String(date.getDate()).padStart(2, '0')
            const m = String(date.getMonth() + 1).padStart(2, '0')
            const y = date.getFullYear()
            return `${d}/${m}/${y}`
        }

        onSelect(formatDate(start.date), formatDate(end.date))
        onClose()
    }

    // Ensure end date is never before start date
    const handleStartIndexChange = (index: number) => {
        setStartIndex(index)
        if (index >= endIndex) {
            setEndIndex(index + 1)
        }
    }

    const handleEndIndexChange = (index: number) => {
        if (index > startIndex) {
            setEndIndex(index)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/50 backdrop-blur-sm">
            <div className="w-full sm:w-[400px] bg-white rounded-t-[30px] sm:rounded-[30px] p-6 animate-slide-up relative">
                {/* Drag Handle */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[40px] h-[4px] bg-[#E2E8F0] rounded-full" />

                {/* Header */}
                <div className="mt-4 mb-8 text-center">
                    <h2 className="font-inria-sans font-bold text-[20px] text-[#1E293B]">
                        Quando será sua viagem?
                    </h2>
                </div>

                {/* Date Pickers Container */}
                <div className="flex justify-center gap-8 mb-8">
                    <DateWheel
                        label="ida"
                        items={dateItems}
                        selectedIndex={startIndex}
                        onChange={handleStartIndexChange}
                    />
                    <DateWheel
                        label="volta"
                        items={dateItems}
                        selectedIndex={endIndex}
                        onChange={handleEndIndexChange}
                    />
                </div>

                {/* Footer Button */}
                <button
                    onClick={handleConfirm}
                    className="w-full h-[56px] bg-[#FF5F38] text-white rounded-[28px] font-inria-sans font-bold text-[18px] shadow-lg shadow-[#FF5F38]/30 hover:bg-[#E64A2E] transition-colors"
                >
                    Confirmar datas
                </button>
            </div>
        </div>
    )
}
