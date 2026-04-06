export default function StatCard({ label, value, icon, color = 'blue', sub }) {
  const colors = {
    blue: 'bg-blue-50 text-primary border-blue-100',
    green: 'bg-green-50 text-success border-green-100',
    amber: 'bg-amber-50 text-warning border-amber-100',
    red: 'bg-red-50 text-danger border-red-100',
    gray: 'bg-slate-50 text-slate-600 border-slate-100',
  }

  return (
    <div className="bg-white rounded-card shadow-card p-5 border border-slate-100 card-hover animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold font-heading text-slate-800">{value ?? '—'}</p>
          {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
        {icon && (
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg ${colors[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
