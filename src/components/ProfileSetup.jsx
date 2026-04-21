import { useState } from 'react'
import api from '../utils/api'

export default function ProfileSetup({ profile, onUpdate }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    leetcode_username: profile?.leetcode_username || '',
    codechef_username: profile?.codechef_username || '',
    hackerrank_username: profile?.hackerrank_username || '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.patch(`/students/${profile.user_id}`, formData)
      onUpdate()
    } catch (err) {
      console.error(err)
      alert('Failed to update profiles')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-card shadow-card border border-blue-100 p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4 block">🔗 Setup Your Coding Profiles</h3>
      <p className="text-sm text-slate-500 mb-6">Enter your usernames to sync your latest coding progress and engagement metrics.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase">LeetCode Username</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500">🔶</span>
              <input
                type="text"
                placeholder="leetcode_user"
                className="input pl-9"
                value={formData.leetcode_username}
                onChange={(e) => setFormData({ ...formData, leetcode_username: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase">CodeChef Username</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-700">👨‍🍳</span>
              <input
                type="text"
                placeholder="codechef_user"
                className="input pl-9"
                value={formData.codechef_username}
                onChange={(e) => setFormData({ ...formData, codechef_username: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase">HackerRank Username</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600">🟩</span>
              <input
                type="text"
                placeholder="hackerrank_user"
                className="input pl-9"
                value={formData.hackerrank_username}
                onChange={(e) => setFormData({ ...formData, hackerrank_username: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-8 py-2.5 flex items-center gap-2"
          >
            {loading ? 'Saving...' : 'Save & Sync Profiles'}
          </button>
        </div>
      </form>
    </div>
  )
}
