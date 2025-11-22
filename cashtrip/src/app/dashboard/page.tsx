'use client'

import { useState } from 'react'
import { PeriodSelector } from '@/components/dashboard/PeriodSelector'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { ExpenseChart } from '@/components/dashboard/ExpenseChart'
import { CategoryChart } from '@/components/dashboard/CategoryChart'
import { RecentTripCard } from '@/components/dashboard/RecentTripCard'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { BottomNav } from '@/components/dashboard/BottomNav'
import { useDashboardData, Period } from '@/hooks/useDashboardData'
import { useTheme } from '@/contexts/ThemeContext'
import { FaWallet, FaChartLine, FaPlane, FaBars, FaRegBell, FaMoon, FaChevronRight, FaChevronLeft } from 'react-icons/fa'
import Image from 'next/image'

import Link from 'next/link'

export default function DashboardPage() {
  const { theme, toggleTheme } = useTheme()
  const [period, setPeriod] = useState<Period>('trimestral')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentMetricIndex, setCurrentMetricIndex] = useState(0)
  const { loading, metrics, monthlyExpenses, categoryExpenses, recentTrips } = useDashboardData(period)

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const nextMetric = () => {
    setCurrentMetricIndex((prev) => (prev + 1) % 3)
  }

  const prevMetric = () => {
    setCurrentMetricIndex((prev) => (prev - 1 + 3) % 3)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--surface-main)' }}>
        <div className="font-inria-sans" style={{ color: 'var(--text-secondary)' }}>Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 font-inria-sans overflow-x-hidden" style={{ background: 'var(--surface-main)' }}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Header Pill */}
      <div className="px-4 pt-6 mb-6">
        <div className="rounded-[100px] px-4 py-4 flex items-center justify-between shadow-sm h-[111px] w-full max-w-[343px] mx-auto" style={{ background: 'var(--surface-header)' }}>
          <div className="flex items-center">
            <Image
              src="/logo.svg"
              alt="CashTrip Logo"
              width={106}
              height={43}
              priority
              className="w-[106px] h-[43px]"
            />
          </div>
          <div className="flex items-center gap-[15px]">
            <button onClick={toggleTheme} className="hover:opacity-80 transition-opacity">
              <Image
                src={theme === 'dark' ? "/icons/icon dark mode white.svg" : "/icons/icon dark mode.svg"}
                alt="Dark Mode"
                width={24}
                height={24}
              />
            </button>
            <Link href="/notifications" className="hover:opacity-80 transition-opacity">
              <Image
                src={theme === 'dark' ? "/icons/icon notifications white.svg" : "/icons/icon notifications.svg"}
                alt="Notifications"
                width={24}
                height={24}
              />
            </Link>
            <button onClick={() => setIsSidebarOpen(true)} className="hover:opacity-80 transition-opacity">
              <Image
                src={theme === 'dark' ? "/icons/icon menu white.svg" : "/icons/icon menu.svg"}
                alt="Menu"
                width={24}
                height={24}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Title & Period Selector */}
      <div className="flex flex-col gap-6 max-w-md mx-auto mb-6">
        <div className="flex items-center justify-center">
          <h1 className="font-bold text-[20px]" style={{ color: 'var(--text-secondary)' }}>
            Dashboard Financeiro
          </h1>
        </div>
        <div className="flex justify-center px-4">
          <div className="rounded-[20px] p-1 w-full max-w-[343px]" style={{ background: 'var(--surface-header)' }}>
            <PeriodSelector selected={period} onChange={setPeriod} />
          </div>
        </div>
      </div>

      {/* Área principal */}
      <div className="px-4 space-y-6 max-w-md mx-auto pb-24">

        {/* Carrossel de Métricas */}
        {/* Carrossel de Métricas */}
        {metrics && (
          <div className="relative w-full max-w-[343px] mx-auto">
            <button
              onClick={prevMetric}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 text-[#FF5F38] hover:bg-orange-50 rounded-full transition-colors"
            >
              <FaChevronLeft size={24} />
            </button>

            <div className="overflow-hidden rounded-[20px]">
              <div
                className="flex transition-transform duration-300 ease-in-out gap-[20px]"
                style={{ transform: `translateX(calc(-${currentMetricIndex} * (100% + 20px)))` }}
              >
                {/* Gasto Total */}
                <div className="min-w-full rounded-[20px] p-6 flex flex-col items-center justify-center text-center min-h-[180px]" style={{ background: 'var(--surface-card)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--color-border)' }}>
                  <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-secondary)' }}>Gasto total</h3>
                  <span className="font-bold text-3xl mb-2" style={{ color: 'var(--text-primary)' }}>
                    {formatCurrency(metrics.totalSpent)}
                  </span>
                  <span className="text-[#10B981] font-bold text-sm">
                    +{metrics.totalSpentChange}%
                  </span>
                </div>

                {/* Média por Viagem */}
                <div className="min-w-full rounded-[20px] p-6 flex flex-col items-center justify-center text-center min-h-[180px]" style={{ background: 'var(--surface-card)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--color-border)' }}>
                  <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-secondary)' }}>Média por Viagem</h3>
                  <span className="font-bold text-3xl mb-2" style={{ color: 'var(--text-primary)' }}>
                    {formatCurrency(metrics.averagePerTrip)}
                  </span>
                  <span className="text-[#10B981] font-bold text-sm">
                    +{metrics.averagePerTripChange}%
                  </span>
                </div>

                {/* Viagens Realizadas */}
                <div className="min-w-full rounded-[20px] p-6 flex flex-col items-center justify-center text-center min-h-[180px]" style={{ background: 'var(--surface-card)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--color-border)' }}>
                  <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-secondary)' }}>Viagens Realizadas</h3>
                  <span className="font-bold text-3xl mb-2" style={{ color: 'var(--text-primary)' }}>
                    {metrics.tripsCount}
                  </span>
                  <span className="text-[#10B981] font-bold text-sm">
                    +{metrics.tripsCountChange}%
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={nextMetric}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[#FF5F38] rounded-full flex items-center justify-center text-white shadow-md hover:bg-[#E6502C] transition-colors"
            >
              <FaChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Card viagem mais cara - Refined to match Figma layout */}
        {metrics?.mostExpensiveTrip && (
          <div className="rounded-[20px] p-6 relative overflow-hidden" style={{ background: 'var(--surface-card)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--color-border)' }}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-[16px] mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Viagem mais cara
                </h3>
                <span className="font-bold text-[20px] text-[#FF5F38]">
                  {metrics.mostExpensiveTrip.destination}
                </span>
              </div>
              <div className="bg-[#FF5F38]/10 p-2 rounded-full">
                <FaPlane className="text-[#FF5F38]" size={20} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span className="font-bold">
                  {new Date(metrics.mostExpensiveTrip.start_date).toLocaleDateString('pt-BR')}
                </span>
                <span>-</span>
                <span className="font-bold">
                  {new Date(metrics.mostExpensiveTrip.end_date).toLocaleDateString('pt-BR')}
                </span>
              </div>

              <div className="flex items-end justify-between mt-2">
                <span className="font-bold text-[24px]" style={{ color: 'var(--text-primary)' }}>
                  {formatCurrency(Number(metrics.mostExpensiveTrip.total_cost))}
                </span>
                <span className="font-bold text-[14px] text-[#E33629] bg-[#FFE4E1] px-2 py-1 rounded-md">
                  -2%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Detalhamento financeiro */}
        <div className="space-y-6">
          <h2 className="font-bold text-[18px] text-[#FF5F38] text-center">
            Detalhamento financeiro
          </h2>

          <div className="space-y-8">
            <ExpenseChart data={monthlyExpenses} />
            <CategoryChart data={categoryExpenses} />
          </div>
        </div>

        {/* Viagens recentes */}
        <div className="space-y-4">
          <h2 className="font-bold text-[18px] px-2" style={{ color: 'var(--text-primary)' }}>
            Viagens recentes
          </h2>
          <div className="flex flex-col gap-4">
            {recentTrips.length > 0 ? (
              recentTrips.map((trip) => (
                <RecentTripCard key={trip.id} trip={trip} />
              ))
            ) : (
              <div className="text-center py-8 rounded-[16px]" style={{ color: 'var(--text-secondary)', background: 'var(--surface-main)' }}>
                Nenhuma viagem recente encontrada
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
