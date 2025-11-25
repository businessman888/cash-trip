'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaChevronLeft, FaListUl, FaCloudShowersHeavy } from 'react-icons/fa'
import { BsThreeDots } from 'react-icons/bs'
import { PiWarningCircleBold } from 'react-icons/pi'

interface Notification {
    id: string
    type: 'warning' | 'checklist' | 'weather'
    title: string
    time: string
    message: string
    isNew?: boolean
    dateGroup: 'Hoje' | 'Ontem'
}

const notifications: Notification[] = [
    {
        id: '1',
        type: 'warning',
        title: 'Atualização importante sobre impostos de turismo',
        time: 'Agora',
        message: 'Houve uma mudança na taxa para turistas em Lisboa.',
        isNew: true,
        dateGroup: 'Hoje'
    },
    {
        id: '2',
        type: 'checklist',
        title: 'Faltam 3 itens no seu checklist de pré-viagem',
        time: 'Há 2 horas',
        message: 'Não se esqueça de confirmar a reserva do hotel.',
        isNew: true,
        dateGroup: 'Hoje'
    },
    {
        id: '3',
        type: 'weather',
        title: 'Alerta de chuva para amanhã em Paris',
        time: 'Há 5 horas',
        message: 'A previsão indica 80% de chance de chuva. Prepare-se!',
        isNew: false,
        dateGroup: 'Hoje'
    },
    {
        id: '4',
        type: 'weather',
        title: 'O seu FR456 teve o portão alterado',
        time: 'Ontem',
        message: 'O novo portão de embarque é o B22.',
        isNew: false,
        dateGroup: 'Ontem'
    }
]

export default function NotificationsPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('Todas')

    const tabs = ['Todas', 'Tarefas', 'Clima', 'Todas']

    const todayNotifications = notifications.filter(n => n.dateGroup === 'Hoje')
    const yesterdayNotifications = notifications.filter(n => n.dateGroup === 'Ontem')

    const getIcon = (type: string) => {
        switch (type) {
            case 'warning':
                return <PiWarningCircleBold size={24} style={{ color: 'var(--color-primary)' }} />
            case 'checklist':
                return <FaListUl size={20} style={{ color: 'var(--color-primary)' }} />
            case 'weather':
                return <FaCloudShowersHeavy size={20} style={{ color: 'var(--color-primary)' }} />
            default:
                return null
        }
    }

    const renderNotificationItem = (notification: Notification) => (
        <div key={notification.id} className="flex gap-4">
            {/* Icon */}
            <div className="shrink-0">
                <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                        border: '1px solid var(--color-primary)',
                        background: 'rgba(255, 95, 56, 0.1)'
                    }}
                >
                    {getIcon(notification.type)}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3
                        className="font-bold text-[14px] leading-tight max-w-[80%]"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        {notification.title}
                    </h3>
                    <div className="flex flex-col items-end gap-1">
                        <span
                            className="text-[10px] font-bold"
                            style={{ color: notification.isNew ? 'var(--color-primary)' : 'var(--text-secondary)' }}
                        >
                            {notification.time}
                        </span>
                        {notification.isNew && (
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ background: 'var(--color-primary)' }}
                            />
                        )}
                    </div>
                </div>
                <p
                    className="text-[14px] leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                >
                    {notification.message}
                </p>
            </div>
        </div>
    )

    return (
        <div
            className="min-h-screen font-inria-sans pb-24"
            style={{ background: 'var(--surface-main)' }}
        >
            {/* Header */}
            <div className="pt-6 pb-4">
                <div className="flex items-center justify-between max-w-md mx-auto px-4 mb-6">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center rounded-full transition-opacity hover:opacity-80"
                    >
                        <FaChevronLeft size={24} style={{ color: 'var(--text-primary)' }} />
                    </button>

                    <h1
                        className="font-bold text-[20px]"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Notificações
                    </h1>

                    <button
                        className="w-10 h-10 flex items-center justify-center rounded-full transition-opacity hover:opacity-80"
                        style={{ border: '1px solid var(--text-primary)' }}
                    >
                        <BsThreeDots size={20} style={{ color: 'var(--text-primary)' }} />
                    </button>
                </div>

                {/* Divider Line */}
                <div
                    className="h-[1px] mx-[10px] mb-6"
                    style={{ background: 'var(--border-line)' }}
                />

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-3 max-w-md mx-auto px-4 mb-8">
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveTab(tab)}
                            className="px-6 py-2 rounded-[20px] border transition-colors font-bold text-sm"
                            style={{
                                background: activeTab === tab && index === 0
                                    ? 'var(--color-primary)'
                                    : 'transparent',
                                color: activeTab === tab && index === 0
                                    ? '#FFFFFF'
                                    : 'var(--text-primary)',
                                borderColor: activeTab === tab && index === 0
                                    ? 'var(--color-primary)'
                                    : 'var(--text-primary)'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Notifications List */}
                <div className="max-w-md mx-auto px-4 space-y-8">
                    {/* Hoje Section */}
                    {todayNotifications.length > 0 && (
                        <div>
                            <h2
                                className="text-[20px] font-bold mb-6"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                Hoje
                            </h2>
                            <div className="space-y-8">
                                {todayNotifications.map(renderNotificationItem)}
                            </div>
                        </div>
                    )}

                    {/* Ontem Section */}
                    {yesterdayNotifications.length > 0 && (
                        <div>
                            <h2
                                className="text-[20px] font-bold mb-6"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                Ontem
                            </h2>
                            <div className="space-y-8">
                                {yesterdayNotifications.map(renderNotificationItem)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
