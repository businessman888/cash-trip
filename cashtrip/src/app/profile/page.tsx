'use client'

import { useEffect, useState } from 'react'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileInfo } from '@/components/profile/ProfileInfo'
import { PastTripCard } from '@/components/profile/PastTripCard'
import { ExpenseSummaryCard } from '@/components/profile/ExpenseSummaryCard'
import { SettingsList } from '@/components/profile/SettingsList'
import { BottomNav } from '@/components/dashboard/BottomNav'
import { getRandomPhoto } from '@/services/unsplash'

export default function ProfilePage() {
    const [tokyoImage, setTokyoImage] = useState<string>('')

    useEffect(() => {
        const fetchImage = async () => {
            const photo = await getRandomPhoto('Tokyo Japan Tower')
            if (photo) {
                setTokyoImage(photo.url)
            }
        }

        fetchImage()
    }, [])

    return (
        <div className="min-h-screen bg-[var(--surface-main)] pb-24">
            <div className="p-6">
                <ProfileHeader />
                <ProfileInfo />

                <section className="mb-8">
                    <h2 className="font-inria-sans font-bold text-[18px] text-[#64748B] dark:text-[#94A3B8] mb-4">
                        Viagens realizadas
                    </h2>
                    <PastTripCard
                        destination="Tóquio"
                        country="Japão"
                        date="Outubro 2024"
                        imageUrl={tokyoImage || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1000&auto=format&fit=crop'}
                    />
                </section>

                <ExpenseSummaryCard />
                <SettingsList />
            </div>
            <BottomNav />
        </div>
    )
}
