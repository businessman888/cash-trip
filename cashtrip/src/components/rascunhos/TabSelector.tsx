'use client'

interface TabSelectorProps {
    activeTab: 'saved' | 'pending'
    onTabChange: (tab: 'saved' | 'pending') => void
}

export function TabSelector({ activeTab, onTabChange }: TabSelectorProps) {
    return (
        <div
            className="flex gap-[10px] items-center justify-center p-1 rounded-[20px]"
            style={{ background: 'var(--surface-card)' }}
        >
            {/* Locais Salvos Tab */}
            <button
                onClick={() => onTabChange('saved')}
                className="h-[53px] w-[168px] rounded-[15px] flex items-center justify-center transition-all font-roboto-condensed font-semibold text-[15px]"
                style={{
                    background: activeTab === 'saved' ? 'var(--color-primary)' : 'transparent',
                    color: activeTab === 'saved' ? '#1E293B' : 'var(--text-primary)',
                    boxShadow: activeTab === 'saved' ? '2px 3px 4px 0px rgba(0, 0, 0, 0.25)' : 'none',
                }}
            >
                Locais Salvos
            </button>

            {/* Roteiros pendentes Tab */}
            <button
                onClick={() => onTabChange('pending')}
                className="h-[53px] w-[168px] rounded-[15px] flex items-center justify-center transition-all font-roboto-condensed font-semibold text-[15px]"
                style={{
                    background: activeTab === 'pending' ? 'var(--color-primary)' : 'transparent',
                    color: activeTab === 'pending' ? '#1E293B' : 'var(--text-primary)',
                    boxShadow: activeTab === 'pending' ? '2px 3px 4px 0px rgba(0, 0, 0, 0.25)' : 'none',
                }}
            >
                Roteiros pendentes
            </button>
        </div>
    )
}
