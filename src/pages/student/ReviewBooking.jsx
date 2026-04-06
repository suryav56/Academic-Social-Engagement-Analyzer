import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import ReviewSlotPicker from '../../components/ReviewSlotPicker'
import api from '../../utils/api'

export default function ReviewBooking() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [revRes] = await Promise.all([
          api.get('/reviews'),
        ])
        const myReviews = revRes.data.filter(r => r.student_id === user.id && r.status === 'pending')
        setReviews(myReviews)

        // Load teacher's available slots from first assigned review
        if (myReviews.length > 0) {
          const teacherId = myReviews[0].teacher_id
          const slotsRes = await api.get(`/slots/${teacherId}`)
          setSlots(slotsRes.data)
        }
      } catch (err) {
        setError('Failed to load reviews')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user.id])

  const handleBook = async (slot) => {
    if (!reviews.length) return
    setBooking(true)
    setError('')
    try {
      const reviewId = reviews[0].id
      await api.patch(`/reviews/${reviewId}/book`, { slot_id: slot.id })
      setSuccess(`✅ Review booked for ${new Date(slot.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} at ${slot.time_slot}`)
      setSlots(prev => prev.map(s => s.id === slot.id ? { ...s, is_available: false } : s))
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed')
    } finally {
      setBooking(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Book a Review" />
        <main className="flex-1 p-6">
          <div className="max-w-2xl">
            {success ? (
              <div className="bg-green-50 border border-green-100 text-success rounded-xl p-6 animate-fade-in text-center">
                <div className="text-3xl mb-2">🎉</div>
                <p className="font-semibold font-heading text-lg">{success}</p>
                <p className="text-sm text-slate-500 mt-1">Your teacher will be notified of this booking.</p>
              </div>
            ) : (
              <div className="bg-white rounded-card shadow-card border border-slate-100 p-6">
                <h2 className="font-heading font-bold text-xl text-slate-800 mb-1">Schedule Your Review</h2>
                <p className="text-slate-500 text-sm mb-6">
                  {loading ? 'Loading available slots...' :
                   !reviews.length ? 'No review has been assigned to you yet. Please contact your teacher.' :
                   `Assigned teacher: ${reviews[0]?.teacher?.name || 'Your Teacher'}`}
                </p>
                {error && <div className="text-danger text-sm mb-4 bg-red-50 border border-red-100 rounded-lg p-3">⚠️ {error}</div>}
                {!loading && reviews.length > 0 && (
                  <ReviewSlotPicker slots={slots} onBook={handleBook} />
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
