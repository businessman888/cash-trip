'use client'

interface TabSelectorProps {
    activeTab: 'completed' | 'recent'
    onTabChange: (tab: 'completed' | 'recent') => void
}

export function TabSelector({ activeTab, onTabChange }: TabSelectorProps) {
    return (
        <div
            className="flex gap-[10px] items-center justify-center p-1 rounded-[20px]"
            style={{ background: 'var(--surface-card)' }}
        >
            {/* Viagens Realizadas Tab */}
            <button
                onClick={() => onTabChange('completed')}
                className="h-[53px] w-[168px] rounded-[15px] flex items-center justify-center transition-all font-roboto-condensed font-semibold text-[15px]"
                style={{
                    background: activeTab === 'completed' ? 'var(--color-primary)' : 'transparent',
                    color: activeTab === 'completed' ? '#1E293B' : 'var(--text-primary)',
                    boxShadow: activeTab === 'completed' ? '2px 3px 4px 0px rgba(0, 0, 0, 0.25)' : 'none',
                }}
            >
                Viagens Realizadas
            </button>

            {/* Buscas Recentes Tab */}
            <button
                onClick={() => onTabChange('recent')}
                className="h-[53px] w-[168px] rounded-[15px] flex items-center justify-center transition-all font-roboto-condensed font-semibold text-[15px]"
                style={{
                    background: activeTab === 'recent' ? 'var(--color-primary)' : 'transparent',
                    color: activeTab === 'recent' ? '#1E293B' : 'var(--text-primary)',
                    boxShadow: activeTab === 'recent' ? '2px 3px 4px 0px rgba(0, 0, 0, 0.25)' : 'none',
                }}
            >
                Buscas recentes
            </button>
        </div>
    )
}
