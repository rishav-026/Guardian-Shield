const defaultData = Array.from({ length: 7 }).map((_, day) =>
  Array.from({ length: 6 }).map((_, hour) => ({ value: Math.floor(Math.random() * 100), label: `${hour * 4}:00` }))
)

const RiskHeatmap = ({ data = defaultData }) => (
  <div className="grid grid-cols-7 gap-2">
    {data.map((col, dayIdx) => (
      <div key={dayIdx} className="space-y-2">
        <p className="text-xs text-white/60">Day {dayIdx + 1}</p>
        <div className="grid grid-rows-6 gap-2">
          {col.map((cell, idx) => (
            <div
              key={idx}
              className="h-10 rounded-lg flex items-center justify-center text-xs font-semibold text-white"
              style={{
                background: `linear-gradient(135deg, rgba(255,107,53,${cell.value / 130}), rgba(0,78,137,${cell.value / 200}))`,
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {cell.value}
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)

export default RiskHeatmap
