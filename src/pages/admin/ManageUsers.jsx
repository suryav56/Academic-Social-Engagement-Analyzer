import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import api from '../../utils/api'

const TABS = ['student', 'teacher', 'admin']

const initialForms = {
  student: { name: '', email: '', password: '', roll_number: '', department: '', batch: '', leetcode_username: '', codechef_username: '', hackerrank_username: '' },
  teacher: { name: '', email: '', password: '', department: '' },
  admin: { name: '', email: '', password: '' },
}

export default function ManageUsers() {
  const [activeTab, setActiveTab] = useState('student')
  const [form, setForm] = useState(initialForms)
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const loadUsers = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/users', { params: { role: activeTab, search, page, limit: 10 } })
      setUsers(res.data.users)
      setTotal(res.data.total)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { loadUsers() }, [activeTab, search, page])

  const handleChange = (field, value) => setForm(p => ({ ...p, [activeTab]: { ...p[activeTab], [field]: value } }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true); setError(''); setSuccess('')
    try {
      await api.post('/admin/users', { ...form[activeTab], role: activeTab })
      setSuccess(`✅ ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} created successfully!`)
      setForm(p => ({ ...p, [activeTab]: initialForms[activeTab] }))
      loadUsers()
    } catch (err) { setError(err.response?.data?.error || 'Failed to create user') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return
    try { await api.delete(`/admin/users/${id}`); loadUsers() } catch {}
  }

  const currentForm = form[activeTab]

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Manage Users" />
        <main className="flex-1 p-6 space-y-6 overflow-auto">

          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
            {TABS.map(t => (
              <button key={t} onClick={() => { setActiveTab(t); setPage(1) }}
                className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${activeTab === t ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Create Form */}
            <div className="bg-white rounded-card shadow-card border border-slate-100 p-5">
              <h2 className="font-heading font-semibold text-slate-800 mb-4">Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
              {success && <div className="text-success text-sm bg-green-50 border border-green-100 rounded-lg p-3 mb-3">{success}</div>}
              {error && <div className="text-danger text-sm bg-red-50 border border-red-100 rounded-lg p-3 mb-3">⚠️ {error}</div>}
              <form onSubmit={handleSubmit} className="space-y-3">
                {[
                  { field: 'name', label: 'Full Name', type: 'text', required: true },
                  { field: 'email', label: 'Email', type: 'email', required: true },
                  { field: 'password', label: 'Password', type: 'text', required: true },
                  ...(activeTab === 'student' ? [
                    { field: 'roll_number', label: 'Roll Number', type: 'text' },
                    { field: 'department', label: 'Department', type: 'text' },
                    { field: 'batch', label: 'Batch (e.g. 2021-2025)', type: 'text' },
                    { field: 'leetcode_username', label: 'LeetCode Username', type: 'text' },
                    { field: 'codechef_username', label: 'CodeChef Username', type: 'text' },
                    { field: 'hackerrank_username', label: 'HackerRank Username', type: 'text' },
                  ] : activeTab === 'teacher' ? [
                    { field: 'department', label: 'Department', type: 'text' },
                  ] : []),
                ].map(({ field, label, type, required }) => (
                  <div key={field}>
                    <label className="text-xs font-medium text-slate-600 block mb-1">{label}</label>
                    <input type={type} className="input" value={currentForm[field] || ''} required={required}
                      onChange={e => handleChange(field, e.target.value)} placeholder={label} />
                  </div>
                ))}
                <button type="submit" className="btn-primary w-full justify-center" disabled={saving}>
                  {saving ? 'Creating...' : `→ Create ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
                </button>
              </form>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-card shadow-card border border-slate-100 overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-slate-100">
                <input className="input" placeholder="Search by name or email..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
              </div>
              <div className="overflow-y-auto flex-1">
                {loading ? (
                  <div className="p-8 text-center text-slate-400 animate-pulse-soft">Loading...</div>
                ) : users.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">No {activeTab}s found.</div>
                ) : (
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-slate-50">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <p className="font-medium text-slate-800">{u.name}</p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-400">{u.profile?.roll_number || u.profile?.department || '—'}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => handleDelete(u.id)} className="text-xs text-danger hover:underline">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              {total > 10 && (
                <div className="px-4 py-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                  <span>Page {page} · {total} total</span>
                  <div className="flex gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="btn-outline py-1 text-xs">‹</button>
                    <button onClick={() => setPage(p => p+1)} disabled={page*10>=total} className="btn-outline py-1 text-xs">›</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
