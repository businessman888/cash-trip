'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export type Period = 'mensal' | 'trimestral' | 'anual'

export interface Trip {
  id: string
  destination: string
  start_date: string
  end_date: string
  total_cost: number
  created_at: string
}

export interface Expense {
  id: string
  trip_id: string
  category: 'Transporte' | 'Hospedagem' | 'Alimentação' | 'Lazer'
  amount: number
  description: string | null
  date: string
}

export interface DashboardMetrics {
  totalSpent: number
  averagePerTrip: number
  tripsCount: number
  mostExpensiveTrip: Trip | null
  totalSpentChange: number
  averagePerTripChange: number
  tripsCountChange: number
}

export interface MonthlyExpense {
  month: string
  amount: number
}

export interface CategoryExpense {
  category: 'Transporte' | 'Hospedagem' | 'Alimentação' | 'Lazer'
  amount: number
  percentage: number
}

export function useDashboardData(period: Period = 'trimestral') {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [monthlyExpenses, setMonthlyExpenses] = useState<MonthlyExpense[]>([])
  const [categoryExpenses, setCategoryExpenses] = useState<CategoryExpense[]>([])
  const [recentTrips, setRecentTrips] = useState<Trip[]>([])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const supabase = createClient()

      try {
        // Calcular datas baseado no período
        const now = new Date()
        let startDate: Date
        let previousStartDate: Date

        switch (period) {
          case 'mensal':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1)
            previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
            break
          case 'trimestral':
            const quarter = Math.floor(now.getMonth() / 3)
            startDate = new Date(now.getFullYear(), quarter * 3, 1)
            previousStartDate = new Date(now.getFullYear(), (quarter - 1) * 3, 1)
            break
          case 'anual':
            startDate = new Date(now.getFullYear(), 0, 1)
            previousStartDate = new Date(now.getFullYear() - 1, 0, 1)
            break
        }

        // Buscar viagens do período atual
        const { data: trips, error: tripsError } = await supabase
          .from('trips')
          .select('*')
          .gte('start_date', startDate.toISOString().split('T')[0])
          .lte('end_date', now.toISOString().split('T')[0])
          .order('start_date', { ascending: false })

        // Se a tabela não existir, retornar dados zerados
        if (tripsError) {
          console.warn('Tabelas de viagens ainda não criadas. Exibindo dados zerados.')
          setMetrics({
            totalSpent: 0,
            averagePerTrip: 0,
            tripsCount: 0,
            mostExpensiveTrip: null,
            totalSpentChange: 0,
            averagePerTripChange: 0,
            tripsCountChange: 0,
          })
          setMonthlyExpenses([])
          setCategoryExpenses([])
          setRecentTrips([])
          setLoading(false)
          return
        }

        // Buscar viagens do período anterior para calcular variação
        const { data: previousTrips } = await supabase
          .from('trips')
          .select('*')
          .gte('start_date', previousStartDate.toISOString().split('T')[0])
          .lt('start_date', startDate.toISOString().split('T')[0])

        // Calcular métricas
        const totalSpent = trips?.reduce((sum, trip) => sum + Number(trip.total_cost), 0) || 0
        const previousTotalSpent = previousTrips?.reduce((sum, trip) => sum + Number(trip.total_cost), 0) || 0
        const tripsCount = trips?.length || 0
        const previousTripsCount = previousTrips?.length || 0
        const averagePerTrip = tripsCount > 0 ? totalSpent / tripsCount : 0
        const previousAveragePerTrip = previousTripsCount > 0 ? previousTotalSpent / previousTripsCount : 0

        const totalSpentChange = previousTotalSpent > 0 
          ? ((totalSpent - previousTotalSpent) / previousTotalSpent) * 100 
          : 0
        const averagePerTripChange = previousAveragePerTrip > 0
          ? ((averagePerTrip - previousAveragePerTrip) / previousAveragePerTrip) * 100
          : 0
        const tripsCountChange = previousTripsCount > 0
          ? ((tripsCount - previousTripsCount) / previousTripsCount) * 100
          : 0

        // Encontrar viagem mais cara
        const mostExpensiveTrip = trips && trips.length > 0
          ? trips.reduce((max, trip) => 
              Number(trip.total_cost) > Number(max.total_cost) ? trip : max
            )
          : null

        setMetrics({
          totalSpent,
          averagePerTrip,
          tripsCount,
          mostExpensiveTrip: mostExpensiveTrip as Trip | null,
          totalSpentChange,
          averagePerTripChange,
          tripsCountChange,
        })

        // Buscar despesas para gráficos
        const tripIds = trips?.map(t => t.id) || []
        if (tripIds.length > 0) {
          const { data: expenses, error: expensesError } = await supabase
            .from('expenses')
            .select('*')
            .in('trip_id', tripIds)

          // Se a tabela de despesas não existir, continuar sem dados de gráfico
          if (expensesError) {
            console.warn('Tabela de despesas ainda não criada.')
            setMonthlyExpenses([])
            setCategoryExpenses([])
          } else {

          // Agrupar por mês
          const monthlyMap = new Map<string, number>()
          expenses?.forEach(expense => {
            const month = new Date(expense.date).toLocaleDateString('pt-BR', { month: 'short' })
            monthlyMap.set(month, (monthlyMap.get(month) || 0) + Number(expense.amount))
          })

          const monthly = Array.from(monthlyMap.entries())
            .map(([month, amount]) => ({ month, amount }))
            .sort((a, b) => {
              const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
              return months.indexOf(a.month) - months.indexOf(b.month)
            })

          setMonthlyExpenses(monthly)

          // Agrupar por categoria
          const categoryMap = new Map<string, number>()
          expenses?.forEach(expense => {
            const current = categoryMap.get(expense.category) || 0
            categoryMap.set(expense.category, current + Number(expense.amount))
          })

          const totalByCategory = Array.from(categoryMap.values()).reduce((sum, val) => sum + val, 0)
          const categories = Array.from(categoryMap.entries()).map(([category, amount]) => ({
            category: category as CategoryExpense['category'],
            amount,
            percentage: totalByCategory > 0 ? (amount / totalByCategory) * 100 : 0,
          }))

          setCategoryExpenses(categories)
          }
        } else {
          // Sem viagens, arrays vazios
          setMonthlyExpenses([])
          setCategoryExpenses([])
        }

        // Buscar viagens recentes (últimas 2)
        const { data: recent } = await supabase
          .from('trips')
          .select('*')
          .order('start_date', { ascending: false })
          .limit(2)

        setRecentTrips((recent as Trip[]) || [])
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [period])

  return {
    loading,
    metrics,
    monthlyExpenses,
    categoryExpenses,
    recentTrips,
  }
}


