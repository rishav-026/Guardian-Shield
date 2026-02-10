import { motion } from 'framer-motion'
import { FiShield, FiDownloadCloud, FiZap, FiFlag } from 'react-icons/fi'
import { exportCSV, exportPDF } from '../../utils/export'

const actions = [
  { label: 'Export CSV', icon: FiDownloadCloud, onClick: () => exportCSV([{ status: 'sample' }], 'dashboard.csv') },
  { label: 'Export PDF', icon: FiShield, onClick: () => exportPDF('Guardian Dashboard', [{ status: 'sample' }]) },
  { label: 'Refresh Now', icon: FiZap, onClick: () => window.location.reload() },
  { label: 'Report Fraud', icon: FiFlag, onClick: () => alert('Fraud report dialog coming soon') },
]

const QuickActions = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    {actions.map((action) => (
      <motion.button
        key={action.label}
        whileHover={{ y: -2 }}
        className="flex items-center gap-2 px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
        onClick={action.onClick}
      >
        <action.icon className="text-brand-500" />
        <span className="text-sm font-semibold">{action.label}</span>
      </motion.button>
    ))}
  </div>
)

export default QuickActions
