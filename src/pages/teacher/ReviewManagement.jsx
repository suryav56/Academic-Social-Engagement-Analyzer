import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import ReviewSlotPicker from '../../components/ReviewSlotPicker'
import api from '../../utils/api'

export default function ReviewManagement() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [newSlotDate, setNewSlotDate] = useState('')
  const [newSlotTimes, setNewSlotTimes] = useState([])
  const [selectedReview, setSelectedReview] = useState(null)
  const [score, setScore] = useState(7)
  const [feedback, setFeedback] = useState('')

  const timeOptions = ['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00']

  useEffect(() => {
    Promise.all([api.get('/reviews'), api.get(`/slots/${user.id}`)])
      .then(([r, s]) => { setReviews(r.data); setSlots(s.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user.id])

  const createSlots = async () => {
    if (!newSlotDate || !newSlotTimes.length) return
    try {
      const res = await api.post('/slots', { date: newSlotDate, time_slots: newSlotTimes })
      setSlots(p => [...p, ...res.data])
      setNewSlotDate('')
      setNewSlotTimes([])
    } catch {}
  }

  const completeReview = async () => {
    if (!selectedReview) return
    try {
      await api.patch(`/reviews/${selectedReview.id}/complete`, { review_score: score, feedback })
      setReviews(p => p.map(r => r.id === selectedReview.id ? { ...r, status: 'completed', review_score: score, feedback } : r))
      setSelectedReview(null); setFeedback(''); setScore(7)
    } catch {}
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Review Management" />
        <main className="flex-1 p-6 space-y-6 overflow-auto">

          {/* Create Slots */}
          <div className="bg-white rounded-card shadow-card border border-slate-100 p-5">
            <h2 className="font-heading font-semibold text-slate-800 mb-4">📅 Add Available Slots</h2>
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Date</label>
                <input type="date" className="input w-auto" value={newSlotDate} onChange={e => setNewSlotDate(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Time Slots</label>
                <div className="flex flex-wrap gap-1.5">
                  {timeOptions.map(t => (
                    <button key={t} onClick={() => setNewSlotTimes(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])}
                      className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${newSlotTimes.includes(t) ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-slate-200 hover:border-primary'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={createSlots} className="btn-primary">Add Slots</button>
            </div>
          </div>

          {/* Reviews Table */}
          <div className="bg-white rounded-card shadow-card border border-slate-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-heading font-semibold text-slate-800">Assigned Reviews</h2>
            </div>
            {loading ? (
              <div className="p-8 text-center text-slate-400 animate-pulse-soft">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3 text-left">Student</th>
                      <th className="px-5 py-3 text-left">Month</th>
                      <th className="px-5 py-3 text-left">Scheduled</th>
                      <th className="px-5 py-3 text-left">Status</th>
                      <th className="px-5 py-3 text-left">Score</th>
                      <th className="px-5 py-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {reviews.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-medium text-slate-800">{r.student?.name || '—'}</td>
                        <td className="px-5 py-3 text-slate-500">{r.month || '—'}</td>
                        <td className="px-5 py-3 text-slate-500">
                          {r.slot ? `${r.slot.date} ${r.slot.time_slot}` : 'Not booked'}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`pill ${r.status==='completed'?'pill-green':r.status==='booked'?'pill-blue':r.status==='cancelled'?'pill-red':'pill-amber'}`}>{r.status}</span>
                        </td>
                        <td className="px-5 py-3 text-slate-500">{r.review_score ? `${r.review_score}/10` : '—'}</td>
                        <td className="px-5 py-3">
                          {r.status === 'booked' && (
                            <button onClick={() => setSelectedReview(r)} className="btn-success text-xs py-1">Complete</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Complete Review Modal */}
          {selectedReview && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
                <h3 className="font-heading font-bold text-xl text-slate-800 mb-4">Complete Review</h3>
                <p className="text-sm text-slate-500 mb-4">Student: <strong>{selectedReview.student?.name}</strong></p>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1.5">Score (1–10): {score}</label>
                    <input type="range" min="1" max="10" value={score} onChange={e => setScore(+e.target.value)} className="w-full" />
                    <div className="flex justify-between text-xs text-slate-400"><span>1</span><span>10</span></div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1.5">Feedback</label>
                    <textarea value={feedback} onChange={e => setFeedback(e.target.value)} className="input h-24 resize-none" placeholder="Write your feedback here..." />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={completeReview} className="btn-primary flex-1">Submit Review</button>
                    <button onClick={() => setSelectedReview(null)} className="btn-outline flex-1">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
