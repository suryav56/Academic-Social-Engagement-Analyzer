import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { usePlatformStats } from '../../hooks/usePlatformStats'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import StatCard from '../../components/StatCard'
import EngagementGauge from '../../components/EngagementGauge'
import RiskBadge from '../../components/RiskBadge'
import PlatformCard from '../../components/PlatformCard'

export default function StudentDashboard() {
  const { user } = useAuth()
  const { stats, loading, refreshing, refresh, byPlatform } = usePlatformStats(user?.id, true)

  const lc = byPlatform('leetcode')
  const cc = byPlatform('codechef')
  const hr = byPlatform('hackerrank')

  const engagementScore = lc.engagement_score || cc.engagement_score || hr.engagement_score || 0
  const riskFlag = lc.risk_flag || cc.risk_flag || hr.risk_flag || false

  const totalSolved = (lc.total_solved || 0) + (cc.total_solved || 0)
  const totalContests = (lc.contests_participated || 0) + (cc.contests_participated || 0)
  const totalBadges = (hr.badges_count || 0)

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="My Dashboard" />
        <main className="flex-1 p-6 space-y-6 overflow-auto">

          {/* Risk / On Track Banner */}
          <RiskBadge riskFlag={riskFlag} />

          {/* Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Solved" value={totalSolved} icon="💡" color="blue" />
            <StatCard label="LeetCode Rating" value={lc.contest_rating || '—'} icon="🔶" color="amber" />
            <StatCard label="Contests" value={totalContests} icon="🏆" color="green" />
            <StatCard label="HackerRank Badges" value={totalBadges} icon="🏅" color="blue" />
          </div>

          {/* Engagement Score + Platform Cards row */}
          <div className="grid md:grid-cols-4 gap-6">
            {/* Engagement Gauge */}
            <div className="bg-white rounded-card shadow-card border border-slate-100 p-6 flex flex-col items-center justify-center">
              {loading || refreshing ? (
                <div className="text-slate-400 text-sm animate-pulse-soft">⏳ Loading...</div>
              ) : (
                <>
                  <EngagementGauge score={engagementScore} size={180} />
                  <button
                    onClick={refresh}
                    disabled={refreshing}
                    className="btn-outline mt-4 text-xs py-1.5"
                  >
                    {refreshing ? '⏳ Refreshing...' : '🔄 Refresh Stats'}
                  </button>
                </>
              )}
            </div>

            {/* Platform Cards */}
            <div className="md:col-span-3 grid md:grid-cols-3 gap-4">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="bg-slate-100 rounded-card h-48 animate-pulse-soft" />
                ))
              ) : (
                <>
                  <PlatformCard platform="leetcode" stats={lc} username={lc.raw_data?.username} />
                  <PlatformCard platform="codechef" stats={cc} username={cc.raw_data?.username} />
                  <PlatformCard platform="hackerrank" stats={hr} username={hr.raw_data?.username} />
                </>
              )}
            </div>
          </div>

          {/* Review CTA */}
          <div className="bg-white rounded-card shadow-card border border-blue-100 p-5 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-semibold text-slate-800">📅 Upcoming Reviews</h3>
              <p className="text-slate-500 text-sm mt-0.5">Book a review session with your teacher</p>
            </div>
            <Link to="/student/book-review" className="btn-primary">
              Book a Review →
            </Link>
          </div>

        </main>
      </div>
    </div>
  )
}
