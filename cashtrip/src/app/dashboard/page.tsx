'use client'

import { useState } from 'react'
import { useDashboardData, Period } from '@/hooks/useDashboardData'
import { PeriodSelector } from '@/components/dashboard/PeriodSelector'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { ExpenseChart } from '@/components/dashboard/ExpenseChart'
import { CategoryChart } from '@/components/dashboard/CategoryChart'
import { RecentTripCard } from '@/components/dashboard/RecentTripCard'

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>('trimestral')
  const { loading, metrics, monthlyExpenses, categoryExpenses, recentTrips } = useDashboardData(period)

  // Autenticação desabilitada para desenvolvimento
  // useEffect(() => {
  //   async function checkAuth() {
  //     const supabase = createClient()
  //     const { data: { user } } = await supabase.auth.getUser()
  //     
  //     if (!user) {
  //       router.push('/login')
  //     }
  //   }
  //   
  //   checkAuth()
  // }, [router])

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center">
        <div className="text-[#64748B] font-inria-sans">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9] pb-20">
      {/* Header */}
      <div className="bg-white rounded-[60px] shadow-[1px_1px_4px_0px_rgba(0,0,0,0.25)] mb-4">
        <div className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center px-14 py-[18px]">
              <h1 className="font-inria-sans font-bold text-[24px] leading-[1.199] text-[#64748B]">
                Dashboard Financeiro
              </h1>
            </div>
            <div className="flex justify-center">
              <PeriodSelector selected={period} onChange={setPeriod} />
            </div>
          </div>
        </div>
      </div>

      {/* Área principal */}
      <div className="px-4 space-y-[10px]">
        {/* Aviso quando não há dados */}
        {metrics && metrics.tripsCount === 0 && (
          <div className="bg-[#FEF3C7] border border-[#F59E0B] rounded-[10px] p-4 mb-4">
            <p className="font-inria-sans text-[#92400E] text-center">
              📊 Você ainda não possui viagens cadastradas. Comece planejando sua primeira viagem!
            </p>
          </div>
        )}

        {/* Cards de métricas */}
        <div className="flex flex-col gap-[10px] p-[14px]">
          <div className="grid grid-cols-1 gap-[10px]">
            {metrics && (
              <>
                <MetricCard
                  title="Gasto total"
                  value={formatCurrency(metrics.totalSpent)}
                  change={metrics.totalSpentChange}
                />
                <MetricCard
                  title="Média por viagem"
                  value={formatCurrency(metrics.averagePerTrip)}
                  change={metrics.averagePerTripChange}
                />
                <MetricCard
                  title="Viagens realizadas"
                  value={`${metrics.tripsCount} viagens`}
                  change={metrics.tripsCountChange}
                />
              </>
            )}
          </div>

          {/* Card viagem mais cara */}
          {metrics?.mostExpensiveTrip && (
            <div className="bg-[#F8F9FA] rounded-[10px] p-4">
              <div className="mb-3">
                <h3 className="font-inria-sans font-bold text-[20px] leading-[1.199] text-[#64748B]">
                  Viagem mais cara
                </h3>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-inria-sans font-bold text-[20px] leading-[1.199] text-[#FF896F]">
                  {metrics.mostExpensiveTrip.destination}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-inria-sans font-bold text-[24px] leading-[1.199] text-[#1E293B]">
                    {formatCurrency(Number(metrics.mostExpensiveTrip.total_cost))}
                  </span>
                  <span className="font-inria-sans font-bold text-[15px] leading-[1.199] text-[#E33629]">
                    -2%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detalhamento financeiro */}
        <div className="border border-[#D9D9D9] rounded-[10px] p-6 space-y-6">
          <h2 className="font-inria-sans font-bold text-[24px] leading-[1.199] text-[#64748B]">
            Detalhamento financeiro
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExpenseChart data={monthlyExpenses} />
            <CategoryChart data={categoryExpenses} />
          </div>
        </div>

        {/* Viagens recentes */}
        <div className="flex flex-col gap-[5px] py-[15px]">
          <div className="flex items-center gap-[10px] px-[22px] py-[19px]">
            <h2 className="font-inria-sans font-bold text-[24px] leading-[1.199] text-[#1E293B]">
              Viagens recentes
            </h2>
          </div>
          <div className="flex flex-col gap-6 px-0 py-[25px]">
            {recentTrips.length > 0 ? (
              recentTrips.map((trip) => (
                <RecentTripCard key={trip.id} trip={trip} />
              ))
            ) : (
              <div className="text-center text-[#64748B] py-8 font-inria-sans">
                Nenhuma viagem recente encontrada
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

