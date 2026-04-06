import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import StatCard from '../../components/StatCard'
import api from '../../utils/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/students'),
    ]).then(([s, st]) => {
      setStats(s.data)
      setStudents(st.data.slice(0, 10))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Admin Dashboard" />
        <main className="flex-1 p-6 space-y-6 overflow-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard label="Students" value={stats?.totalStudents ?? '—'} icon="🎓" color="blue" />
            <StatCard label="Teachers" value={stats?.totalTeachers ?? '—'} icon="👨‍🏫" color="green" />
            <StatCard label="Admins" value={stats?.totalAdmins ?? '—'} icon="🛡️" color="red" />
            <StatCard label="Active Reviews" value={stats?.activeReviews ?? '—'} icon="📋" color="amber" />
            <StatCard label="At Risk" value={stats?.atRisk ?? '—'} icon="⚠️" color="red" />
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { to: '/admin/users', icon: '👥', label: 'Manage Users', desc: 'Add students, teachers, admins' },
              { to: '/admin/reviews', icon: '📋', label: 'Assign Reviews', desc: 'Schedule monthly reviews' },
            ].map(card => (
              <Link key={card.to} to={card.to} className="bg-white rounded-card shadow-card border border-slate-100 p-5 card-hover flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl">{card.icon}</div>
                <div>
                  <p className="font-heading font-semibold text-slate-800">{card.label}</p>
                  <p className="text-xs text-slate-400">{card.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Recent Students */}
          <div className="bg-white rounded-card shadow-card border border-slate-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-heading font-semibold text-slate-800">Recent Students</h2>
              <Link to="/admin/users" className="btn-outline text-xs py-1.5">View All →</Link>
            </div>
            {loading ? (
              <div className="p-8 text-center text-slate-400 animate-pulse-soft">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3 text-left">Name</th>
                      <th className="px-5 py-3 text-left">Roll No</th>
                      <th className="px-5 py-3 text-left">Department</th>
                      <th className="px-5 py-3 text-left">Platforms</th>
                      <th className="px-5 py-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {students.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3">
                          <p className="font-medium text-slate-800">{s.name}</p>
                          <p className="text-xs text-slate-400">{s.email}</p>
                        </td>
                        <td className="px-5 py-3 text-slate-500">{s.profile?.roll_number || '—'}</td>
                        <td className="px-5 py-3 text-slate-500">{s.profile?.department || '—'}</td>
                        <td className="px-5 py-3">
                          <div className="flex gap-1">
                            {s.profile?.leetcode_username && <span className="pill pill-amber">LC</span>}
                            {s.profile?.codechef_username && <span className="pill bg-amber-100 text-amber-800">CC</span>}
                            {s.profile?.hackerrank_username && <span className="pill pill-green">HR</span>}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <Link to={`/admin/student/${s.id}`} className="btn-outline py-1 text-xs">View →</Link>
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
