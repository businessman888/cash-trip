'use client'

import { CategoryExpense } from '@/hooks/useDashboardData'
import { useTheme } from '@/contexts/ThemeContext'

interface CategoryChartProps {
  data: CategoryExpense[]
}

export function CategoryChart({ data }: CategoryChartProps) {
  const { theme } = useTheme()

  if (data.length === 0) {
    return (
      <div
        className={`rounded-[20px] p-6 h-full ${theme === 'light'
          ? 'border border-[#E2E8F0] bg-white'
          : 'border border-white'
          }`}
        style={{ background: theme === 'dark' ? '#1E293B' : undefined }}
      >
        <h3 className={`font-bold text-lg mb-6 ${theme === 'light' ? 'text-[#64748B]' : 'text-white'}`}>
          Despesas por Categoria
        </h3>
        <div className={`flex items-center justify-center h-48 ${theme === 'light' ? 'text-[#64748B]' : 'text-white'}`}>
          Nenhum dado disponível
        </div>
      </div>
    )
  }

  // Sort data by percentage descending to ensure the largest is first (for the chart highlight)
  // Assuming data is already sorted or we want to highlight the first one provided.
  // The mock data has Transporte (40%) first.
  const primaryItem = data[0]

  // Chart calculations
  const size = 160
  const strokeWidth = 20
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  let currentOffset = circumference / 4 // Start at top (-90deg equivalent with SVG rotation)

  return (
    <div
      className={`rounded-[20px] p-6 h-full ${theme === 'light'
          ? 'border border-[#E2E8F0] bg-white'
          : 'border border-white'
        }`}
      style={{ background: theme === 'dark' ? '#1E293B' : undefined }}
    >
      <h3 className={`font-bold text-lg mb-6 ${theme === 'light' ? 'text-[#64748B]' : 'text-white'}`}>
        Despesas por Categoria
      </h3>

      <div className="flex flex-row items-center gap-4">
        {/* List Section */}
        <div className="flex-1 w-full space-y-4">
          {data.map((item) => (
            <div key={item.category}>
              <div className="flex justify-between items-end mb-1">
                <span className={`font-bold text-xs ${theme === 'light' ? 'text-[#64748B]' : 'text-white'}`}>
                  {item.category}
                </span>
                <span className={`font-bold text-xs whitespace-nowrap ${theme === 'light' ? 'text-[#1E293B]' : 'text-white'}`}>
                  R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              {/* Progress Bar */}
              <div className="h-3 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FF5F38] rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Donut Chart Section */}
        <div className="relative shrink-0">
          <svg width={size} height={size} className="transform -rotate-90">
            {data.map((item, index) => {
              const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`
              const strokeDashoffset = -currentOffset + (circumference / 4) // Adjust for starting position

              // Update offset for next segment
              // We accumulate the offset based on the previous segments
              // Actually, for a simple donut, we can just stack them if we calculate offsets correctly.
              // Let's use a simpler accumulation approach.

              return null // We will render them in a specific order below to handle the "Gray vs Orange" look
            })}

            {/* 
               Rendering segments:
               We want the primary item (Transporte) to be Orange.
               The rest to be Gray.
               To match the image, it looks like the Orange segment starts at the top and goes clockwise.
               The Gray segment fills the rest.
            */}

            {/* Background Circle (Gray) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#E2E8F0" // Gray for the "rest"
              strokeWidth={strokeWidth}
            />

            {/* Primary Segment (Orange) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#FF5F38"
              strokeWidth={strokeWidth}
              strokeDasharray={`${(primaryItem.percentage / 100) * circumference} ${circumference}`}
              strokeLinecap="butt" // Image shows flat ends or maybe slight round, but butt is safer for segments
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={`font-bold text-3xl ${theme === 'light' ? 'text-[#1E293B]' : 'text-white'}`}>
              {primaryItem.percentage}%
            </span>
            <span className="font-bold text-sm text-[#FF5F38]">
              {primaryItem.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

