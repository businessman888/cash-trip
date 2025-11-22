'use client'

interface MetricCardProps {
  title: string
  value: string
  change?: number
  changeLabel?: string
  className?: string
}

export function MetricCard({ title, value, change, changeLabel, icon: Icon, className = '' }: MetricCardProps & { icon?: React.ElementType }) {
  const isPositive = change !== undefined && change >= 0
  const changeColor = isPositive ? 'text-[#10B981]' : 'text-[#E33629]'

  return (
    <div className={`bg-[#F8F9FA] rounded-[10px] p-4 flex flex-col justify-between ${className}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-inria-sans font-bold text-[16px] leading-[1.2] text-[#64748B]">
          {title}
        </h3>
        {Icon && <Icon className="text-[#64748B] text-xl" />}
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-inria-sans font-bold text-[24px] leading-[1.2] text-[#1E293B]">
          {value}
        </span>
        <div className="flex items-center gap-2">
          {change !== undefined && (
            <span className={`font-inria-sans font-bold text-[13px] leading-[1.2] ${changeColor}`}>
              {isPositive ? '+' : ''}{change.toFixed(0)}%
            </span>
          )}
          {changeLabel && (
            <span className="font-inria-sans font-normal text-[13px] leading-[1.2] text-[#94A3B8]">
              {changeLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

