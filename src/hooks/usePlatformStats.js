import { useState, useEffect } from 'react'
import api from '../utils/api'

export function usePlatformStats(studentId, autoRefresh = false) {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/platform/stats/${studentId}`)
      setStats(res.data.stats || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const refresh = async () => {
    try {
      setRefreshing(true)
      const res = await api.get(`/platform/refresh/${studentId}`)
      setStats(res.data.stats || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (studentId) {
      if (autoRefresh) refresh()
      else fetchStats()
    }
  }, [studentId])

  const byPlatform = (platform) => stats.find((s) => s.platform === platform) || {}

  return { stats, loading, error, refreshing, refresh, byPlatform }
}
