const ReasonsList = ({ title, reasons = [], type = 'warning' }) => {
  if (!reasons || reasons.length === 0) return null
  const isPositive = type === 'positive'
  const bullet = isPositive ? '✓' : '⚠️'
  const color = isPositive ? 'text-green-600' : 'text-amber-600'

  return (
    <div className="space-y-2">
      {title && <p className="text-sm font-semibold text-gray-800">{title}</p>}
      <ul className="space-y-2">
        {reasons.map((reason, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-gray-800">
            <span className={`mt-0.5 ${color}`}>{bullet}</span>
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ReasonsList
