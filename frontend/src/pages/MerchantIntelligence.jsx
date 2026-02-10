import { useState } from 'react'
import SearchBar from '../components/SearchBar'
import MerchantCard from '../components/cards/MerchantCard'
import { useMerchantData } from '../hooks/useMerchantData'
import LoadingSpinner from '../components/LoadingSpinner'

const fallback = [
  { name: 'KYC Services', category: 'Services', risk: 92, fraud_rate: 0.95, tx_count: 1200, reports: 34, blacklisted: true, similar: ['KYC Verify', 'ID First'] },
  { name: 'Swiggy', category: 'Food', risk: 18, fraud_rate: 0.02, tx_count: 8200, reports: 4, blacklisted: false, similar: ['Zomato'] },
  { name: 'ElectroMart', category: 'Electronics', risk: 68, fraud_rate: 0.22, tx_count: 2100, reports: 18, blacklisted: false, similar: ['GadgetWorld'] },
]

const MerchantIntelligence = () => {
  const [query, setQuery] = useState({})
  const { data, isLoading } = useMerchantData(query)
  const merchants = data?.merchants || fallback

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/60">Reputation graph</p>
          <h2 className="text-2xl font-semibold text-white">Merchant Intelligence</h2>
        </div>
        <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" onChange={(e) => setQuery((q) => ({ ...q, category: e.target.value }))}>
          <option value="">All categories</option>
          <option value="services">Services</option>
          <option value="food">Food</option>
          <option value="electronics">Electronics</option>
        </select>
      </div>
      <SearchBar placeholder="Search merchant" onChange={(value) => setQuery((q) => ({ ...q, search: value }))} />

      {isLoading ? (
        <LoadingSpinner label="Loading merchants" />
      ) : (
        <div className="card-grid">
          {merchants.map((m) => (
            <MerchantCard key={m.name} merchant={m} />
          ))}
        </div>
      )}
    </div>
  )}

export default MerchantIntelligence
