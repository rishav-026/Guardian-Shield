import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { fetchTransactions } from '../utils/api'
import { useWebSocket } from './useWebSocket'

export const useTransactions = (filters = {}) => {
  const query = useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => fetchTransactions(filters),
    staleTime: 30000,
    keepPreviousData: true,
  })

  const { connected } = useWebSocket('transaction:new', () => {
    query.refetch()
  })

  useEffect(() => {
    query.refetch()
  }, [filters, query])

  return { ...query, socketConnected: connected }
}
