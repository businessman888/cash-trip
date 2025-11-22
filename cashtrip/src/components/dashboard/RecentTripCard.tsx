'use client'

import { Trip } from '@/hooks/useDashboardData'
import { useTheme } from '@/contexts/ThemeContext'

interface RecentTripCardProps {
  trip: Trip
}

export function RecentTripCard({ trip }: RecentTripCardProps) {
  const { theme } = useTheme()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  return (
    <div
      className={`rounded-[16px] p-4 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow duration-200 ${theme === 'light' ? 'border border-[#E2E8F0]' : ''}`}
      style={{ background: 'var(--surface-trip-card)' }}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="relative w-[48px] h-[48px] flex-shrink-0 bg-[#FFF1EE] rounded-full flex items-center justify-center border border-[#FF5F38]/20">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#FF5F38]"
          >
            <path
              d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <h4 className="font-inria-sans font-bold text-[16px] leading-tight text-[#1E293B] truncate">
            {trip.destination}
          </h4>
          <div className="flex items-center gap-2 text-[#64748B]">
            <span className="font-inria-sans text-[12px]">
              {formatDate(trip.start_date)}
            </span>
            <span>-</span>
            <span className="font-inria-sans text-[12px]">
              {formatDate(trip.end_date)}
            </span>
          </div>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-inria-sans font-bold text-[16px] text-[#FF5F38] whitespace-nowrap">
          R$ {Number(trip.total_cost).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  )
}

