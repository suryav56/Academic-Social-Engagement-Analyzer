import { Link } from 'react-router-dom'

const features = [
  { icon: '🔗', title: 'Platform Integration', desc: 'Sync LeetCode, CodeChef & HackerRank in one click.' },
  { icon: '📊', title: 'Engagement Score', desc: 'Weighted formula gives each student a clear 0–100 score.' },
  { icon: '⚠️', title: 'Risk Detection', desc: 'Automatic risk flagging for low-engagement students.' },
  { icon: '📅', title: 'Monthly Reviews', desc: 'Schedule and track teacher-student review sessions.' },
  { icon: '🏆', title: 'Contest Tracking', desc: 'Visualise contest rating trends over time.' },
  { icon: '📈', title: 'Progress Charts', desc: 'Beautiful Recharts visualisations for every metric.' },
]

const roles = [
  {
    role: 'student',
    title: 'Student',
    icon: '🎓',
    desc: 'Track your coding progress, view platform stats, and book review sessions with your teacher.',
    color: 'border-green-200 hover:border-green-400',
    badge: 'bg-green-100 text-green-700',
  },
  {
    role: 'teacher',
    title: 'Teacher',
    icon: '👨‍🏫',
    desc: 'Monitor assigned students, manage review slots, and submit detailed performance feedback.',
    color: 'border-blue-200 hover:border-blue-400',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    role: 'admin',
    title: 'Admin',
    icon: '🛡️',
    desc: 'Manage all users, assign reviews, and get a bird\'s-eye view of institution-wide engagement.',
    color: 'border-red-200 hover:border-red-400',
    badge: 'bg-red-100 text-red-700',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-slate-100 px-8 py-4 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <span className="font-heading font-bold text-primary text-lg">SSEA</span>
        </div>
        <Link to="/login" className="btn-primary">
          Sign In →
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-24 px-8">
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-sm px-4 py-1.5 rounded-full mb-6 font-medium">
            <span className="animate-pulse-soft text-green-400">●</span> Now tracking 3 platforms
          </div>
          <h1 className="text-5xl md:text-6xl font-heading font-extrabold mb-5 leading-tight">
            Student Social<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              Engagement Analyser
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Track. Analyse. Improve.
            <br className="hidden sm:block" />
            <span className="text-slate-400 text-lg">Understand coding engagement across LeetCode, CodeChef & HackerRank — all in one place.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/login" className="btn bg-primary text-white hover:bg-primary-dark px-8 py-3 text-base shadow-lg hover:shadow-primary/25">
              Get Started →
            </Link>
            <a href="#features" className="btn border border-white/20 text-white bg-white/10 hover:bg-white/20 px-8 py-3 text-base">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Role Cards */}
      <section className="py-20 px-8 bg-surface">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-slate-800 mb-3">Choose Your Role</h2>
            <p className="text-slate-500">Log in as the role that fits you best</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {roles.map((r) => (
              <div key={r.role} className={`bg-white rounded-card shadow-card border-2 transition-all duration-200 p-6 flex flex-col ${r.color}`}>
                <div className="text-4xl mb-4">{r.icon}</div>
                <span className={`pill text-xs mb-3 self-start ${r.badge}`}>{r.title}</span>
                <h3 className="font-heading font-bold text-xl text-slate-800 mb-2">{r.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-5">{r.desc}</p>
                <Link
                  to={`/login?role=${r.role}`}
                  className="btn-primary text-center justify-center"
                >
                  Login as {r.title}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-slate-800 mb-3">Everything You Need</h2>
            <p className="text-slate-500">A complete toolkit for student engagement analytics</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-surface rounded-card border border-slate-100 p-6 card-hover">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-heading font-semibold text-slate-800 mb-1">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xl">🎓</span>
          <span className="font-heading font-bold text-white text-lg">SSEA</span>
        </div>
        <p className="text-sm">Student Social Engagement Analyser · Institutional Analytics Platform</p>
        <p className="text-xs mt-2 text-slate-600">Built with React, Express & MySQL</p>
      </footer>
    </div>
  )
}
