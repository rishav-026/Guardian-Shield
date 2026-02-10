import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { predictFraud } from '../../utils/api'

const steps = [
  'Checking user behavior',
  'Verifying merchant',
  'Calculating risk score',
  'Making decision',
]

const DemoProcessing = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    const txRaw = localStorage.getItem('currentTransaction')
    if (!txRaw) {
      setError('No transaction found. Please start again.')
      return
    }
    const tx = JSON.parse(txRaw)

    const timer = setInterval(() => {
      setCurrentStep((s) => (s < steps.length - 1 ? s + 1 : s))
    }, 800)

    const run = async () => {
      try {
        const result = await predictFraud(tx)
        localStorage.setItem('fraudCheckResult', JSON.stringify(result))
        const decision = (result.decision || '').toUpperCase()
        if (decision === 'BLOCK') navigate('/demo/blocked')
        else if (decision === 'SAFE') navigate('/demo/safe')
        else navigate('/demo/verify')
      } catch (err) {
        setError('API call failed. Please retry.')
        console.error(err)
      }
    }

    run()
    return () => clearInterval(timer)
  }, [navigate])

  return (
    <div className="min-h-full bg-white text-gray-900 rounded-[36px] overflow-hidden flex flex-col items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        className="w-20 h-20 rounded-full border-4 border-brand-500 border-t-transparent mb-6"
      />
      <h2 className="text-2xl font-semibold mb-2">Analyzing transaction...</h2>
      <p className="text-gray-600 mb-4">GuardianShield AI is scoring this payment.</p>

      <div className="space-y-2 w-full max-w-md">
        {steps.map((step, idx) => (
          <div key={step} className={`p-3 rounded-lg border ${idx <= currentStep ? 'border-brand-500 text-brand-600 bg-brand-50' : 'border-gray-200 text-gray-600'}`}>
            ✓ {step}
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  )
}

export default DemoProcessing
