import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import api from '../../utils/api'

export default function AssignReviews() {
  const [teachers, setTeachers] = useState([])
  const [students, setStudents] = useState([])
  const [reviews, setReviews] = useState([])

  const [month, setMonth] = useState('')
  const [teacherId, setTeacherId] = useState('')
  const [selectedStudents, setSelectedStudents] = useState([])
  const [dept, setDept] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api.get('/teachers'), api.get('/students'), api.get('/reviews')])
      .then(([t, s, r]) => { setTeachers(t.data); setStudents(s.data); setReviews(r.data) })
      .catch(() => {})
  }, [])

  const depts = [...new Set(students.map(s => s.profile?.department).filter(Boolean))]
  const filteredStudents = dept ? students.filter(s => s.profile?.department === dept) : students

  const toggleStudent = (id) => setSelectedStudents(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  const handleAssign = async () => {
    if (!month || !teacherId || !selectedStudents.length) {
      setError('Please fill month, teacher, and select at least one student.'); return
    }
    setSaving(true); setError(''); setSuccess('')
    try {
      await Promise.all(selectedStudents.map(sid => api.post('/reviews', { student_id: sid, teacher_id: teacherId, month })))
      setSuccess(`✅ ${selectedStudents.length} review(s) assigned for ${month}`)
      setSelectedStudents([])
      const r = await api.get('/reviews')
      setReviews(r.data)
    } catch (err) { setError(err.response?.data?.error || 'Assignment failed') }
    finally { setSaving(false) }
  }

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Assign Reviews" />
        <main className="flex-1 p-6 space-y-6 overflow-auto">

          <div className="grid md:grid-cols-2 gap-6">
            {/* Assignment Form */}
            <div className="bg-white rounded-card shadow-card border border-slate-100 p-5 space-y-4">
              <h2 className="font-heading font-semibold text-slate-800">Assign Monthly Reviews</h2>
              {success && <div className="text-success text-sm bg-green-50 border border-green-100 rounded-lg p-3">{success}</div>}
              {error && <div className="text-danger text-sm bg-red-50 border border-red-100 rounded-lg p-3">⚠️ {error}</div>}

              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Month</label>
                <select className="input" value={month} onChange={e => setMonth(e.target.value)}>
                  <option value="">Select Month</option>
                  {MONTHS.map(m => <option key={m} value={m}>{m} 2025</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Teacher</label>
                <select className="input" value={teacherId} onChange={e => setTeacherId(e.target.value)}>
                  <option value="">Select Teacher</option>
                  {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Filter by Department</label>
                <select className="input" value={dept} onChange={e => setDept(e.target.value)}>
                  <option value="">All Departments</option>
                  {depts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1.5">
                  <span>Select Students ({selectedStudents.length} selected)</span>
                  <button className="text-primary hover:underline" onClick={() => setSelectedStudents(filteredStudents.map(s => s.id))}>Select All</button>
                </div>
                <div className="border border-slate-200 rounded-lg max-h-52 overflow-y-auto divide-y divide-slate-50">
                  {filteredStudents.map(s => (
                    <label key={s.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 cursor-pointer">
                      <input type="checkbox" checked={selectedStudents.includes(s.id)} onChange={() => toggleStudent(s.id)} className="accent-primary" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{s.name}</p>
                        <p className="text-xs text-slate-400">{s.profile?.roll_number} · {s.profile?.batch}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button onClick={handleAssign} disabled={saving} className="btn-primary w-full justify-center">
                {saving ? 'Assigning...' : `📋 Assign ${selectedStudents.length} Review(s)`}
              </button>
            </div>

            {/* Reviews Table */}
            <div className="bg-white rounded-card shadow-card border border-slate-100 overflow-hidden flex flex-col max-h-[calc(100vh-160px)]">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-heading font-semibold text-slate-800">All Reviews</h2>
              </div>
              <div className="overflow-y-auto flex-1">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left">Student</th>
                      <th className="px-4 py-3 text-left">Teacher</th>
                      <th className="px-4 py-3 text-left">Month</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {reviews.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5 text-slate-800">{r.student?.name || '—'}</td>
                        <td className="px-4 py-2.5 text-slate-500">{r.teacher?.name || '—'}</td>
                        <td className="px-4 py-2.5 text-slate-500">{r.month || '—'}</td>
                        <td className="px-4 py-2.5">
                          <span className={`pill ${r.status==='completed'?'pill-green':r.status==='booked'?'pill-blue':r.status==='cancelled'?'pill-red':'pill-amber'}`}>{r.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
