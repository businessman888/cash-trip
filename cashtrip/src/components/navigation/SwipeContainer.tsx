'use client'

import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { ReactNode, useState, useEffect } from 'react'

interface SwipeContainerProps {
    children: ReactNode
}

const ROUTES = ['/dashboard', '/trips', '/explore', '/profile']

export function SwipeContainer({ children }: SwipeContainerProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [direction, setDirection] = useState<'left' | 'right'>('right')
    const [prevPathname, setPrevPathname] = useState(pathname)

    const currentIndex = ROUTES.indexOf(pathname)

    // Detectar direção baseado na mudança de rota
    useEffect(() => {
        if (pathname !== prevPathname) {
            const newIndex = ROUTES.indexOf(pathname)
            const oldIndex = ROUTES.indexOf(prevPathname)

            if (newIndex > oldIndex) {
                setDirection('right')
            } else if (newIndex < oldIndex) {
                setDirection('left')
            }

            setPrevPathname(pathname)
        }
    }, [pathname, prevPathname])

    const handleDragEnd = (event: any, info: PanInfo) => {
        const threshold = 75
        const offset = info.offset.x
        const velocity = Math.abs(info.velocity.x)

        if (Math.abs(offset) > threshold || velocity > 400) {
            if (offset > 0 && currentIndex > 0) {
                setDirection('left')
                router.push(ROUTES[currentIndex - 1])
            } else if (offset < 0 && currentIndex < ROUTES.length - 1) {
                setDirection('right')
                router.push(ROUTES[currentIndex + 1])
            }
        }
    }

    const slideVariants = {
        enter: (direction: string) => ({
            x: direction === 'right' ? '100%' : '-100%',
            position: 'absolute' as const,
            width: '100%',
            top: 0,
            left: 0
        }),
        center: {
            x: 0,
            position: 'relative' as const,
            width: '100%'
        },
        exit: (direction: string) => ({
            x: direction === 'right' ? '-100%' : '100%',
            position: 'absolute' as const,
            width: '100%',
            top: 0,
            left: 0
        })
    }

    return (
        <div className="relative w-full h-full overflow-hidden" style={{ backgroundColor: 'var(--surface-main)' }}>
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                    key={pathname}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        type: 'tween',
                        ease: [0.4, 0, 0.2, 1],
                        duration: 0.3
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.15}
                    dragMomentum={false}
                    onDragEnd={handleDragEnd}
                    className="w-full h-full"
                    style={{
                        zIndex: 10,
                        willChange: 'transform'
                    }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
