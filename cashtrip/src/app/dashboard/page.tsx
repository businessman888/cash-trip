'use client'

import { useState } from 'react'
import { PeriodSelector } from '@/components/dashboard/PeriodSelector'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { ExpenseChart } from '@/components/dashboard/ExpenseChart'
import { CategoryChart } from '@/components/dashboard/CategoryChart'
import { RecentTripCard } from '@/components/dashboard/RecentTripCard'
import { Sidebar } from '@/components/dashboard/Sidebar'

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

  return (
    <div className="min-h-screen pb-24 font-inria-sans overflow-x-hidden" style={{ background: 'var(--surface-main)' }}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Header Pill */}
      <div className="px-4 pt-6 mb-6">
        <div className="rounded-[100px] px-4 py-4 flex items-center justify-between h-[111px] w-full max-w-[343px] mx-auto">
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
          <div className="flex items-center gap-[12px]">
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
        <div className="relative w-full max-w-[343px] mx-auto">
          {loading ? (
            <div
              className="w-[85%] rounded-[20px] p-6 flex items-center justify-center min-h-[160px] mx-auto"
              style={{ background: 'var(--surface-card)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--color-border)' }}
            >
              <span className="font-inria-sans" style={{ color: 'var(--text-secondary)' }}>Carregando...</span>
            </div>
          ) : metrics && (
            <>
              <div className="overflow-visible pl-4">
                <div
                  className="flex transition-transform duration-300 ease-in-out gap-4"
                  style={{ transform: `translateX(-${currentMetricIndex * 85}%)` }}
                >
                  {/* Gasto Total */}
                  <div
                    className="flex-shrink-0 w-[85%] rounded-[20px] p-6 flex flex-col justify-center min-h-[185px]"
                    style={{ background: 'var(--surface-card)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--color-border)' }}
                  >
                    <h3 className="font-bold text-[14px] mb-3" style={{ color: 'var(--text-secondary)' }}>
                      Gasto total
                    </h3>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-[28px]" style={{ color: 'var(--text-primary)' }}>
                        {formatCurrency(metrics.totalSpent)}
                      </span>
                      <span className="text-[#10B981] font-bold text-[12px]">
                        +{metrics.totalSpentChange}%
                      </span>
                    </div>
                  </div>

                  {/* Média por Viagem */}
                  <div
                    className="flex-shrink-0 w-[85%] rounded-[20px] p-6 flex flex-col justify-center min-h-[185px]"
                    style={{ background: 'var(--surface-card)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--color-border)' }}
                  >
                    <h3 className="font-bold text-[14px] mb-3" style={{ color: 'var(--text-secondary)' }}>
                      Média por viagem
                    </h3>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-[28px]" style={{ color: 'var(--text-primary)' }}>
                        {formatCurrency(metrics.averagePerTrip)}
                      </span>
                      <span className="text-[#10B981] font-bold text-[12px]">
                        +{metrics.averagePerTripChange}%
                      </span>
                    </div>
                  </div>

                  {/* Viagens Realizadas */}
                  <div
                    className="flex-shrink-0 w-[85%] rounded-[20px] p-6 flex flex-col justify-center min-h-[185px]"
                    style={{ background: 'var(--surface-card)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--color-border)' }}
                  >
                    <h3 className="font-bold text-[14px] mb-3" style={{ color: 'var(--text-secondary)' }}>
                      Viagens realizadas
                    </h3>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-[28px]" style={{ color: 'var(--text-primary)' }}>
                        {metrics.tripsCount} viagens
                      </span>
                      <span className="text-[#10B981] font-bold text-[12px]">
                        +{metrics.tripsCountChange}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botão Anterior - Aparece apenas se não estiver no primeiro card */}
              {currentMetricIndex > 0 && (
                <button
                  onClick={prevMetric}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[#FF5F38] rounded-full flex items-center justify-center text-white shadow-md hover:bg-[#E6502C] transition-all"
                >
                  <FaChevronLeft size={16} />
                </button>
              )}

              {/* Botão Próximo - Aparece apenas se não estiver no último card */}
              {currentMetricIndex < 2 && (
                <button
                  onClick={nextMetric}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[#FF5F38] rounded-full flex items-center justify-center text-white shadow-md hover:bg-[#E6502C] transition-all"
                >
                  <FaChevronRight size={16} />
                </button>
              )}
            </>
          )}
        </div>

        {/* Card viagem mais cara - Simplified to match Figma layout */}
        {metrics?.mostExpensiveTrip && (
          <div className="rounded-[20px] p-5 relative overflow-hidden" style={{ background: 'var(--surface-card)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--color-border)' }}>
            <h3 className="font-bold text-[14px] mb-2" style={{ color: 'var(--text-secondary)' }}>
              Viagem mais cara
            </h3>
            <span className="font-bold text-[18px] text-[#FF5F38] block mb-3">
              {metrics.mostExpensiveTrip.destination}
            </span>
            <div className="flex items-end justify-between">
              <span className="font-bold text-[20px]" style={{ color: 'var(--text-primary)' }}>
                {formatCurrency(Number(metrics.mostExpensiveTrip.total_cost))}
              </span>
              <span className="font-bold text-[14px] text-[#E33629] bg-[#FFE4E1] px-2 py-1 rounded-md">
                -2%
              </span>
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


    </div>
  )
}
