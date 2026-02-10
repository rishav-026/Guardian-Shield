import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const HomeScreen = () => {
  const navigate = useNavigate()

  const [showDemo, setShowDemo] = useState(false)
  const [lastTap, setLastTap] = useState(0)

  const handleLogoTap = () => {
    const now = Date.now()
    if (now - lastTap < 400) {
      setShowDemo((prev) => !prev)
    }
    setLastTap(now)
  }

  const launchScenario = (data) => {
    const scenarioTx = {
      user_id: 'priya_123',
      recipient: data.recipient,
      amount: data.amount,
      merchant: data.recipient,
      time_hour: data.time_hour,
      phone_activity: data.phone_activity,
    }

    localStorage.setItem('currentTransaction', JSON.stringify(scenarioTx))
    navigate('/pay')
  }

  useEffect(() => {
    localStorage.removeItem('fraudCheckResult')
  }, [])

  return (
    <div className="space-y-6 slide-up">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
            GuardianShield AI
          </p>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, Priya
          </h1>
        </div>

        <button
          onClick={handleLogoTap}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/20 text-primary font-semibold"
        >
          <span role="img" aria-label="shield" className="text-lg">
            🛡️
          </span>
          PayShield
        </button>
      </header>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-primary/80 to-accent/70 rounded-2xl p-4 shadow-lg text-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm opacity-80">Account Holder</p>
            <p className="text-lg font-semibold">Priya Sharma</p>
          </div>
          <span className="badge bg-white/20 text-white">UPI</span>
        </div>

        <p className="text-sm opacity-80">Balance</p>
        <p className="text-3xl font-bold">₹45,280.50</p>

        <div className="mt-4 text-xs opacity-80">
          Powered by GuardianShield AI
        </div>
      </div>

      {/* Primary Action */}
      <button
        className="btn-primary text-center"
        onClick={() => navigate('/pay')}
      >
        Send a Payment
      </button>

      {/* Recent Transactions */}
      <section className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <span className="text-xs text-gray-400">Today</span>
        </div>

        <div className="space-y-3 text-sm">
          {[
            { name: 'Swiggy', time: '2:30 PM', amount: '₹450' },
            { name: 'Amazon', time: 'Yesterday', amount: '₹1,299' },
            { name: 'BigBasket', time: 'Jan 8', amount: '₹850' },
          ].map((tx) => (
            <div
              key={tx.name}
              className="flex items-center justify-between"
            >
              <div>
                <p className="font-semibold">{tx.name}</p>
                <p className="text-gray-400 text-xs">{tx.time}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{tx.amount}</p>
                <span className="text-green-400 text-xs">
                  ✓ Completed
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Demo Mode */}
      {showDemo && (
        <div className="space-y-3 bg-gray-900/70 border border-primary/30 rounded-2xl p-4">
          <h3 className="text-sm uppercase tracking-wide text-primary font-semibold">
            Demo Mode
          </h3>

          <div className="grid grid-cols-1 gap-3">
            <button
              className="bg-green-500/20 text-green-200 rounded-xl py-3 font-semibold"
              onClick={() =>
                launchScenario({
                  recipient: 'Swiggy',
                  amount: 1500,
                  time_hour: 14,
                  phone_activity: false,
                })
              }
            >
              Scenario 1: Normal Payment
            </button>

            <button
              className="bg-red-500/20 text-red-200 rounded-xl py-3 font-semibold"
              onClick={() =>
                launchScenario({
                  recipient: 'KYC Update Services',
                  amount: 50000,
                  time_hour: 2,
                  phone_activity: true,
                })
              }
            >
              Scenario 2: Fraud Attempt
            </button>

            <button
              className="bg-yellow-500/20 text-yellow-200 rounded-xl py-3 font-semibold"
              onClick={() =>
                launchScenario({
                  recipient: 'Apollo Hospital',
                  amount: 150000,
                  time_hour: 1,
                  phone_activity: false,
                })
              }
            >
              Scenario 3: Medical Emergency
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomeScreen
