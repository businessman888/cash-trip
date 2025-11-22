'use client'

import { useTheme } from '@/contexts/ThemeContext'

type Period = 'mensal' | 'trimestral' | 'anual'

interface PeriodSelectorProps {
  selected: Period
  onChange: (period: Period) => void
}

export function PeriodSelector({ selected, onChange }: PeriodSelectorProps) {
  const { theme } = useTheme()

  const periods: { value: Period; label: string }[] = [
    { value: 'mensal', label: 'Mensal' },
    { value: 'trimestral', label: 'Trimestral' },
    { value: 'anual', label: 'Anual' },
  ]

  return (
    <div
      className="flex items-center gap-[10px] p-[9px] rounded-[10px]"
      style={{ background: theme === 'dark' ? '#313F56' : '#F8F9FA' }}
    >
      {periods.map((period) => {
        const isActive = selected === period.value
        return (
          <button
            key={period.value}
            onClick={() => onChange(period.value)}
            className={`
              w-[97px] h-[46px] rounded-[10px] flex items-center justify-center
              transition-all duration-200
              ${isActive
                ? 'bg-[#E6502C] text-white shadow-[0.6px_0.6px_9px_0px_rgba(255,95,56,0.6)]'
                : 'bg-transparent text-[#64748B] hover:bg-white/50'
              }
            `}
          >
            <span className="font-inria-sans font-bold text-base leading-[1.199]">
              {period.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}


