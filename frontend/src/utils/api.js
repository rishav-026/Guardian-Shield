import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error', error?.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const predictFraud = async (transactionData) => {
  const { data } = await api.post('/api/predict', transactionData)
  return data
}

export const getTransactions = async (userId, limit = 10) => {
  const { data } = await api.get(`/api/transactions/${userId}?limit=${limit}`)
  return data
}

export const fetchTransactions = async (filters = {}) => {
  const { data } = await api.post('/api/transactions/filter', filters)
  return data
}

export const fetchMerchantIntel = async (query = {}) => {
  const { data } = await api.get('/api/merchant/intel', { params: query })
  return data
}
