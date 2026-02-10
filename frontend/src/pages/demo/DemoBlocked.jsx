import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import RiskScoreBar from '../../components/RiskScoreBar'
import ReasonsList from '../../components/ReasonsList'

const DemoBlocked = () => {
  const navigate = useNavigate()
  const result = useMemo(() => {
    const stored = localStorage.getItem('fraudCheckResult')
    return stored ? JSON.parse(stored) : {}
  }, [])
  const tx = useMemo(() => {
    const stored = localStorage.getItem('currentTransaction')
    return stored ? JSON.parse(stored) : {}
  }, [])

  return (
    <div className="min-h-full bg-white text-gray-900 rounded-[36px] overflow-hidden">
      <div className="upi-header bg-red-500">
        <p className="text-sm opacity-90">GuardianShield</p>
        <h2 className="text-2xl font-semibold">🛑 Transaction Blocked</h2>
        <p className="text-sm">High fraud risk detected</p>
      </div>

      <div className="upi-section space-y-4">
        <RiskScoreBar score={result.risk_score || 90} decision="BLOCK" />
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 font-semibold">HIGH FRAUD RISK</div>
        <div className="flex items-center justify-between text-lg font-semibold">
          <span>{tx.merchant}</span>
          <span>₹{tx.amount}</span>
        </div>
        <ReasonsList
          title="Why blocked"
          reasons={result.reasons || ['Behavior anomaly', 'Merchant flagged', 'Velocity too high']}
          type="warning"
        />
        <div className="px-3 py-2 rounded-lg bg-green-100 text-green-700 text-sm font-semibold">✓ ₹{tx.amount || '0'} SAVED</div>
        <div className="grid grid-cols-2 gap-2">
          <button className="btn-brand" onClick={() => navigate('/demo')}>Return to Home</button>
          <button
            className="px-3 py-3 rounded-xl border border-red-200 text-red-600 font-semibold"
            onClick={() => console.log('report merchant')}
          >
            Report Merchant
          </button>
        </div>
      </div>
    </div>
  )
}

export default DemoBlocked
