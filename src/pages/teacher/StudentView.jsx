import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import PlatformCard from '../../components/PlatformCard'
import EngagementGauge from '../../components/EngagementGauge'
import RiskBadge from '../../components/RiskBadge'
import StatCard from '../../components/StatCard'
import api from '../../utils/api'

export default function StudentView() {
  const { id } = useParams()
  const { user } = useAuth()
  const [dashData, setDashData] = useState(null)
  const [platformStats, setPlatformStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get(`/students/${id}/dashboard`),
      api.get(`/platform/stats/${id}`),
    ]).then(([dash, plat]) => {
      setDashData(dash.data)
      setPlatformStats(plat.data.stats || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  const byPlatform = (p) => platformStats.find(s => s.platform === p) || {}
  const lc = byPlatform('leetcode')
  const cc = byPlatform('codechef')
  const hr = byPlatform('hackerrank')
  const score = lc.engagement_score || 0
  const risk = lc.risk_flag || false
  const student = dashData?.student

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={student ? `${student.name}'s Dashboard` : 'Student Dashboard'} />
        <main className="flex-1 p-6 space-y-6 overflow-auto">
          {loading ? (
            <div className="text-slate-400 animate-pulse-soft p-8 text-center">Loading student data...</div>
          ) : (
            <>
              {/* Student Info */}
              {student && (
                <div className="bg-white rounded-card shadow-card border border-slate-100 p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-400 text-white flex items-center justify-center text-xl font-bold">
                    {student.name[0]}
                  </div>
                  <div>
                    <h2 className="font-heading font-bold text-xl text-slate-800">{student.name}</h2>
                    <p className="text-slate-500 text-sm">{student.profile?.department} · Batch {student.profile?.batch} · {student.profile?.roll_number}</p>
                  </div>
                  <div className="ml-auto">
                    <RiskBadge riskFlag={risk} />
                  </div>
                </div>
              )}

              {/* Engagement + Stats */}
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-white rounded-card shadow-card border border-slate-100 p-6 flex flex-col items-center justify-center">
                  <EngagementGauge score={score} size={160} />
                </div>
                <div className="md:col-span-3 grid grid-cols-3 gap-4 content-start">
                  <StatCard label="Total Solved" value={(lc.total_solved||0)+(cc.total_solved||0)} icon="💡" color="blue" />
                  <StatCard label="LeetCode Rating" value={lc.contest_rating||'—'} icon="🔶" color="amber" />
                  <StatCard label="HackerRank Badges" value={hr.badges_count||0} icon="🏅" color="green" />
                </div>
              </div>

              {/* Platform Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                <PlatformCard platform="leetcode" stats={lc} username={lc.raw_data?.username} />
                <PlatformCard platform="codechef" stats={cc} username={cc.raw_data?.username} />
                <PlatformCard platform="hackerrank" stats={hr} username={hr.raw_data?.username} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
