'use client'

import { FiChevronLeft } from 'react-icons/fi'
import Link from 'next/link'
import Image from 'next/image'

interface DestinationHeaderProps {
    title: string
    imageUrl: string
}

export function DestinationHeader({ title, imageUrl }: DestinationHeaderProps) {
    return (
        <div className="flex flex-col items-center">
            <div className="relative w-full h-[280px] rounded-b-[32px] overflow-hidden shadow-md">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute top-6 left-6 z-10">
                    <Link href="/trips" className="w-[40px] h-[40px] bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#1E293B] shadow-lg hover:bg-white transition-colors">
                        <FiChevronLeft className="text-2xl" />
                    </Link>
                </div>
            </div>

            <h1 className="font-inria-sans font-bold text-[28px] text-[#1E293B] text-center mt-6">
                {title}
            </h1>
        </div>
    )
}
