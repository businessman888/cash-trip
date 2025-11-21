'use client'

interface MetricCardProps {
  title: string
  value: string
  change?: number
  changeLabel?: string
  className?: string
}

export function MetricCard({ title, value, change, changeLabel, className = '' }: MetricCardProps) {
  const isPositive = change !== undefined && change >= 0
  const changeColor = isPositive ? 'text-[#10B981]' : 'text-[#E33629]'
  
  return (
    <div className={`bg-[#F8F9FA] rounded-[10px] p-4 ${className}`}>
      <div className="mb-3">
        <h3 className="font-inria-sans font-bold text-[20px] leading-[1.199] text-[#64748B]">
          {title}
        </h3>
      </div>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="font-inria-sans font-bold text-[24px] leading-[1.199] text-[#1E293B]">
          {value}
        </span>
        {change !== undefined && (
          <span className={`font-inria-sans font-bold text-[15px] leading-[1.199] ${changeColor}`}>
            {isPositive ? '+' : ''}{change.toFixed(0)}%
          </span>
        )}
        {changeLabel && (
          <span className="font-inria-sans font-bold text-[15px] leading-[1.199] text-[#64748B]">
            {changeLabel}
          </span>
        )}
      </div>
    </div>
  )
}

