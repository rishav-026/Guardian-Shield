import { useQuery } from '@tanstack/react-query'
import { fetchMerchantIntel } from '../utils/api'

export const useMerchantData = (query) => {
  const enabled = Boolean(query?.search || query?.category)
  return useQuery({
    queryKey: ['merchant-intel', query],
    queryFn: () => fetchMerchantIntel(query),
    enabled,
    staleTime: 60000,
  })
}
