import { useState } from 'react'
import { useTransactions } from '../hooks/useTransactions'
import SearchBar from '../components/SearchBar'
import FilterPanel from '../components/FilterPanel'
import ExportButton from '../components/ExportButton'
import { exportCSV, exportPDF } from '../utils/export'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatCurrency, formatDateTime } from '../utils/formatters'

const TransactionHistory = ({ search }) => {
  const [filters, setFilters] = useState({ decision: 'ALL', search })
  const { data, isLoading } = useTransactions(filters)
  const rows = data?.transactions || []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/60">Audit trail</p>
          <h2 className="text-2xl font-semibold text-white">Transaction History</h2>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton onExport={() => exportCSV(rows)} />
          <ExportButton onExport={() => exportPDF('Transaction History', rows)} />
        </div>
      </div>
      <SearchBar placeholder="Search transactions" onChange={(q) => setFilters((f) => ({ ...f, search: q }))} />
      <FilterPanel filters={filters} setFilters={setFilters} />

      {isLoading ? (
        <LoadingSpinner label="Loading transactions" />
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-sm text-white/80">
            <thead>
              <tr className="text-left border-b border-white/10">
                <th className="py-3">Time</th>
                <th>Merchant</th>
                <th>Amount</th>
                <th>Risk</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((tx) => (
                <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-2">{formatDateTime(tx.time)}</td>
                  <td>{tx.merchant}</td>
                  <td>{formatCurrency(tx.amount)}</td>
                  <td>{tx.risk_score}</td>
                  <td>{tx.decision}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-white/60">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default TransactionHistory
