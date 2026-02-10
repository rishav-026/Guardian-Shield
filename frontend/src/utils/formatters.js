import { format, parseISO } from 'date-fns'

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0)

export const formatNumber = (value) => new Intl.NumberFormat('en-IN').format(value || 0)

export const formatPercent = (value) => `${(value || 0).toFixed(1)}%`

export const formatDateTime = (iso) => {
  try {
    return format(typeof iso === 'string' ? parseISO(iso) : iso, 'dd MMM, hh:mma')
  } catch (e) {
    return iso
  }
}

export const riskLabel = (score) => {
  if (score >= 75) return 'High'
  if (score >= 40) return 'Caution'
  return 'Safe'
}
