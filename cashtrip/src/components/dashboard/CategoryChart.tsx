'use client'

import { CategoryExpense } from '@/hooks/useDashboardData'

interface CategoryChartProps {
  data: CategoryExpense[]
}

const categoryColors: Record<CategoryExpense['category'], string> = {
  'Transporte': '#E6502C',
  'Hospedagem': '#E6502C',
  'Alimentação': '#E6502C',
  'Lazer': '#E6502C',
}

const categoryIcons: Record<CategoryExpense['category'], string> = {
  'Transporte': '✈️',
  'Hospedagem': '🏨',
  'Alimentação': '🍽️',
  'Lazer': '🎯',
}

export function CategoryChart({ data }: CategoryChartProps) {
  if (data.length === 0) {
    return (
      <div className="border border-[#D9D9D9] rounded-[10px] p-6">
        <h3 className="font-inria-sans font-bold text-[24px] leading-[1.199] text-[#64748B] mb-4">
          Despesas por Categoria
        </h3>
        <div className="flex items-center justify-center h-48 text-[#64748B]">
          Nenhum dado disponível
        </div>
      </div>
    )
  }

  // Calcular ângulos para o gráfico de pizza
  let currentAngle = -90 // Começar do topo

  return (
    <div className="border border-[#D9D9D9] rounded-[10px] p-6">
      <div className="flex flex-col gap-4">
        <h3 className="font-inria-sans font-bold text-[24px] leading-[1.199] text-[#64748B]">
          Despesas por Categoria
        </h3>
        
        <div className="flex flex-col gap-4">
          {data.map((item) => (
            <div
              key={item.category}
              className="flex items-center gap-4 p-3 rounded-[10px] bg-white/50"
            >
              <div className="w-10 h-10 flex items-center justify-center text-2xl">
                {categoryIcons[item.category]}
              </div>
              <div className="flex-1">
                <div className="font-inria-sans font-bold text-lg leading-[1.199] text-[#1E293B]">
                  R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="font-inria-sans font-normal text-[13px] leading-[1.199] text-[#64748B]">
                  {item.category}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gráfico de pizza simples */}
        <div className="relative w-[140px] h-[140px] mx-auto mt-4">
          <svg viewBox="0 0 140 140" className="w-full h-full">
            {data.map((item, index) => {
              const angle = (item.percentage / 100) * 360
              const startAngle = currentAngle
              const endAngle = currentAngle + angle
              
              const x1 = 70 + 70 * Math.cos((startAngle * Math.PI) / 180)
              const y1 = 70 + 70 * Math.sin((startAngle * Math.PI) / 180)
              const x2 = 70 + 70 * Math.cos((endAngle * Math.PI) / 180)
              const y2 = 70 + 70 * Math.sin((endAngle * Math.PI) / 180)
              
              const largeArcFlag = angle > 180 ? 1 : 0
              
              const pathData = [
                `M 70 70`,
                `L ${x1} ${y1}`,
                `A 70 70 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `Z`,
              ].join(' ')

              currentAngle = endAngle

              return (
                <path
                  key={item.category}
                  d={pathData}
                  fill={categoryColors[item.category]}
                  opacity={0.3}
                  stroke="#D9D9D9"
                  strokeWidth="20.3"
                />
              )
            })}
          </svg>
          {/* Label no centro */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-inria-sans font-bold text-[32px] leading-[1.199] text-[#1E293B]">
              {data[0]?.percentage.toFixed(0)}%
            </span>
            <span className="font-inria-sans font-bold text-base leading-[1.199] text-[#E6502C]">
              {data[0]?.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

