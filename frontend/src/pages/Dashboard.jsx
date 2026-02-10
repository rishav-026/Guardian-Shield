import { useNavigate } from 'react-router-dom'
import { FiTrendingUp, FiShieldOff, FiDollarSign, FiCheckCircle } from 'react-icons/fi'
import RiskTrendChart from '../components/charts/RiskTrendChart'
import TransactionVolumeChart from '../components/charts/TransactionVolumeChart'
import StatCard from '../components/cards/StatCard'

const stats = [
  { title: 'Total Transactions', value: '1,523', change: 12, icon: FiTrendingUp },
  { title: 'Fraud Blocked', value: '87', change: -3, icon: FiShieldOff, color: 'danger' },
  { title: 'Amount Saved', value: '₹42,30,000', change: 15, icon: FiDollarSign },
  { title: 'Success Rate', value: '94.3%', change: 2, icon: FiCheckCircle },
]

const recent = [
  { time: '09:20', merchant: 'KYC Services', amount: '₹50,000', risk: 94, decision: 'BLOCK' },
  { time: '08:55', merchant: 'Swiggy', amount: '₹1,500', risk: 12, decision: 'SAFE' },
  { time: '08:42', merchant: 'ElectroMart', amount: '₹12,500', risk: 68, decision: 'VERIFY' },
  { time: '08:10', merchant: 'LensKart', amount: '₹3,200', risk: 24, decision: 'SAFE' },
]

const Dashboard = () => {
  const navigate = useNavigate()

  return (
    <div className="space-y-5">
      <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm text-white/70">🎬 Live Demo Experience</p>
          <h2 className="text-xl font-semibold text-white">See fraud detection in action</h2>
          <p className="text-white/70 text-sm">Run the simulated UPI app and watch AI decisions in real time.</p>
        </div>
        <button
          className="px-5 py-3 rounded-xl bg-brand-500 text-white font-semibold shadow-lg"
          onClick={() => navigate('/demo')}
        >
          Launch Demo Mode →
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-white">Risk Trend (7 days)</p>
            <span className="text-xs text-white/60">Avg risk movement</span>
          </div>
          <RiskTrendChart />
        </div>
        <div className="glass-card p-4 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-white">Transaction Volume</p>
            <span className="text-xs text-white/60">Hourly distribution</span>
          </div>
          <TransactionVolumeChart />
        </div>
      </div>

      <div className="table-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-semibold text-white">Recent Transactions</p>
            <p className="text-xs text-white/60">Live scoring decisions</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 rounded-lg bg-white/10 text-sm">Export CSV</button>
            <button className="px-3 py-2 rounded-lg bg-white/10 text-sm">Last 24h</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-white/60">
              <tr>
                <th className="py-2 pr-4">Time</th>
                <th className="py-2 pr-4">Merchant</th>
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2 pr-4">Risk</th>
                <th className="py-2 pr-4">Decision</th>
              </tr>
            </thead>
            <tbody className="text-white/90 divide-y divide-white/5">
              {recent.map((row) => (
                <tr key={`${row.time}-${row.merchant}`}>
                  <td className="py-2 pr-4">{row.time}</td>
                  <td className="py-2 pr-4">{row.merchant}</td>
                  <td className="py-2 pr-4">{row.amount}</td>
                  <td className="py-2 pr-4">{row.risk}</td>
                  <td className="py-2 pr-4">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs ${
                        row.decision === 'BLOCK'
                          ? 'bg-danger/20 text-danger'
                          : row.decision === 'VERIFY'
                          ? 'bg-warning/20 text-warning'
                          : 'bg-success/20 text-success'
                      }`}
                    >
                      {row.decision}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
