'use client'

import { SwipeContainer } from '@/components/navigation/SwipeContainer'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { BottomNav } from '@/components/dashboard/BottomNav'

interface PageWrapperProps {
    children: ReactNode
}

const SWIPEABLE_ROUTES = ['/dashboard', '/trips', '/explore', '/profile']

export function PageWrapper({ children }: PageWrapperProps) {
    const pathname = usePathname()

    // Verificar se a rota atual é swipeable ou se é uma sub-rota de profile
    // Excluir explicitamente /trips/new pois é uma página standalone
    const isSwipeable = SWIPEABLE_ROUTES.some(route => pathname.startsWith(route)) && pathname !== '/trips/new'
    const showBottomNav = SWIPEABLE_ROUTES.some(route => pathname.startsWith(route)) && pathname !== '/trips/new'

    if (isSwipeable) {
        return (
            <>
                <SwipeContainer>{children}</SwipeContainer>
                {showBottomNav && <BottomNav />}
            </>
        )
    }

    return <>{children}</>
}
