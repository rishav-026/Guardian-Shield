import { formatCurrency, formatDateTime } from '../../utils/formatters'

const badgeStyles = {
  SAFE: 'bg-success/20 text-success border border-success/30',
  BLOCKED: 'bg-danger/20 text-danger border border-danger/30',
  CHALLENGE: 'bg-warning/20 text-warning border border-warning/30',
}

const TransactionCard = ({ tx, onClick }) => (
  <button
    className="w-full text-left bg-white/5 border border-white/10 rounded-xl p-4 hover:border-brand-500/50 transition"
    onClick={() => onClick?.(tx)}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="font-semibold text-white">{tx.merchant}</p>
        <p className="text-xs text-white/60">{formatDateTime(tx.time)}</p>
      </div>
      <p className="font-mono text-lg text-white">{formatCurrency(tx.amount)}</p>
    </div>
    <div className="flex items-center justify-between mt-3 text-sm">
      <span className={`px-3 py-1 rounded-full ${badgeStyles[tx.decision] || 'bg-white/10 text-white/80'}`}>
        {tx.decision}
      </span>
      <span className="text-white/70">Risk {tx.risk_score}</span>
    </div>
  </button>
)

export default TransactionCard
