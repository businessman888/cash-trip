'use client'

interface ItineraryTabsProps {
    activeTab: 'roteiro' | 'chat'
    onTabChange: (tab: 'roteiro' | 'chat') => void
}

export function ItineraryTabs({ activeTab, onTabChange }: ItineraryTabsProps) {
    return (
        <div className="bg-[var(--surface-card)] rounded-[12px] p-1 flex mb-6 border border-[var(--border-line)]">
            <button
                onClick={() => onTabChange('roteiro')}
                className={`flex-1 h-[36px] rounded-[8px] font-inria-sans font-bold text-[14px] transition-all ${activeTab === 'roteiro'
                        ? 'bg-white dark:bg-[#1E293B] text-[#FF5F38] shadow-sm'
                        : 'text-[#94A3B8] hover:text-[var(--text-primary)]'
                    }`}
            >
                Roteiro
            </button>
            <button
                onClick={() => onTabChange('chat')}
                className={`flex-1 h-[36px] rounded-[8px] font-inria-sans font-bold text-[14px] transition-all ${activeTab === 'chat'
                        ? 'bg-white dark:bg-[#1E293B] text-[#FF5F38] shadow-sm'
                        : 'text-[#94A3B8] hover:text-[var(--text-primary)]'
                    }`}
            >
                Chat
            </button>
        </div>
    )
}
