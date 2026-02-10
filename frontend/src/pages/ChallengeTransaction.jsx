import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiClock, FiShield, FiRefreshCcw, FiPhone } from 'react-icons/fi'
import RiskScoreBar from '../components/RiskScoreBar'
import ReasonsList from '../components/ReasonsList'

const ChallengeTransaction = () => {
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [transaction, setTransaction] = useState(null)
  const [counter, setCounter] = useState(30)

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

  useEffect(() => {
    const timer = setInterval(() => setCounter((c) => Math.max(0, c - 1)), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!result || !transaction) return null

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-warning uppercase">Additional verification</p>
          <h1 className="text-2xl font-semibold">We need a quick check</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/70"><FiClock /> {counter}s</div>
      </header>

      <RiskScoreBar score={result.risk_score || 68} decision={result.decision || 'CHALLENGE'} />

      <div className="grid md:grid-cols-3 gap-3">
        <div className="glass-card p-4 border border-white/10">
          <p className="text-sm text-white/70">Merchant</p>
          <p className="text-xl font-semibold">{transaction.merchant}</p>
          <p className="text-3xl font-mono text-warning">₹{transaction.amount}</p>
        </div>
        <div className="glass-card p-4 border border-white/10">
          <p className="text-sm text-white/70">Reason</p>
          <p className="text-lg font-semibold text-white">Unusual behavior</p>
          <p className="text-xs text-white/60">Velocity spike vs baseline</p>
        </div>
        <div className="glass-card p-4 border border-white/10">
          <p className="text-sm text-white/70">Why needed?</p>
          <p className="text-xs text-white/60">High-risk merchant at odd hour. Protecting funds via step-up auth.</p>
        </div>
      </div>

      <div className="glass-card p-4 border border-white/10 space-y-3">
        <ReasonsList reasons={result.reasons || ['New device fingerprint', 'High amount vs typical', 'IP mismatch']} type="warning" />
        <div className="flex items-center gap-3 text-sm text-white/70">
          <FiShield /> Alternative verification: SMS, Email, Authenticator app, Bank call
        </div>
        <button className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm inline-flex items-center gap-2"><FiRefreshCcw /> Resend OTP ({counter}s)</button>
      </div>

      <div className="glass-card p-4 border border-white/10 space-y-3">
        <p className="font-semibold text-white">Enter verification codes</p>
        <div className="grid md:grid-cols-2 gap-3">
          {['SMS OTP (98765***90)', 'Email OTP (pri***@gmail.com)'].map((label) => (
            <div key={label} className="space-y-2">
              <p className="text-sm text-white/70">{label}</p>
              <div className="flex gap-2">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <input key={idx} className="w-12 h-12 text-center text-xl rounded-xl bg-white/5 border border-white/10 text-white" maxLength={1} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-white/70">
          <input type="checkbox" /> <span>Trust this merchant (whitelist)</span>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <button className="px-4 py-3 rounded-lg bg-brand-500 text-white font-semibold" onClick={() => navigate('/success')}>Verify & Proceed</button>
        <button className="px-4 py-3 rounded-lg bg-white/10 text-white" onClick={() => navigate('/')}>Cancel</button>
        <button className="px-4 py-3 rounded-lg bg-white/10 text-white inline-flex items-center gap-2" onClick={() => alert('Calling bank')}><FiPhone /> Bank call verification</button>
      </div>
    </div>
  )
}

export default ChallengeTransaction
