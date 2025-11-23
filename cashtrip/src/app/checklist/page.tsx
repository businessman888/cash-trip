'use client'

import { useState } from 'react'
import { ChecklistHeader } from '@/components/checklist/ChecklistHeader'
import { ChecklistSection } from '@/components/checklist/ChecklistSection'
import { ChecklistItem } from '@/components/checklist/ChecklistItem'
import { AddItemButton } from '@/components/checklist/AddItemButton'

interface ChecklistItemData {
    id: string
    label: string
    isChecked: boolean
    type: 'essentials' | 'recommended'
}

export default function ChecklistPage() {
    const [items, setItems] = useState<ChecklistItemData[]>([
        { id: '1', label: 'Passaporte', isChecked: true, type: 'essentials' },
        { id: '2', label: 'Cartões de crédito', isChecked: true, type: 'essentials' },
        { id: '3', label: 'Dinheiro', isChecked: true, type: 'essentials' },
        { id: '4', label: 'Carregador de celular', isChecked: false, type: 'essentials' },
        { id: '5', label: 'Medicamentos', isChecked: false, type: 'essentials' },
        { id: '6', label: 'Adaptador Universal', isChecked: false, type: 'recommended' },
        { id: '7', label: 'Roupas para o clima', isChecked: false, type: 'recommended' },
        { id: '8', label: 'Protetor solar', isChecked: false, type: 'recommended' },
        { id: '9', label: 'Fones de ouvido', isChecked: true, type: 'recommended' },
    ])

    const toggleItem = (id: string) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, isChecked: !item.isChecked } : item
        ))
    }

    const essentials = items.filter(item => item.type === 'essentials')
    const recommended = items.filter(item => item.type === 'recommended')

    const essentialsChecked = essentials.filter(item => item.isChecked).length
    const recommendedChecked = recommended.filter(item => item.isChecked).length

    return (
        <div className="min-h-screen bg-[var(--surface-main)] pb-24">
            <div className="p-6">
                <ChecklistHeader />

                <ChecklistSection
                    title="Essenciais"
                    currentCount={essentialsChecked}
                    totalCount={essentials.length}
                    type="essentials"
                />
                <div className="space-y-3">
                    {essentials.map(item => (
                        <ChecklistItem
                            key={item.id}
                            label={item.label}
                            isChecked={item.isChecked}
                            onToggle={() => toggleItem(item.id)}
                        />
                    ))}
                </div>

                <ChecklistSection
                    title="Recomendados"
                    currentCount={recommendedChecked}
                    totalCount={recommended.length}
                    type="recommended"
                />
                <div className="space-y-3">
                    {recommended.map(item => (
                        <ChecklistItem
                            key={item.id}
                            label={item.label}
                            isChecked={item.isChecked}
                            onToggle={() => toggleItem(item.id)}
                        />
                    ))}
                </div>
            </div>

            <AddItemButton />
        </div>
    )
}
