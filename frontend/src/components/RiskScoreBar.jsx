const colors = {
  SAFE: '#00B894',
  CAUTION: '#FDCB6E',
  CHALLENGE: '#FDCB6E',
  BLOCK: '#E74C3C',
}

const RiskScoreBar = ({ score = 0, decision = 'SAFE' }) => {
  const color = colors[decision] || colors.SAFE
  const width = `${Math.min(Math.max(score, 0), 100)}%`

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Risk Score</p>
          <p className="text-3xl font-bold" style={{ color }}>
            {Math.round(score)}
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: `${color}20`, color }}>
          {decision}
        </span>
      </div>
      <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
        <div className="h-3 rounded-full transition-all duration-500" style={{ width, backgroundColor: color }} />
      </div>
    </div>
  )
}

export default RiskScoreBar
