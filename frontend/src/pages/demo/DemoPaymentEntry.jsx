import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DemoPaymentEntry = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ merchant: '', amount: '', remark: '', phoneActivity: false })
  const [error, setError] = useState('')

  useEffect(() => {
    const preset = localStorage.getItem('demoTransaction')
    if (preset) {
      try {
        const parsed = JSON.parse(preset)
        setForm((prev) => ({ ...prev, merchant: parsed.merchant || '', amount: parsed.amount || '' }))
      } catch (err) {
        console.error('Invalid preset', err)
      }
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.merchant || !form.amount) {
      setError('Merchant and amount are required')
      return
    }
    const tx = {
      user_id: 'priya_123',
      merchant: form.merchant,
      amount: parseFloat(form.amount),
      time_hour: new Date().getHours(),
      phone_activity: form.phoneActivity,
      remark: form.remark,
    }
    localStorage.setItem('currentTransaction', JSON.stringify(tx))
    setError('')
    navigate('/demo/processing')
  }

  return (
    <div className="min-h-full bg-white text-gray-900 rounded-[36px] overflow-hidden">
      <div className="upi-header">
        <button className="text-sm underline" onClick={() => navigate('/demo')}>← Back</button>
        <h2 className="text-2xl font-semibold">New payment</h2>
        <p className="text-sm">Enter UPI details to simulate</p>
      </div>

      <form onSubmit={handleSubmit} className="upi-section space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">To</label>
          <input
            className="w-full border border-gray-200 rounded-xl px-3 py-3 text-gray-900"
            placeholder="Merchant or UPI ID"
            value={form.merchant}
            onChange={(e) => setForm((p) => ({ ...p, merchant: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Amount</label>
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-3">
            <span className="text-gray-500">₹</span>
            <input
              type="number"
              className="flex-1 outline-none text-gray-900"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
              min="0"
              step="0.01"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Remark (optional)</label>
          <input
            className="w-full border border-gray-200 rounded-xl px-3 py-3 text-gray-900"
            placeholder="Purpose"
            value={form.remark}
            onChange={(e) => setForm((p) => ({ ...p, remark: e.target.value }))}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.phoneActivity}
            onChange={(e) => setForm((p) => ({ ...p, phoneActivity: e.target.checked }))}
          />
          Simulate phone activity (Demo)
        </label>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" className="btn-brand">Pay ₹{form.amount || '0'}</button>
      </form>
    </div>
  )
}

export default DemoPaymentEntry
