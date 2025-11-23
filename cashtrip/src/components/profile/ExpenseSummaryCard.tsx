'use client'

import { FiTrendingUp } from 'react-icons/fi'

export function ExpenseSummaryCard() {
    return (
        <div className="bg-[var(--surface-card)] rounded-[20px] p-6 border border-[var(--border-line)] shadow-sm mb-8">
            <div className="flex justify-between items-start mb-2">
                <span className="font-inria-sans text-[14px] text-[#64748B] dark:text-[#94A3B8]">
                    Total Gasto em 2024
                </span>
                <div className="bg-[#FF5F38]/20 text-[#FF5F38] px-3 py-1 rounded-full flex items-center gap-1 text-[12px] font-bold">
                    <FiTrendingUp />
                    <span>15% vs 2023</span>
                </div>
            </div>

            <h3 className="font-inria-sans font-bold text-[28px] text-[var(--text-primary)] mb-6">
                R$ 14.780,50
            </h3>

            {/* Progress Bar */}
            <div className="w-full h-[12px] rounded-full flex overflow-hidden mb-6">
                <div className="h-full bg-[#E63946] w-[35%]" /> {/* Hospedagem */}
                <div className="h-full bg-[#F4A261] w-[25%]" /> {/* Passagens */}
                <div className="h-full bg-[#FF8FAB] w-[20%]" /> {/* Alimentação */}
                <div className="h-full bg-[#E76F51] w-[20%]" /> {/* Roteiro */}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#E63946]" />
                    <span className="font-inria-sans text-[12px] text-[#64748B] dark:text-[#94A3B8]">Hospedagem</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#F4A261]" />
                    <span className="font-inria-sans text-[12px] text-[#64748B] dark:text-[#94A3B8]">Passagens</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF8FAB]" />
                    <span className="font-inria-sans text-[12px] text-[#64748B] dark:text-[#94A3B8]">Alimentação</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#E76F51]" />
                    <span className="font-inria-sans text-[12px] text-[#64748B] dark:text-[#94A3B8]">Roteiro</span>
                </div>
            </div>
        </div>
    )
}
