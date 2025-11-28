import { FiChevronRight } from 'react-icons/fi'
import { IconType } from 'react-icons'

interface SettingsItemProps {
    icon: IconType
    label: string
    onClick?: () => void
    href?: string
    isLast?: boolean
    showChevron?: boolean
}

export function SettingsItem({
    icon: Icon,
    label,
    onClick,
    href,
    isLast = false,
    showChevron = true
}: SettingsItemProps) {
    const Component = href ? 'a' : 'div'

    return (
        <Component
            href={href}
            onClick={onClick}
            className={`flex items-center justify-between p-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${!isLast ? 'border-b border-[var(--border-line)] dark:border-white/10' : ''}`}
        >
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-[10px] bg-[#FF5F38]/10 flex items-center justify-center">
                    <Icon className="text-[#FF5F38] text-xl" />
                </div>
                <span className="font-inria-sans text-[16px] text-[var(--text-primary)]">
                    {label}
                </span>
            </div>

            {showChevron && (
                <FiChevronRight className="text-[#64748B] dark:text-[#94A3B8] text-xl" />
            )}
        </Component>
    )
}
