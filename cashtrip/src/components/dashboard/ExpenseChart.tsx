'use client'

import { MonthlyExpense } from '@/hooks/useDashboardData'

interface ExpenseChartProps {
  data: MonthlyExpense[]
}

export function ExpenseChart({ data }: ExpenseChartProps) {
  if (data.length === 0) {
    return (
      <div className="border border-[#D9D9D9] rounded-[10px] p-6">
        <div className="flex items-center justify-center h-48 text-[#FFFFFF]">
          Nenhum dado disponível
        </div>
      </div>
    )
  }

  const maxAmount = Math.max(...data.map(d => d.amount), 1)
  const barHeight = 200 // altura máxima do gráfico em pixels

  return (
    <div className="border border-[#D9D9D9] rounded-[10px] p-6">
      <h3 className="font-inria-sans font-bold text-lg text-[#FFFFFF] mb-6">
        Evolução dos gastos
      </h3>
      <div className="flex items-end justify-between gap-2 h-[200px]">
        {data.map((item, index) => {
          const height = (item.amount / maxAmount) * barHeight
          const isActive = index === data.length - 1 // Último mês ativo

          return (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
              <div className="relative w-full flex items-end justify-center" style={{ height: barHeight }}>
                <div
                  className="w-full rounded-t-[10px] bg-[#E6502C] transition-all duration-300"
                  style={{
                    height: `${height}px`,
                    minHeight: height > 0 ? '4px' : '0',
                    opacity: isActive ? 1 : 0.6
                  }}
                />
              </div>
              <span className={`
                font-inria-sans font-bold text-[13px] leading-[1.199]
                ${isActive ? 'text-[#E6502C]' : 'text-[#FFFFFF]'}
              `}>
                {item.month}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

