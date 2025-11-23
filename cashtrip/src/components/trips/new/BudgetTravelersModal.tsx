'use client'

import { useState } from 'react'
import { FiX, FiMinus, FiPlus, FiDollarSign, FiUsers } from 'react-icons/fi'

interface BudgetTravelersModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (budget: string, travelers: number) => void
}

export function BudgetTravelersModal({ isOpen, onClose, onConfirm }: BudgetTravelersModalProps) {
    const [budget, setBudget] = useState('')
    const [travelers, setTravelers] = useState(1)

    if (!isOpen) return null

    const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Simple currency formatting logic
        let value = e.target.value.replace(/\D/g, '')
        if (value) {
            value = (parseInt(value) / 100).toFixed(2)
            value = value.replace('.', ',')
            value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
            setBudget(`R$ ${value}`)
        } else {
            setBudget('')
        }
    }

    const handleConfirm = () => {
        if (budget && travelers > 0) {
            onConfirm(budget, travelers)
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/50 backdrop-blur-sm">
            <div className="w-full sm:w-[400px] bg-white rounded-t-[30px] sm:rounded-[30px] p-6 animate-slide-up relative">
                {/* Drag Handle */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[40px] h-[4px] bg-[#E2E8F0] rounded-full" />

                {/* Header */}
                <div className="flex justify-between items-center mt-4 mb-8">
                    <h2 className="font-inria-sans font-bold text-[20px] text-[#1E293B]">
                        Detalhes da viagem
                    </h2>
                    <button onClick={onClose} className="text-[#1E293B]">
                        <FiX className="text-2xl" />
                    </button>
                </div>

                {/* Budget Input */}
                <div className="mb-8">
                    <label className="block font-inria-sans font-bold text-[16px] text-[#64748B] mb-3">
                        Qual seu orçamento?
                    </label>
                    <div className="relative">
                        <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF5F38] text-xl" />
                        <input
                            type="text"
                            value={budget}
                            onChange={handleBudgetChange}
                            placeholder="R$ 0,00"
                            className="w-full h-[56px] pl-12 pr-4 rounded-[20px] bg-[#F8FAFC] border border-[#E2E8F0] text-[18px] font-inria-sans font-bold text-[#1E293B] outline-none focus:border-[#FF5F38] placeholder:text-[#94A3B8]"
                        />
                    </div>
                </div>

                {/* Travelers Counter */}
                <div className="mb-8">
                    <label className="block font-inria-sans font-bold text-[16px] text-[#64748B] mb-3">
                        Quantas pessoas vão?
                    </label>
                    <div className="flex items-center justify-between bg-[#F8FAFC] p-2 rounded-[20px] border border-[#E2E8F0]">
                        <button
                            onClick={() => setTravelers(Math.max(1, travelers - 1))}
                            className="w-[48px] h-[48px] flex items-center justify-center bg-white rounded-[16px] text-[#FF5F38] shadow-sm border border-[#E2E8F0] active:scale-95 transition-transform"
                        >
                            <FiMinus className="text-xl" />
                        </button>

                        <div className="flex items-center gap-3">
                            <FiUsers className="text-[#64748B] text-xl" />
                            <span className="font-inria-sans font-bold text-[24px] text-[#1E293B]">
                                {travelers}
                            </span>
                        </div>

                        <button
                            onClick={() => setTravelers(travelers + 1)}
                            className="w-[48px] h-[48px] flex items-center justify-center bg-[#FF5F38] rounded-[16px] text-white shadow-lg shadow-[#FF5F38]/30 active:scale-95 transition-transform"
                        >
                            <FiPlus className="text-xl" />
                        </button>
                    </div>
                </div>

                {/* Footer Button */}
                <button
                    onClick={handleConfirm}
                    disabled={!budget}
                    className="w-full h-[56px] bg-[#FF5F38] text-white rounded-[28px] font-inria-sans font-bold text-[18px] shadow-lg shadow-[#FF5F38]/30 hover:bg-[#E64A2E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Confirmar detalhes
                </button>
            </div>
        </div>
    )
}
