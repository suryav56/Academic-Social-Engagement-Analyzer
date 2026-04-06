import ProblemBarChart from './ProblemBarChart'
import ContestLineChart from './ContestLineChart'

const platformConfig = {
  leetcode: {
    name: 'LeetCode',
    color: 'from-orange-500 to-amber-400',
    icon: '🔶',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    baseUrl: 'https://leetcode.com/',
  },
  codechef: {
    name: 'CodeChef',
    color: 'from-amber-700 to-amber-500',
    icon: '👨‍🍳',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    baseUrl: 'https://www.codechef.com/users/',
  },
  hackerrank: {
    name: 'HackerRank',
    color: 'from-green-600 to-emerald-400',
    icon: '🟩',
    bg: 'bg-green-50',
    border: 'border-green-100',
    baseUrl: 'https://www.hackerrank.com/',
  },
}

export default function PlatformCard({ platform, stats = {}, username }) {
  const cfg = platformConfig[platform] || {}

  return (
    <div className={`bg-white rounded-card shadow-card border ${cfg.border} overflow-hidden card-hover animate-fade-in`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${cfg.color} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{cfg.icon}</span>
            <div>
              <h3 className="font-heading font-bold text-lg">{cfg.name}</h3>
              {stats.stale && (
                <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                  ⏱ Cached data
                </span>
              )}
            </div>
          </div>
          {username && (
            <a
              href={`${cfg.baseUrl}${username}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-full font-medium transition-colors"
            >
              View Profile ↗
            </a>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* LeetCode specific */}
        {platform === 'leetcode' && (
          <>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-green-50 rounded-lg p-2">
                <div className="text-lg font-bold text-success">{stats.easy_solved ?? 0}</div>
                <div className="text-xs text-slate-500">Easy</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-2">
                <div className="text-lg font-bold text-warning">{stats.medium_solved ?? 0}</div>
                <div className="text-xs text-slate-500">Medium</div>
              </div>
              <div className="bg-red-50 rounded-lg p-2">
                <div className="text-lg font-bold text-danger">{stats.hard_solved ?? 0}</div>
                <div className="text-xs text-slate-500">Hard</div>
              </div>
            </div>
            <ProblemBarChart
              easy={stats.easy_solved || 0}
              medium={stats.medium_solved || 0}
              hard={stats.hard_solved || 0}
            />
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 rounded-lg p-2 text-center">
                <div className="text-base font-bold text-slate-800">{stats.contest_rating ?? 0}</div>
                <div className="text-xs text-slate-500">Rating</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-2 text-center">
                <div className="text-base font-bold text-slate-800">{stats.contests_participated ?? 0}</div>
                <div className="text-xs text-slate-500">Contests</div>
              </div>
            </div>
            {stats.raw_data?.contest_history?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Contest Rating Trend</p>
                <ContestLineChart data={stats.raw_data.contest_history} />
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span>🏅</span>
              <span>{stats.badges_count ?? 0} badges earned</span>
            </div>
          </>
        )}

        {/* CodeChef specific */}
        {platform === 'codechef' && (
          <>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-amber-50 rounded-lg p-2">
                <div className="text-lg font-bold text-amber-700">{stats.total_solved ?? 0}</div>
                <div className="text-xs text-slate-500">Solved</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <div className="text-lg font-bold text-slate-800">{stats.contest_rating ?? 0}</div>
                <div className="text-xs text-slate-500">Rating</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-2">
                <div className="text-lg font-bold text-yellow-600">{stats.stars || '—'}</div>
                <div className="text-xs text-slate-500">Stars</div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-slate-800">{stats.contests_participated ?? 0}</div>
              <div className="text-xs text-slate-500">Contests Participated</div>
            </div>
          </>
        )}

        {/* HackerRank specific */}
        {platform === 'hackerrank' && (
          <>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-green-50 rounded-lg p-2">
                <div className="text-lg font-bold text-success">{stats.badges_count ?? 0}</div>
                <div className="text-xs text-slate-500">Badges</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-2">
                <div className="text-lg font-bold text-primary">{stats.certificates ?? 0}</div>
                <div className="text-xs text-slate-500">Certificates</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-2">
                <div className="text-lg font-bold text-yellow-600">{stats.stars || '—'}</div>
                <div className="text-xs text-slate-500">Stars</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
