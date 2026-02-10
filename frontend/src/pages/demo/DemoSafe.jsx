import { useNavigate } from 'react-router-dom'
import RiskScoreBar from '../../components/RiskScoreBar'

const DemoSafe = () => {
  const navigate = useNavigate()
  const tx = JSON.parse(localStorage.getItem('currentTransaction') || '{}')

  return (
    <div className="min-h-full bg-white text-gray-900 rounded-[36px] overflow-hidden">
      <div className="upi-header bg-green-500">
        <h2 className="text-2xl font-semibold text-white">✓ Transaction Verified</h2>
        <p className="text-sm text-white/90">Matches your normal pattern</p>
      </div>
      <div className="upi-section space-y-4">
        <RiskScoreBar score={tx.risk_score || 8} decision="SAFE" />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="bg-gray-100 rounded-xl py-3 text-center font-semibold">•</div>
          ))}
        </div>
        <button className="btn-brand" onClick={() => navigate('/demo/success')}>Confirm Payment</button>
      </div>
    </div>
  )
}

export default DemoSafe
