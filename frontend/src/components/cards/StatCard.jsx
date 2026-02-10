import { motion } from 'framer-motion'
import { formatNumber, formatPercent, formatCurrency } from '../../utils/formatters'

const formatValue = (value, type) => {
  if (type === 'currency') return formatCurrency(value)
  if (type === 'percent') return formatPercent(value)
  return formatNumber(value)
}

const StatCard = ({ title, value, change, icon: Icon, color = 'brand', valueType = 'number', onClick }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="glass-card p-4 border border-white/10 text-white cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-white/70">{title}</p>
        <p className="text-2xl font-semibold mt-1">{formatValue(value, valueType)}</p>
      </div>
      {Icon && (
        <div className="w-10 h-10 rounded-xl bg-white/10 grid place-items-center">
          <Icon className={`text-${color}-500`} />
        </div>
      )}
    </div>
    <p className={`text-xs mt-3 ${change >= 0 ? 'text-success' : 'text-danger'}`}>
      {change >= 0 ? '▲' : '▼'} {Math.abs(change)}%
    </p>
  </motion.div>
)

export default StatCard
