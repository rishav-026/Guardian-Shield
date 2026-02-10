import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const COLORS = ['#FF6B35', '#E74C3C', '#FDCB6E', '#00B894']

const defaultData = [
  { name: 'Blocked', value: 38 },
  { name: 'Challenged', value: 22 },
  { name: 'Caution', value: 18 },
  { name: 'Safe', value: 22 },
]

const FraudDistributionPie = ({ data = defaultData }) => (
  <ResponsiveContainer width="100%" height={280}>
    <PieChart>
      <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={90} fill="#8884d8" dataKey="value" label>
        {data.map((entry, index) => (
          <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
      <Legend wrapperStyle={{ color: '#fff' }} />
    </PieChart>
  </ResponsiveContainer>
)

export default FraudDistributionPie
