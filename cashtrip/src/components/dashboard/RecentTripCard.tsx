'use client'

import { Trip } from '@/hooks/useDashboardData'

interface RecentTripCardProps {
  trip: Trip
}

export function RecentTripCard({ trip }: RecentTripCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  return (
    <div className="bg-[rgba(248,249,250,0.8)] border border-[#D9D9D9] rounded-[10px] p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="relative w-[60px] h-[60px] flex-shrink-0">
          <div className="absolute inset-0 bg-[rgba(230,80,44,0.3)] rounded-full border-[2px] border-[#E6502C]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                fill="#FFFFFF"
              />
            </svg>
          </div>
        </div>
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <h4 className="font-inria-sans font-bold text-2xl leading-[1.199] text-[#64748B] truncate">
            {trip.destination}
          </h4>
          <div className="flex items-center gap-2 text-[#1E293B] flex-wrap">
            <span className="font-inria-sans font-normal text-[13px] leading-[1.199]">
              {formatDate(trip.start_date)}
            </span>
            <span className="text-[#64748B]">-</span>
            <span className="font-inria-sans font-normal text-[13px] leading-[1.199]">
              {formatDate(trip.end_date)}
            </span>
          </div>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-inria-sans font-bold text-2xl leading-[1.199] text-[#E6502C] whitespace-nowrap">
          R$ {Number(trip.total_cost).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  )
}

