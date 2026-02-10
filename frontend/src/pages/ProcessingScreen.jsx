import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useSound from 'use-sound'

const phases = [
  'Verifying user identity...',
  'Analyzing behavioral patterns...',
  'Checking merchant reputation...',
  'Calculating risk score...',
  'Finalizing decision...',
]

const ProcessingScreen = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0)
  const [playDone] = useSound('/sounds/safe.mp3', { volume: 0.4 })

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => Math.min(p + 20, 100))
      setPhase((p) => Math.min(p + 1, phases.length - 1))
    }, 700)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (progress >= 100) {
      playDone()
      const decision = location.state?.result?.decision || 'SAFE'
      if (decision === 'BLOCK') navigate('/blocked', { state: location.state })
      else if (decision === 'CHALLENGE') navigate('/verify', { state: location.state })
      else navigate('/safe', { state: location.state })
    }
  }, [progress, location.state, navigate, playDone])

  return (
    <div className="space-y-4">
      <div className="glass-card p-6 border border-white/10 text-center">
        <p className="text-sm text-white/60">Guardian engine</p>
        <h2 className="text-2xl font-semibold text-white">Analyzing transaction</h2>
        <p className="text-xs text-white/50">Estimated {Math.max(0, 5 - phase)}s remaining</p>
      </div>

      <div className="glass-card p-6 border border-white/10 space-y-4">
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <div className="bg-brand-500 h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-white/80 text-center">{phases[phase]}</p>
        <div className="flex items-center justify-center gap-3 text-white/60 text-sm">
          <span className="w-3 h-3 rounded-full bg-brand-500 animate-ping" />
          <span className="w-3 h-3 rounded-full bg-warning animate-ping" style={{ animationDelay: '150ms' }} />
          <span className="w-3 h-3 rounded-full bg-success animate-ping" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

export default ProcessingScreen
