import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function ContestLineChart({ data = [] }) {
  const chartData = data.length > 0 ? data : [
    { contest: 'No Data', rating: 0 },
  ]

  return (
    <ResponsiveContainer width="100%" height={140}>
      <LineChart data={chartData} margin={{ left: -10, right: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        <XAxis
          dataKey="contest"
          tick={{ fontSize: 9, fill: '#94A3B8' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => v.replace('Weekly Contest ', 'WC').replace('Biweekly Contest ', 'BWC')}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#94A3B8' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}
        />
        <Line
          type="monotone"
          dataKey="rating"
          stroke="#2563EB"
          strokeWidth={2}
          dot={{ r: 4, fill: '#2563EB' }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
