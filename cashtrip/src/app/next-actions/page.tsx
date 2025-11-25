'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CategoryCard } from '@/components/next-actions/CategoryCard'
import { FaChevronLeft, FaHotel, FaPlane, FaSuitcase } from 'react-icons/fa'

interface Action {
    id: string
    icon: React.ReactNode
    title: string
    subtitle?: string
    completed: boolean
    showProgress?: boolean
    progress?: number
}

interface Category {
    id: string
    title: string
    actions: Action[]
}

// Mock data baseado no design fornecido
const initialCategories: Category[] = [
    {
        id: 'viagem-toquio',
        title: 'Viagem para Tóquio',
        actions: [
            {
                id: '1-1',
                icon: <FaHotel size={20} style={{ color: 'var(--color-primary)' }} />,
                title: 'Reservar Hotel',
                subtitle: 'Prazo: até dia 25 de dezembro',
                completed: false,
            },
            {
                id: '1-2',
                icon: <FaPlane size={20} style={{ color: 'var(--color-primary)' }} />,
                title: 'Fazer check-in do voo',
                subtitle: 'Prazo: até dia 28 de dezembro',
                completed: true,
            },
        ],
    },
    {
        id: 'bagagens',
        title: 'Bagagens',
        actions: [
            {
                id: '2-1',
                icon: <FaSuitcase size={20} style={{ color: 'var(--color-primary)' }} />,
                title: 'Comprar mala de mão',
                subtitle: 'Viagem para Tóquio',
                completed: false,
            },
        ],
    },
    {
        id: 'documentos',
        title: 'Documentos',
        actions: [
            {
                id: '3-1',
                icon: <FaPlane size={20} style={{ color: 'var(--color-primary)' }} />,
                title: 'Verificar qualidade do...',
                subtitle: undefined,
                completed: false,
                showProgress: true,
                progress: 35,
            },
        ],
    },
]

export default function NextActionsPage() {
    const router = useRouter()
    const [categories, setCategories] = useState<Category[]>(initialCategories)

    const handleToggleAction = (categoryId: string, actionId: string) => {
        setCategories(prevCategories =>
            prevCategories.map(category =>
                category.id === categoryId
                    ? {
                        ...category,
                        actions: category.actions.map(action =>
                            action.id === actionId
                                ? { ...action, completed: !action.completed }
                                : action
                        ),
                    }
                    : category
            )
        )
    }

    return (
        <div
            className="min-h-screen pb-20 font-roboto-condensed"
            style={{ background: 'var(--surface-main)' }}
        >
            {/* Header with Back Button */}
            <div className="px-4 pt-6 mb-6">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:opacity-80 transition-opacity"
                    aria-label="Voltar"
                >
                    <FaChevronLeft size={24} style={{ color: 'var(--text-primary)' }} />
                </button>
            </div>

            {/* Title */}
            <div className="px-6 mb-6">
                <h1
                    className="text-[24px] font-bold font-roboto-condensed"
                    style={{ color: 'var(--text-primary)' }}
                >
                    Próximas Ações
                </h1>
            </div>

            {/* Category Cards */}
            <div className="px-4 space-y-4 max-w-md mx-auto">
                {categories.map((category) => (
                    <CategoryCard
                        key={category.id}
                        title={category.title}
                        actions={category.actions}
                        onToggleAction={(actionId) => handleToggleAction(category.id, actionId)}
                    />
                ))}
            </div>
        </div>
    )
}
