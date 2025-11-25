'use client'

import { FaSearch } from 'react-icons/fa'

interface SearchBarProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = 'Pesquisar em viagens' }: SearchBarProps) {
    return (
        <div
            className="relative h-[60px] rounded-[30px] px-5 flex items-center gap-3"
            style={{ background: 'var(--surface-card)' }}
        >
            {/* Search Icon */}
            <FaSearch size={20} style={{ color: 'var(--text-secondary)', opacity: 0.5 }} />

            {/* Input */}
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="flex-1 bg-transparent outline-none text-[15px] font-roboto-condensed placeholder:text-[var(--text-secondary)] placeholder:opacity-50"
                style={{
                    color: 'var(--text-primary)',
                }}
            />
        </div>
    )
}
