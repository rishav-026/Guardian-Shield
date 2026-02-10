import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const defaultData = Array.from({ length: 12 }).map((_, i) => ({ hour: `${i + 8}:00`, volume: Math.round(Math.random() * 120) + 10 }))

const TransactionVolumeChart = ({ data = defaultData }) => (
  <ResponsiveContainer width="100%" height={280}>
    <BarChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
      <XAxis dataKey="hour" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} axisLine={false} tickLine={false} />
      <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
      <Bar dataKey="volume" fill="url(#volumeGradient)" radius={[8, 8, 0, 0]} />
      <defs>
        <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity={0.3} />
        </linearGradient>
      </defs>
    </BarChart>
  </ResponsiveContainer>
)

export default TransactionVolumeChart
