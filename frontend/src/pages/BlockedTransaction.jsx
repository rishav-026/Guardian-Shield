import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiShield, FiAlertTriangle, FiVolumeX, FiShare2 } from 'react-icons/fi'
import RiskScoreBar from '../components/RiskScoreBar'
import ReasonsList from '../components/ReasonsList'

const breakdown = [
  { label: 'Behavioral', value: 45 },
  { label: 'Temporal', value: 30 },
  { label: 'Merchant', value: 15 },
  { label: 'Velocity', value: 10 },
]

const BlockedTransaction = () => {
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [transaction, setTransaction] = useState(null)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const res = localStorage.getItem('fraudCheckResult')
    const tx = localStorage.getItem('currentTransaction')
    if (!res || !tx) {
      navigate('/')
      return
    }
    setResult(JSON.parse(res))
    setTransaction(JSON.parse(tx))
  }, [navigate])

  if (!result || !transaction) return null

  return (
    <div className="space-y-5">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-sm text-danger uppercase">Transaction blocked</p>
          <h1 className="text-2xl font-semibold text-white">High fraud risk detected</h1>
          <p className="text-white/60">Funds protected before leaving your account.</p>
        </div>
        <button className="p-2 rounded-lg bg-white/10 text-white" onClick={() => setMuted((m) => !m)}>
          <FiVolumeX /> {muted ? 'Unmute' : 'Mute'}
        </button>
      </header>

      <RiskScoreBar score={result.risk_score || 92} decision={result.decision || 'BLOCK'} />

      <div className="grid md:grid-cols-3 gap-3">
        <div className="glass-card p-4 border border-white/10">
          <p className="text-sm text-white/70">Attempted payment</p>
          <p className="text-xl font-semibold text-white">{transaction.merchant}</p>
          <p className="text-3xl font-mono text-danger">₹{transaction.amount}</p>
        </div>
        <div className="glass-card p-4 border border-white/10">
          <p className="text-sm text-white/70">Estimated fraud amount</p>
          <p className="text-2xl font-semibold text-white">₹{Math.round(transaction.amount * 0.95)}</p>
          <p className="text-xs text-white/60">Similar cases: 23 this week</p>
        </div>
        <div className="glass-card p-4 border border-white/10">
          <p className="text-sm text-white/70">Decision</p>
          <p className="text-2xl font-semibold text-danger">BLOCKED</p>
          <p className="text-xs text-white/60">Policy: Zero-trust for KYC services</p>
        </div>
      </div>

      <div className="glass-card p-4 border border-white/10 space-y-3">
        <div className="flex items-center gap-2">
          <FiAlertTriangle className="text-danger" />
          <p className="font-semibold text-white">Fraud analysis</p>
        </div>
        <ReasonsList reasons={result.reasons || ['Velocity spike', 'Unusual hour', 'Known fraud merchant']} type="warning" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-white/80">
          {breakdown.map((b) => (
            <div key={b.label} className="bg-white/5 border border-white/10 rounded-lg p-3">
              <p className="text-xs text-white/60">{b.label}</p>
              <p className="text-lg font-semibold">{b.value}%</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-4 border border-white/10 space-y-3">
        <p className="font-semibold text-white">What should I do?</p>
        <ol className="list-decimal list-inside text-sm text-white/80 space-y-1">
          <li>Do not share OTP or banking details.</li>
          <li>Call bank helpline if contacted by this merchant.</li>
          <li>Report the incident for wider protection.</li>
        </ol>
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 rounded-lg bg-danger text-white flex items-center gap-2" onClick={() => alert('Fraud reported')}>
            <FiShield /> Report fraud
          </button>
          <button className="px-4 py-2 rounded-lg bg-white/10 text-white flex items-center gap-2" onClick={() => alert('Shared with contacts')}>
            <FiShare2 /> Share warning
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-white/60">
        <span>Similar scam warnings active</span>
        <button className="px-3 py-2 rounded-lg bg-white/10" onClick={() => navigate('/')}>Go home</button>
      </div>
    </div>
  )
}

export default BlockedTransaction
