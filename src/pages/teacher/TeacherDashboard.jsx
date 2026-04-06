import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import StatCard from '../../components/StatCard'
import api from '../../utils/api'
import { getScoreColor } from '../../utils/engagementScore'

export default function TeacherDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/teachers/dashboard')
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const summary = data?.summary || {}
  const reviews = data?.reviews || []

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Teacher Dashboard" />
        <main className="flex-1 p-6 space-y-6 overflow-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Students" value={summary.totalStudents ?? '—'} icon="🎓" color="blue" />
            <StatCard label="Pending Reviews" value={summary.pending ?? '—'} icon="⏳" color="amber" />
            <StatCard label="Completed" value={summary.completed ?? '—'} icon="✅" color="green" />
            <StatCard label="Avg Score" value={summary.avgScore ?? '—'} icon="📊" color="blue" sub="/10" />
          </div>

          {/* Student List */}
          <div className="bg-white rounded-card shadow-card border border-slate-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-heading font-semibold text-slate-800">Assigned Students</h2>
              <Link to="/teacher/reviews" className="btn-outline text-xs py-1.5">Manage Reviews →</Link>
            </div>
            {loading ? (
              <div className="p-8 text-center text-slate-400 animate-pulse-soft">Loading...</div>
            ) : reviews.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No students assigned yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3 text-left">Student</th>
                      <th className="px-5 py-3 text-left">Dept / Batch</th>
                      <th className="px-5 py-3 text-left">Month</th>
                      <th className="px-5 py-3 text-left">Status</th>
                      <th className="px-5 py-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {reviews.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3">
                          <p className="font-medium text-slate-800">{r.student?.name || '—'}</p>
                          <p className="text-xs text-slate-400">{r.student?.email}</p>
                        </td>
                        <td className="px-5 py-3 text-slate-500">
                          {r.student?.profile?.department || '—'} · {r.student?.profile?.batch || '—'}
                        </td>
                        <td className="px-5 py-3 text-slate-500">{r.month || '—'}</td>
                        <td className="px-5 py-3">
                          <span className={`pill ${
                            r.status === 'completed' ? 'pill-green' :
                            r.status === 'booked' ? 'pill-blue' :
                            r.status === 'cancelled' ? 'pill-red' : 'pill-amber'
                          }`}>{r.status}</span>
                        </td>
                        <td className="px-5 py-3">
                          <Link to={`/teacher/student/${r.student_id}`} className="btn-outline py-1 text-xs">
                            View →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
