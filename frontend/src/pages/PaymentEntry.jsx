import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { predictFraud } from '../utils/api'
import RiskScoreBar from '../components/RiskScoreBar'
import ReasonsList from '../components/ReasonsList'
import { validateAmount, validateMerchant } from '../utils/validators'
import { formatCurrency } from '../utils/formatters'

const merchants = ['Swiggy', 'Zomato', 'KYC Services', 'ElectroMart', 'Uber', 'Jio']

const PaymentEntry = () => {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [suggestedAmounts] = useState([1200, 5000, 20000])
  const [form, setForm] = useState(() => {
    const stored = localStorage.getItem('gs-payment')
    return stored
      ? JSON.parse(stored)
      : { merchant: '', amount: '', saveBeneficiary: true }
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [estimate] = useState('~2s')

  useEffect(() => {
    localStorage.setItem('gs-payment', JSON.stringify(form))
  }, [form])

  const handleNext = () => {
    const merchantError = validateMerchant(form.merchant)
    setErrors((e) => ({ ...e, merchant: merchantError }))
    if (!merchantError) setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const amountError = validateAmount(Number(form.amount))
    setErrors((e) => ({ ...e, amount: amountError }))
    if (amountError) return

    setLoading(true)

    try {
      const result = await predictFraud({
        ...form,
        device_id: 'device-123',
        ip_address: '1.2.3.4',
      })

      if (result?.decision === 'BLOCK') {
        navigate('/blocked', { state: { result } })
      } else if (result?.decision === 'CHALLENGE') {
        navigate('/verify', { state: { result } })
      } else {
        navigate('/processing', { state: { result } })
      }
    } catch (err) {
      setErrors((e) => ({ ...e, submit: 'Unable to score transaction' }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="glass-card p-4 border border-white/10">
        <p className="text-sm text-white/70">Step {step} of 2</p>
        <h2 className="text-2xl font-semibold text-white">
          Make a secure payment
        </h2>
      </div>

      {step === 1 && (
        <div className="glass-card p-4 border border-white/10 space-y-3">
          <label className="text-sm text-white/70">Merchant</label>

          <input
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-3 text-white"
            placeholder="Start typing..."
            value={form.merchant}
            onChange={(e) =>
              setForm((f) => ({ ...f, merchant: e.target.value }))
            }
            list="merchant-suggestions"
          />

          <datalist id="merchant-suggestions">
            {merchants.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>

          {errors.merchant && (
            <p className="text-danger text-xs">{errors.merchant}</p>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 rounded-lg bg-brand-500 text-white"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="glass-card p-4 border border-white/10 space-y-3">
          <label className="text-sm text-white/70">Amount</label>

          <input
            type="number"
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-3 text-white"
            placeholder="₹0"
            value={form.amount}
            onChange={(e) =>
              setForm((f) => ({ ...f, amount: e.target.value }))
            }
          />

          {errors.amount && (
            <p className="text-danger text-xs">{errors.amount}</p>
          )}

          <div className="flex gap-2">
            {suggestedAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                className="px-3 py-2 rounded-lg bg-white/10"
                onClick={() =>
                  setForm((f) => ({ ...f, amount: amt }))
                }
              >
                {formatCurrency(amt)}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm text-white/80">
            <input
              type="checkbox"
              checked={form.saveBeneficiary}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  saveBeneficiary: e.target.checked,
                }))
              }
            />
            Save as beneficiary
          </label>

          <p className="text-xs text-white/60">
            Estimated processing time {estimate}
          </p>

          {errors.submit && (
            <p className="text-danger text-xs">{errors.submit}</p>
          )}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white"
            >
              Back
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-brand-500 text-white"
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Submit & Analyze'}
            </button>
          </div>
        </div>
      )}

      <div className="glass-card p-4 border border-white/10 space-y-2">
        <p className="text-sm text-white/70">Live risk preview</p>
        <RiskScoreBar score={42} />
        <ReasonsList
          title="Signals"
          reasons={['Velocity normal', 'Device trusted', 'Geo match']}
          type="safe"
        />
      </div>
    </form>
  )
}

export default PaymentEntry
