'use client'

import { ActionItem } from './ActionItem'

interface Action {
    id: string
    icon: React.ReactNode
    title: string
    subtitle?: string
    completed: boolean
    showProgress?: boolean
    progress?: number
}

interface CategoryCardProps {
    title: string
    actions: Action[]
    onToggleAction: (actionId: string) => void
}

export function CategoryCard({ title, actions, onToggleAction }: CategoryCardProps) {
    return (
        <div
            className="rounded-[20px] p-5 shadow-sm transition-all"
            style={{ background: 'var(--surface-card)' }}
        >
            {/* Category Title */}
            <h3
                className="text-[18px] font-roboto-condensed font-bold mb-3"
                style={{ color: 'var(--text-primary)' }}
            >
                {title}
            </h3>

            {/* Action Items */}
            <div className="divide-y" style={{ borderColor: 'var(--border-line)' }}>
                {actions.map((action) => (
                    <ActionItem
                        key={action.id}
                        icon={action.icon}
                        title={action.title}
                        subtitle={action.subtitle}
                        completed={action.completed}
                        onToggle={() => onToggleAction(action.id)}
                        showProgress={action.showProgress}
                        progress={action.progress}
                    />
                ))}
            </div>
        </div>
    )
}
