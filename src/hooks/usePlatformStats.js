import { useState, useEffect } from 'react'
import api from '../utils/api'

export function usePlatformStats(studentId, autoRefresh = false) {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch cached stats from DB
  const fetchStats = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/platform/stats/${studentId}`)
      const data = res.data.stats || []
      setStats(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Hit the external APIs to pull fresh data and store in DB
  const refresh = async () => {
    try {
      setRefreshing(true)
      const res = await api.get(`/platform/refresh/${studentId}`)
      setStats(res.data.stats || [])
      setError(null)
    } catch (err) {
      // 400 = no profiles linked — not a crash, just no usernames set yet
      if (err.response?.status !== 400) {
        setError(err.response?.data?.error || err.message)
      }
    } finally {
      setRefreshing(false)
      setLoading(false)    // Always clear loading after refresh
    }
  }

  useEffect(() => {
    if (!studentId) {
      setLoading(false)
      return
    }
    if (autoRefresh) {
      refresh()            // Live fetch on dashboard mount
    } else {
      fetchStats()         // Read from DB on stats page mount
    }
  }, [studentId])

  const byPlatform = (platform) => stats.find((s) => s.platform === platform) || {}

  return { stats, loading, error, refreshing, refresh, byPlatform }
}
