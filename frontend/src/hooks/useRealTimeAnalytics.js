import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useWebSocket } from './useWebSocket'

const defaultStats = {
  totalTransactions: 1523,
  fraudBlocked: 87,
  amountSaved: 4230000,
  successRate: 94.3,
}

export const useRealTimeAnalytics = () => {
  const [stats, setStats] = useState(defaultStats)
  const [trend, setTrend] = useState([])
  const queryClient = useQueryClient()

  const { connected } = useWebSocket('analytics:update', (payload) => {
    if (payload?.metrics) setStats(payload.metrics)
    if (payload?.trend) setTrend(payload.trend)
    if (payload?.transactions) queryClient.setQueryData(['transactions'], payload.transactions)
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setStats((prev) => ({ ...prev, totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 5) }))
    }, 30000)
    return () => clearInterval(timer)
  }, [])

  return { stats, trend, connected }
}
