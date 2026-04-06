import { useState } from 'react'

const TIME_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

export default function ReviewSlotPicker({ slots = [], onBook }) {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState(null)

  const availableDates = [...new Set(slots.map((s) => s.date))].sort()
  const slotsForDate = slots.filter((s) => s.date === selectedDate && s.is_available)

  const handleBook = () => {
    if (selectedSlot) onBook(selectedSlot)
  }

  if (!slots.length) {
    return (
      <div className="text-center py-10 text-slate-400">
        <div className="text-3xl mb-2">📅</div>
        <p className="text-sm">No available slots from your teacher yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-700 block mb-1.5">Select Date</label>
        <div className="flex flex-wrap gap-2">
          {availableDates.map((date) => (
            <button
              key={date}
              onClick={() => { setSelectedDate(date); setSelectedSlot(null) }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                selectedDate === date
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-primary'
              }`}
            >
              {new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </button>
          ))}
        </div>
      </div>

      {selectedDate && (
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1.5">Select Time Slot</label>
          {slotsForDate.length === 0 ? (
            <p className="text-sm text-slate-400">No slots available for this date.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {slotsForDate.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    selectedSlot?.id === slot.id
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-primary'
                  }`}
                >
                  🕐 {slot.time_slot}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedSlot && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <p className="text-sm font-medium text-slate-700 mb-3">
            Confirm booking for{' '}
            <strong>{new Date(selectedSlot.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</strong>
            {' '}at <strong>{selectedSlot.time_slot}</strong>
          </p>
          <button onClick={handleBook} className="btn-primary">
            ✅ Confirm Booking
          </button>
        </div>
      )}
    </div>
  )
}
