'use client'

import { FaPlane } from 'react-icons/fa'

interface TripHistoryCardProps {
    destination: string
    startDate: string
    endDate: string
    totalCost: number
}

export function TripHistoryCard({
    destination,
    startDate,
    endDate,
    totalCost,
}: TripHistoryCardProps) {
    // Format dates
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        const day = String(date.getDate()).padStart(2, '0')
        const month = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
        const year = date.getFullYear()
        return { day, month, year }
    }

    const formatCurrency = (value: number) => {
        return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    }

    const start = formatDate(startDate)
    const end = formatDate(endDate)

    return (
        <div
            className="rounded-[20px] p-4 shadow-sm flex items-center gap-4 transition-all hover:shadow-md"
            style={{ background: 'var(--surface-card)' }}
        >
            {/* Plane Icon */}
            <div
                className="w-[50px] h-[50px] rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255, 95, 56, 0.3)' }}
            >
                <FaPlane size={20} style={{ color: 'var(--color-primary)' }} />
            </div>

            {/* Trip Info */}
            <div className="flex-1 min-w-0">
                <h3
                    className="text-[16px] font-roboto-condensed font-bold mb-1"
                    style={{ color: 'var(--text-primary)' }}
                >
                    {destination}
                </h3>
                <p
                    className="text-[12px] font-roboto-condensed"
                    style={{ color: 'var(--text-secondary)' }}
                >
                    {start.day} {start.month} - {end.day} {end.month}, {end.year}
                </p>
            </div>

            {/* Cost Info */}
            <div className="text-right flex-shrink-0">
                <p
                    className="text-[14px] font-roboto-condensed font-bold mb-0.5"
                    style={{ color: 'var(--color-primary)' }}
                >
                    {formatCurrency(totalCost)}
                </p>
                <p
                    className="text-[11px] font-roboto-condensed"
                    style={{ color: 'var(--text-secondary)' }}
                >
                    Custo total
                </p>
            </div>
        </div>
    )
}
