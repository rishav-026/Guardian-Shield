import { motion } from 'framer-motion'
import { FiAlertTriangle } from 'react-icons/fi'

const AlertCard = ({ title, subtitle, metric }) => (
  <motion.div whileHover={{ y: -2 }} className="glass-card p-4 border border-white/10 text-white">
    <div className="flex items-center gap-2">
      <FiAlertTriangle className="text-danger" />
      <p className="font-semibold">{title}</p>
    </div>
    <p className="text-sm text-white/70 mt-1">{subtitle}</p>
    {metric && <p className="text-2xl font-semibold mt-3">{metric}</p>}
  </motion.div>
)

export default AlertCard
