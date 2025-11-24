'use client'

import { FiMapPin, FiMoreHorizontal } from 'react-icons/fi'

interface TrendingListItemProps {
    rank: number
    destination: string
    country?: string
}

export function TrendingListItem({ rank, destination, country }: TrendingListItemProps) {
    return (
        <div className="bg-[var(--surface-card)] rounded-[15px] p-4 flex items-center justify-between border border-[var(--border-line)] dark:border-transparent mb-3">
            <div className="flex items-center gap-4">
                <div className={`
          w-[40px] h-[40px] rounded-full flex items-center justify-center font-inria-sans font-bold text-[20px] border
          ${rank === 1 ? 'bg-[#FF5F38]/10 text-[#FF5F38] border-[#FF5F38]' :
                        rank === 2 ? 'bg-[#FF5F38]/10 text-[#FF5F38] border-[#FF5F38]' :
                            'bg-[#FF5F38]/10 text-[#FF5F38] border-[#FF5F38]'}
        `}>
                    {rank}
                </div>
                <div>
                    <h3 className="font-inria-sans font-bold text-[16px] text-[var(--text-primary)]">
                        {destination}{country ? `, ${country}` : ''}
                    </h3>
                </div>
            </div>

            <button className="text-[#94A3B8]">
                <FiMoreHorizontal className="text-xl" />
            </button>
        </div>
    )
}
