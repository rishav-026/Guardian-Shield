import { useState } from 'react'
import RiskTrendChart from '../components/charts/RiskTrendChart'
import TransactionVolumeChart from '../components/charts/TransactionVolumeChart'
import FraudDistributionPie from '../components/charts/FraudDistributionPie'
import RiskHeatmap from '../components/charts/RiskHeatmap'
import StatCard from '../components/cards/StatCard'

const Analytics = () => {
  const [range, setRange] = useState('7d')
  const ranges = [
    { label: '7 days', value: '7d' },
    { label: '30 days', value: '30d' },
    { label: '90 days', value: '90d' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/60">Advanced signals</p>
          <h2 className="text-2xl font-semibold text-white">Analytics</h2>
        </div>
        <div className="flex items-center gap-2">
          {ranges.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`px-3 py-2 rounded-lg border text-sm ${range === r.value ? 'border-brand-500 text-white bg-brand-500/10' : 'border-white/10 text-white/70'}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard title="Peak fraud hours" value="2-4 AM" change={8} icon={null} />
        <StatCard title="Top merchant risk" value="KYC Services" change={-5} icon={null} />
        <StatCard title="Emerging pattern" value="SIM swap" change={12} icon={null} />
        <StatCard title="Risk profile trend" value="-6.2%" change={-6.2} icon={null} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass-card p-4 border border-white/10">
          <p className="font-semibold text-white mb-2">Risk trend</p>
          <RiskTrendChart />
        </div>
        <div className="glass-card p-4 border border-white/10">
          <p className="font-semibold text-white mb-2">Transaction volume by hour</p>
          <TransactionVolumeChart />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass-card p-4 border border-white/10">
          <p className="font-semibold text-white mb-2">Decision distribution</p>
          <FraudDistributionPie />
        </div>
        <div className="glass-card p-4 border border-white/10">
          <p className="font-semibold text-white mb-2">Fraud pattern breakdown</p>
          <RiskHeatmap />
        </div>
      </div>
    </div>
  )
}

export default Analytics
