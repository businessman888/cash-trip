'use client'

import Image from 'next/image'

interface PastTripCardProps {
    destination: string
    country: string
    date: string
    imageUrl: string
}

export function PastTripCard({ destination, country, date, imageUrl }: PastTripCardProps) {
    return (
        <div className="relative w-full h-[200px] rounded-[20px] overflow-hidden mb-8 shadow-md">
            <Image
                src={imageUrl}
                alt={`${destination}, ${country}`}
                fill
                className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FF5F38]/90 to-transparent flex flex-col justify-end p-6">
                <h3 className="font-inria-sans font-bold text-[24px] text-white leading-tight">
                    {destination}, {country}
                </h3>
                <p className="font-inria-sans text-[14px] text-white/90">
                    {date}
                </p>
            </div>
        </div>
    )
}
