import { useAuth } from '../../context/AuthContext'
import { usePlatformStats } from '../../hooks/usePlatformStats'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import PlatformCard from '../../components/PlatformCard'
import EngagementGauge from '../../components/EngagementGauge'

export default function PlatformStats() {
  const { user } = useAuth()
  const { stats, loading, refreshing, refresh, byPlatform } = usePlatformStats(user?.id)

  const lc = byPlatform('leetcode')
  const cc = byPlatform('codechef')
  const hr = byPlatform('hackerrank')
  const score = lc.engagement_score || cc.engagement_score || 0

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="My Platform Stats" />
        <main className="flex-1 p-6 space-y-6 overflow-auto">

          <div className="flex items-center justify-between">
            <p className="text-slate-500 text-sm">
              {loading ? 'Loading stats...' : `Last updated: ${lc.last_fetched_at ? new Date(lc.last_fetched_at).toLocaleString() : 'Never'}`}
            </p>
            <button onClick={refresh} disabled={refreshing} className="btn-outline text-sm">
              {refreshing ? '⏳ Refreshing...' : '🔄 Refresh All'}
            </button>
          </div>

          {/* Engagement Score */}
          <div className="bg-white rounded-card shadow-card border border-slate-100 p-6 flex items-center gap-8">
            <EngagementGauge score={score} size={160} />
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-xl text-slate-800">Engagement Breakdown</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🔶</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-0.5">
                      <span className="font-medium text-slate-700">LeetCode (50%)</span>
                      <span className="text-slate-500">{Math.min(100, ((lc.easy_solved||0)*1 + (lc.medium_solved||0)*2 + (lc.hard_solved||0)*4 + (lc.contests_participated||0)*3)).toFixed(0)}/100</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${Math.min(100, ((lc.easy_solved||0)*1 + (lc.medium_solved||0)*2 + (lc.hard_solved||0)*4 + (lc.contests_participated||0)*3))}%` }} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">👨‍🍳</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-0.5">
                      <span className="font-medium text-slate-700">CodeChef (30%)</span>
                      <span className="text-slate-500">{Math.min(100, ((cc.total_solved||0)*1.5 + (cc.contests_participated||0)*2)).toFixed(0)}/100</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-700 rounded-full transition-all" style={{ width: `${Math.min(100, ((cc.total_solved||0)*1.5 + (cc.contests_participated||0)*2))}%` }} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">🟩</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-0.5">
                      <span className="font-medium text-slate-700">HackerRank (20%)</span>
                      <span className="text-slate-500">{Math.min(100, ((hr.badges_count||0)*5 + (hr.certificates||0)*10)).toFixed(0)}/100</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${Math.min(100, ((hr.badges_count||0)*5 + (hr.certificates||0)*10))}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Cards */}
          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1,2,3].map(i => <div key={i} className="bg-slate-100 rounded-card h-64 animate-pulse-soft" />)}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              <PlatformCard platform="leetcode" stats={lc} username={lc.raw_data?.username} />
              <PlatformCard platform="codechef" stats={cc} username={cc.raw_data?.username} />
              <PlatformCard platform="hackerrank" stats={hr} username={hr.raw_data?.username} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
