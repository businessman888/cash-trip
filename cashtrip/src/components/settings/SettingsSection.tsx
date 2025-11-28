import { ReactNode } from 'react'

interface SettingsSectionProps {
    title?: string
    children: ReactNode
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
    return (
        <div className="mb-6">
            {title && (
                <h2 className="font-inria-sans font-bold text-[16px] text-[#64748B] dark:text-[#94A3B8] mb-3 px-1">
                    {title}
                </h2>
            )}
            <div className="bg-[var(--surface-card)] rounded-[20px] overflow-hidden border border-[var(--border-line)] dark:border-transparent shadow-sm">
                {children}
            </div>
        </div>
    )
}
