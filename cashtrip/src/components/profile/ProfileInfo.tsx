'use client'

import Image from 'next/image'
import { FiEdit2, FiCompass } from 'react-icons/fi'

export function ProfileInfo() {
    return (
        <div className="bg-[var(--surface-card)] rounded-[20px] p-6 flex flex-col items-center shadow-sm border border-[var(--border-line)] dark:border-transparent mb-8">
            <div className="relative mb-4">
                <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-4 border-white dark:border-[#1E293B] shadow-md">
                    <Image
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop"
                        alt="Profile Picture"
                        width={100}
                        height={100}
                        className="object-cover w-full h-full"
                    />
                </div>
                <button className="absolute bottom-0 right-0 w-[32px] h-[32px] bg-[#FF5F38] rounded-full flex items-center justify-center border-[3px] border-white dark:border-[#1E293B] shadow-sm">
                    <FiEdit2 className="text-white text-[14px]" />
                </button>
            </div>

            <h2 className="font-inria-sans font-bold text-[18px] text-[var(--text-primary)] mb-2">
                Alexandre Costa
            </h2>

            <div className="bg-[#FF5F38]/20 text-[#FF5F38] px-4 py-1.5 rounded-full flex items-center gap-2">
                <span className="font-inria-sans font-bold text-[14px]">Aventureiro</span>
                <FiCompass className="text-[14px]" />
            </div>
        </div>
    )
}
