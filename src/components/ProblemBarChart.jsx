import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

export default function ProblemBarChart({ easy = 0, medium = 0, hard = 0 }) {
  const data = [
    { name: 'Problems Solved', Easy: easy, Medium: medium, Hard: hard },
  ]
  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16 }}>
        <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" hide />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}
          cursor={{ fill: '#F8FAFC' }}
        />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="Easy" fill="#16A34A" radius={[0, 4, 4, 0]} stackId="a" />
        <Bar dataKey="Medium" fill="#D97706" radius={[0, 0, 0, 0]} stackId="a" />
        <Bar dataKey="Hard" fill="#DC2626" radius={[0, 4, 4, 0]} stackId="a" />
      </BarChart>
    </ResponsiveContainer>
  )
}
