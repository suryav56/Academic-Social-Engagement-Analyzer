import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useStudentDashboard } from '../../hooks/useStudentDashboard'
import { usePlatformStats } from '../../hooks/usePlatformStats'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import StatCard from '../../components/StatCard'
import EngagementGauge from '../../components/EngagementGauge'
import RiskBadge from '../../components/RiskBadge'
import PlatformCard from '../../components/PlatformCard'
import ProfileSetup from '../../components/ProfileSetup'

export default function StudentDashboard() {
  const { user } = useAuth()
  const { data, loading: dashLoading, refresh: refreshDash } = useStudentDashboard(user?.id)
  const { stats, refreshing, refresh: refreshStats, byPlatform } = usePlatformStats(user?.id, true)
  const [showSetup, setShowSetup] = useState(false)

  const lc = byPlatform('leetcode')
  const cc = byPlatform('codechef')
  const hr = byPlatform('hackerrank')

  const engagementScore = lc.engagement_score || cc.engagement_score || hr.engagement_score || 0
  const riskFlag = lc.risk_flag || cc.risk_flag || hr.risk_flag || false

  const totalSolved = (lc.total_solved || 0) + (cc.total_solved || 0)
  const totalContests = (lc.contests_participated || 0) + (cc.contests_participated || 0)
  const totalBadges = (hr.badges_count || 0)

  const hasAnyProfile = data?.student?.profile?.leetcode_username || 
                       data?.student?.profile?.codechef_username || 
                       data?.student?.profile?.hackerrank_username

  if (dashLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Student Dashboard" />
        <main className="flex-1 p-6 space-y-6 overflow-auto">

          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Hello, {user?.name}! 👋</h2>
              <p className="text-slate-500">Here's your coding progress and engagement overview.</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowSetup(!showSetup)}
                className={`btn-outline text-sm ${showSetup ? 'bg-slate-100' : ''}`}
              >
                {showSetup ? 'Close Setup' : '🔗 Link Profiles'}
              </button>
              <button 
                onClick={refreshStats} 
                className="btn-primary text-sm flex items-center gap-2"
                disabled={refreshing}
              >
                {refreshing ? '🔄 Syncing...' : '🔄 Sync Data'}
              </button>
            </div>
          </div>

          {/* Risk / On Track Banner */}
          <RiskBadge riskFlag={riskFlag} />

          {/* Profile Setup Section */}
          {(showSetup || !hasAnyProfile) && (
            <ProfileSetup 
              profile={data?.student?.profile} 
              onUpdate={() => {
                setShowSetup(false)
                refreshDash()
                refreshStats()
              }} 
            />
          )}

          {/* Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Solved" value={totalSolved} icon="💡" color="blue" sub="Across LeetCode & CodeChef" />
            <StatCard label="LeetCode Rating" value={lc.contest_rating || '—'} icon="🔶" color="amber" sub={lc.stale ? 'Cached data' : 'Real-time'} />
            <StatCard label="Contests" value={totalContests} icon="🏆" color="green" sub="Total participation" />
            <StatCard label="HR Badges" value={totalBadges} icon="🏅" color="blue" sub={`${hr.certificates || 0} Certificates`} />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Engagement Gauge Card */}
            <div className="bg-white rounded-card shadow-card border border-slate-100 p-8 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-primary/20 text-3xl font-bold">
                  {engagementScore}%
                </div>
              </div>
              <EngagementGauge score={engagementScore} size={220} />
              <div className="mt-6 text-center">
                <h4 className="font-bold text-slate-800">Engagement Score</h4>
                <p className="text-sm text-slate-500 max-w-[200px] mt-1">
                  Based on your activity across all linked platforms.
                </p>
              </div>
            </div>

            {/* Upcoming Review Widget */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-br from-primary to-blue-700 rounded-card shadow-lg p-6 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-1">📅 Upcoming Review</h3>
                    {data?.upcomingReview ? (
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
                            👨‍🏫
                          </div>
                          <div>
                            <div className="font-semibold">{data.upcomingReview.teacher?.name}</div>
                            <div className="text-xs text-white/70">{data.upcomingReview.teacher?.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm font-medium">
                          <div className="flex items-center gap-1">
                            <span>🕒</span>
                            <span>{new Date(data.upcomingReview.slot?.start_time || data.upcomingReview.scheduled_at).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1 uppercase text-[10px] bg-white/20 px-2 py-0.5 rounded">
                            {data.upcomingReview.status}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-white/80 mt-2">No upcoming reviews booked. Stay ahead by booking one today!</p>
                    )}
                  </div>
                  <div className="mt-6">
                    <Link 
                      to="/student/book-review" 
                      className="inline-block bg-white text-primary font-bold px-6 py-2.5 rounded-lg shadow-sm hover:bg-blue-50 transition-colors"
                    >
                      {data?.upcomingReview ? 'Modify Booking' : 'Book a Review Session →'}
                    </Link>
                  </div>
                </div>
                {/* Decorative circles */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full" />
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-white/5 rounded-full" />
              </div>

              {/* Quick Platform Stats Link */}
              <div className="bg-white rounded-card shadow-card border border-slate-100 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl">
                    📊
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Detailed Analytics</h4>
                    <p className="text-sm text-slate-500">View deep-dive stats and performance charts</p>
                  </div>
                </div>
                <Link to="/student/stats" className="btn-outline text-sm">
                  View Detailed Stats
                </Link>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Platform Overview</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {!hasAnyProfile ? (
              <div className="md:col-span-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-card p-12 text-center">
                <div className="text-4xl mb-4">🔌</div>
                <h4 className="text-lg font-bold text-slate-800">Connect Your Profiles</h4>
                <p className="text-slate-500 mb-6">Link your coding accounts to see your detailed performance here.</p>
                <button onClick={() => setShowSetup(true)} className="btn-primary">Connect Profiles Now</button>
              </div>
            ) : (
              <>
                <PlatformCard platform="leetcode" stats={lc} username={data?.student?.profile?.leetcode_username} />
                <PlatformCard platform="codechef" stats={cc} username={data?.student?.profile?.codechef_username} />
                <PlatformCard platform="hackerrank" stats={hr} username={data?.student?.profile?.hackerrank_username} />
              </>
            )}
          </div>

        </main>
      </div>
    </div>
  )
}

