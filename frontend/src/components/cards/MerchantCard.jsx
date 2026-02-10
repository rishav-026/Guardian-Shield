import { FiFlag, FiCheck, FiShield } from 'react-icons/fi'
import { formatPercent, formatNumber } from '../../utils/formatters'

const MerchantCard = ({ merchant }) => (
  <div className="glass-card p-4 border border-white/10 text-white space-y-2">
    <div className="flex items-center justify-between">
      <div>
        <p className="font-semibold text-white">{merchant.name}</p>
        <p className="text-xs text-white/60">{merchant.category}</p>
      </div>
      <span className="px-3 py-1 rounded-full bg-white/10 text-sm">Risk {merchant.risk}</span>
    </div>
    <div className="grid grid-cols-2 gap-3 text-sm text-white/80">
      <div>
        <p className="text-white/60 text-xs">Fraud rate</p>
        <p className="font-semibold">{formatPercent(merchant.fraud_rate)}</p>
      </div>
      <div>
        <p className="text-white/60 text-xs">Transactions</p>
        <p className="font-semibold">{formatNumber(merchant.tx_count)}</p>
      </div>
      <div>
        <p className="text-white/60 text-xs">Reports</p>
        <p className="font-semibold">{merchant.reports}</p>
      </div>
      <div className="flex items-center gap-2">
        <FiShield className={`text-${merchant.blacklisted ? 'danger' : 'success'}`} />
        <span className="text-xs">{merchant.blacklisted ? 'Blacklisted' : 'Trusted'}</span>
      </div>
    </div>
    <div className="flex items-center gap-2 text-xs text-white/70">
      <FiFlag /> Similar: {merchant.similar?.join(', ') || '—'}
    </div>
    <button className="w-full mt-2 py-2 rounded-lg bg-white/10 text-sm hover:bg-white/15 transition flex items-center justify-center gap-2">
      <FiCheck /> Whitelist / Report
    </button>
  </div>
)

export default MerchantCard
