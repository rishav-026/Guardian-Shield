import { useNavigate } from 'react-router-dom'
import RiskScoreBar from '../../components/RiskScoreBar'
import ReasonsList from '../../components/ReasonsList'

const DemoVerify = () => {
  const navigate = useNavigate()
  const result = JSON.parse(localStorage.getItem('fraudCheckResult') || '{}')
  const tx = JSON.parse(localStorage.getItem('currentTransaction') || '{}')

  return (
    <div className="min-h-full bg-white text-gray-900 rounded-[36px] overflow-hidden">
      <div className="upi-header bg-amber-500">
        <h2 className="text-2xl font-semibold text-white">⚠️ Verification Required</h2>
        <p className="text-sm text-white/90">Unusual transaction pattern</p>
      </div>
      <div className="upi-section space-y-4">
        <RiskScoreBar score={result.risk_score || 55} decision="CAUTION" />
        <ReasonsList
          title="Why we need verification"
          reasons={result.reasons || ['New merchant', 'Higher-than-usual amount']}
          type="warning"
        />
        <div className="space-y-3">
          <p className="text-sm text-gray-700 font-semibold">Enter OTP</p>
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 6 }).map((_, idx) => (
              <input key={idx} className="otp-input" maxLength={1} />
            ))}
          </div>
        </div>
        <button className="btn-brand" onClick={() => navigate('/demo/success')}>
          Verify & Continue
        </button>
        <div className="text-sm text-gray-600">
          Attempting to pay <span className="font-semibold">{tx.merchant || 'Merchant'}</span> for <span className="font-semibold">₹{tx.amount || 0}</span>
        </div>
      </div>
    </div>
  )
}

export default DemoVerify
