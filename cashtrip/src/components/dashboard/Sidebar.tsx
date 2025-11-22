'use client'

import { FaTimes, FaHistory, FaFileAlt, FaCog, FaQuestionCircle, FaSignOutAlt, FaClock } from 'react-icons/fa'

interface SidebarProps {
    isOpen: boolean
    onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const menuItems = [
        { icon: FaClock, label: 'Próximas Ações' },
        { icon: FaHistory, label: 'Histórico' },
        { icon: FaFileAlt, label: 'Rascunhos' },
        { icon: FaCog, label: 'Configurações' },
        { icon: FaQuestionCircle, label: 'Ajuda e docs' },
    ]

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-[280px] bg-[#E6502C] z-50 transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="p-6 flex flex-col h-full text-white font-inria-sans">
                    <div className="flex justify-end mb-8">
                        <button onClick={onClose} className="text-white hover:text-white/80">
                            <FaTimes size={24} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-6 flex-1">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                className="flex items-center gap-4 text-lg font-bold hover:bg-white/10 p-2 rounded-lg transition-colors"
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="mt-auto border-t border-white/20 pt-6">
                        <button className="flex items-center gap-4 text-lg font-bold hover:bg-white/10 p-2 rounded-lg transition-colors w-full">
                            <FaSignOutAlt size={20} />
                            <span>Sair</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
