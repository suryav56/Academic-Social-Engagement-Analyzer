import { useAuth } from '../../context/AuthContext'
import { usePlatformStats } from '../../hooks/usePlatformStats'
import { useStudentDashboard } from '../../hooks/useStudentDashboard'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import PlatformCard from '../../components/PlatformCard'
import EngagementGauge from '../../components/EngagementGauge'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts'

export default function PlatformStats() {
  const { user } = useAuth()
  const { stats, loading, refreshing, refresh, byPlatform } = usePlatformStats(user?.id)
  const { data } = useStudentDashboard(user?.id)

  const lc = byPlatform('leetcode')
  const cc = byPlatform('codechef')
  const hr = byPlatform('hackerrank')
  const score = lc.engagement_score || cc.engagement_score || 0

  const lcP = Math.min(100, ((lc.easy_solved||0)*1 + (lc.medium_solved||0)*2 + (lc.hard_solved||0)*4 + (lc.contests_participated||0)*3))
  const ccP = Math.min(100, ((cc.total_solved||0)*1.5 + (cc.contests_participated||0)*2))
  const hrP = Math.min(100, ((hr.badges_count||0)*5 + (hr.certificates||0)*10))

  const breakdownData = [
    { name: 'LeetCode', value: lcP, color: '#F59E0B', icon: '🔶' },
    { name: 'CodeChef', value: ccP, color: '#B45309', icon: '👨‍🍳' },
    { name: 'HackerRank', value: hrP, color: '#10B981', icon: '🟩' },
  ]

  const totalPossible = 300
  const totalEarned = lcP + ccP + hrP
  
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Detailed Analytics" />
        <main className="flex-1 p-6 space-y-8 overflow-auto">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Performance Deep-Dive</h2>
              <p className="text-slate-500 text-sm">
                {loading ? 'Analyzing your profiles...' : `Last updated: ${lc.last_fetched_at ? new Date(lc.last_fetched_at).toLocaleString() : 'Never'}`}
              </p>
            </div>
            <button onClick={refresh} disabled={refreshing} className="btn-primary flex items-center gap-2">
              {refreshing ? '⏳ Syncing Data...' : '🔄 Re-Sync Profiles'}
            </button>
          </div>

          {/* Engagement Breakdown Deep-dive */}
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 bg-white rounded-card shadow-card border border-slate-100 p-8 flex flex-col items-center justify-center">
              <EngagementGauge score={score} size={240} />
              <div className="mt-4 text-center">
                <p className="text-3xl font-black text-slate-800">{score}%</p>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-1">Total Engagement</p>
              </div>
            </div>

            <div className="lg:col-span-3 bg-white rounded-card shadow-card border border-slate-100 p-8">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span>📈</span> Platform Contribution
              </h3>
              
              <div className="space-y-6">
                {breakdownData.map((item) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-bold text-slate-700">{item.name}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-500">{item.value.toFixed(0)}/100 pts</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${item.value}%`, backgroundColor: item.color }} 
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Ranking Factor</p>
                  <p className="text-sm text-slate-600 mt-1">Your total points contribute to your class percentile.</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-primary">{totalEarned.toFixed(0)}</span>
                  <span className="text-xs font-bold text-slate-400 ml-1">/ 300</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Platform Cards */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800">Platform-wise Insights</h3>
            {loading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[1,2,3].map(i => <div key={i} className="bg-slate-100 rounded-card h-64 animate-pulse-soft" />)}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                <PlatformCard platform="leetcode" stats={lc} username={data?.student?.profile?.leetcode_username} />
                <PlatformCard platform="codechef" stats={cc} username={data?.student?.profile?.codechef_username} />
                <PlatformCard platform="hackerrank" stats={hr} username={data?.student?.profile?.hackerrank_username} />
              </div>
            )}
          </div>

          {/* Comparison / Tip Section */}
          <div className="bg-blue-600 rounded-card shadow-lg p-8 text-white flex flex-col md:flex-row items-center gap-8">
            <div className="text-5xl">💡</div>
            <div className="flex-1 space-y-2">
              <h4 className="text-xl font-bold">Pro Tip: Boost Your Engagement</h4>
              <p className="text-blue-100">
                Participation in contests yields 3x more points compared to solving easy problems. 
                Consistency is key—try to solve at least one problem every day to maintain a high engagement score.
              </p>
            </div>
            <a href="https://leetcode.com/contest" target="_blank" rel="noreferrer" className="bg-white text-blue-600 font-bold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap">
              Check Ongoing Contests
            </a>
          </div>

        </main>
      </div>
    </div>
  )
}

