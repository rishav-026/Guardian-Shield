import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceArea } from 'recharts'

const defaultData = [
  { date: 'Day 1', you: 62, platform: 54 },
  { date: 'Day 2', you: 68, platform: 55 },
  { date: 'Day 3', you: 58, platform: 53 },
  { date: 'Day 4', you: 72, platform: 56 },
  { date: 'Day 5', you: 65, platform: 55 },
  { date: 'Day 6', you: 61, platform: 54 },
  { date: 'Day 7', you: 59, platform: 53 },
]

const RiskTrendChart = ({ data = defaultData }) => (
  <ResponsiveContainer width="100%" height={280}>
    <LineChart data={data} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
      <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} axisLine={false} tickLine={false} />
      <YAxis domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} axisLine={false} tickLine={false} />
      <ReferenceArea y1={0} y2={40} fill="rgba(0,184,148,0.08)" />
      <ReferenceArea y1={40} y2={70} fill="rgba(253,203,110,0.08)" />
      <ReferenceArea y1={70} y2={100} fill="rgba(231,76,60,0.08)" />
      <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
      <Line type="monotone" dataKey="you" stroke="#FF6B35" strokeWidth={3} dot={false} />
      <Line type="monotone" dataKey="platform" stroke="#00B894" strokeWidth={2} strokeDasharray="4 3" dot={false} />
    </LineChart>
  </ResponsiveContainer>
)

export default RiskTrendChart
