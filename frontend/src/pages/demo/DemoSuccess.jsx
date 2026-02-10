import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const DemoSuccess = () => {
  const navigate = useNavigate()
  const tx = useMemo(() => JSON.parse(localStorage.getItem('currentTransaction') || '{}'), [])
  const timestamp = new Date().toLocaleString()
  const txId = useMemo(() => Math.random().toString(36).slice(2, 10).toUpperCase(), [])

  return (
    <div className="min-h-full bg-white text-gray-900 rounded-[36px] overflow-hidden flex flex-col items-center p-10">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 12 }}
        className="w-20 h-20 rounded-full bg-green-100 text-green-600 grid place-items-center text-3xl mb-4"
      >
        ✓
      </motion.div>
      <h2 className="text-2xl font-semibold mb-1">Payment Successful</h2>
      <p className="text-gray-600 mb-4">Your payment was completed.</p>
      <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2 text-sm">
        <div className="flex justify-between"><span>To</span><strong>{tx.merchant || 'Merchant'}</strong></div>
        <div className="flex justify-between"><span>Amount</span><strong>₹{tx.amount || 0}</strong></div>
        <div className="flex justify-between"><span>Transaction ID</span><strong>{txId}</strong></div>
        <div className="flex justify-between"><span>Timestamp</span><strong>{timestamp}</strong></div>
      </div>
      <button className="btn-brand mt-6" onClick={() => navigate('/demo')}>Return to Home</button>
    </div>
  )
}

export default DemoSuccess
