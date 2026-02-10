import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RiskScoreBar from '../components/RiskScoreBar'
import ReasonsList from '../components/ReasonsList'

const SafeTransaction = () => {
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [transaction, setTransaction] = useState(null)

  useEffect(() => {
    const res = localStorage.getItem('fraudCheckResult')
    const tx = localStorage.getItem('currentTransaction')
    if (!res || !tx) {
      navigate('/');
      return
    }
    setResult(JSON.parse(res))
    setTransaction(JSON.parse(tx))
  }, [navigate])

  if (!result || !transaction) return null

  return (
    <div className="space-y-6 slide-up">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-green-400">✓ Transaction Verified</p>
          <h1 className="text-2xl font-bold">Looks good to go</h1>
        </div>
        <span className="badge bg-green-500/20 text-green-300">SAFE</span>
      </div>

      <RiskScoreBar score={result.risk_score} decision={result.decision || 'SAFE'} />

      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 space-y-2">
        <p className="text-sm text-gray-400">Paying</p>
        <p className="text-xl font-semibold">{transaction.merchant}</p>
        <p className="text-3xl font-bold text-green-400">₹{transaction.amount}</p>
        <p className="text-sm text-gray-400">This matches your normal spending pattern. Transaction looks safe.</p>
      </div>

      {result.reasons && result.reasons.length > 0 && (
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4">
          <p className="text-sm text-gray-300 mb-3">Why safe?</p>
          <ReasonsList reasons={result.reasons} type="positive" />
        </div>
      )}

      <div className="space-y-3">
        <p className="text-sm text-gray-300">Enter UPI PIN to confirm</p>
        <div className="flex gap-3">
          {[0, 1, 2, 3].map((idx) => (
            <input key={idx} className="w-14 h-14 text-center text-2xl rounded-xl bg-gray-900 border border-gray-800 text-white" maxLength={1} />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <button className="btn-primary bg-safe" onClick={() => navigate('/success')}>
          Confirm Payment
        </button>
        <button className="btn-outline" onClick={() => navigate('/')}>Cancel</button>
      </div>
    </div>
  )
}

export default SafeTransaction
