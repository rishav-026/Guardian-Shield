import { useNavigate } from 'react-router-dom'

const scenarios = [
  { label: 'Scenario 1: Normal', color: 'bg-green-500', data: { merchant: 'Swiggy', amount: 1500, time_hour: 14, phone_activity: false } },
  { label: 'Scenario 2: Fraud', color: 'bg-red-500', data: { merchant: 'KYC Update Services', amount: 50000, time_hour: 2, phone_activity: true } },
  { label: 'Scenario 3: Emergency', color: 'bg-amber-500', data: { merchant: 'Apollo Hospital', amount: 150000, time_hour: 1, phone_activity: false } },
]

const DemoHome = () => {
  const navigate = useNavigate()

  const startScenario = (data) => {
    localStorage.setItem('demoTransaction', JSON.stringify(data))
    navigate('/demo/pay')
  }

  return (
    <div className="min-h-full bg-white text-gray-900 rounded-[36px] overflow-hidden">
      <div className="upi-header">
        <p className="text-sm opacity-90">PayShield</p>
        <h2 className="text-2xl font-semibold">Hi Priya 👋</h2>
        <p className="text-sm">Secure UPI wallet protected by GuardianShield</p>
      </div>

      <div className="upi-section">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-500">Available balance</p>
            <p className="text-3xl font-bold text-gray-900">₹45,280.50</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-semibold">SAFE</span>
        </div>
        <button className="btn-brand" onClick={() => navigate('/demo/pay')}>Make Payment</button>
      </div>

      <div className="upi-section border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <p className="font-semibold text-gray-900">Recent transactions</p>
          <span className="text-xs text-gray-500">Today</span>
        </div>
        <div className="space-y-3 text-sm">
          {[
            { merchant: 'Swiggy', time: '2:30 PM', amount: '₹450', risk: 'SAFE' },
            { merchant: 'Amazon', time: 'Yesterday', amount: '₹1,299', risk: 'SAFE' },
            { merchant: 'KYC Update Services', time: 'Today', amount: '₹50,000', risk: 'BLOCK' },
          ].map((tx) => (
            <div key={tx.merchant} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
              <div>
                <p className="font-semibold text-gray-900">{tx.merchant}</p>
                <p className="text-gray-500 text-xs">{tx.time}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{tx.amount}</p>
                <span
                  className={`text-xs font-semibold ${
                    tx.risk === 'BLOCK' ? 'text-red-500' : 'text-green-600'
                  }`}
                >
                  {tx.risk}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="upi-section border-t border-gray-100">
        <p className="font-semibold text-gray-900 mb-2">Quick Demo Scenarios</p>
        <div className="flex flex-wrap gap-2">
          {scenarios.map((scenario) => (
            <button
              key={scenario.label}
              className={`scenario-pill ${scenario.color}`}
              onClick={() => startScenario(scenario.data)}
            >
              {scenario.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DemoHome
