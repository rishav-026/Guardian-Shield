import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const SuccessScreen = () => {
  const navigate = useNavigate()
  const [transaction, setTransaction] = useState(null)
  const [txnId, setTxnId] = useState('')
  const [timestamp, setTimestamp] = useState('')

  useEffect(() => {
    const tx = localStorage.getItem('currentTransaction')
    if (!tx) {
      navigate('/')
      return
    }
    setTransaction(JSON.parse(tx))
    setTxnId(crypto.randomUUID())
    setTimestamp(new Date().toLocaleString())
  }, [navigate])

  const handleHome = () => {
    localStorage.removeItem('currentTransaction')
    localStorage.removeItem('fraudCheckResult')
    navigate('/')
  }

  if (!transaction) return null

  return (
    <div className="space-y-6 text-center slide-up">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        className="mx-auto w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-4xl text-green-400"
      >
        ✓
      </motion.div>
      <h1 className="text-2xl font-bold">Payment Successful</h1>
      <p className="text-gray-400">Payment processed successfully</p>

      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 text-left space-y-2">
        <p className="text-sm text-gray-400">Amount</p>
        <p className="text-3xl font-bold text-green-400">₹{transaction.amount}</p>
        <p className="text-sm text-gray-400">To</p>
        <p className="font-semibold">{transaction.merchant}</p>
        <p className="text-sm text-gray-400">Transaction ID</p>
        <p className="font-mono text-sm">{txnId}</p>
        <p className="text-sm text-gray-400">Date & Time</p>
        <p className="text-sm">{timestamp}</p>
      </div>

      <button className="btn-primary bg-safe" onClick={handleHome}>
        Return to Home
      </button>
    </div>
  )
}

export default SuccessScreen
