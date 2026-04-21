import { useState, useEffect } from 'react'
import api from '../utils/api'

export function useStudentDashboard(studentId) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/students/${studentId}/dashboard`)
      setData(res.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (studentId) fetchDashboard()
  }, [studentId])

  return { data, loading, error, refresh: fetchDashboard }
}
