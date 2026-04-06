import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const [email, setEmail] = useState(
    params.get('role') === 'admin' ? 'admin@ssea.com' :
    params.get('role') === 'teacher' ? 'teacher1@ssea.com' :
    params.get('role') === 'student' ? 'student1@ssea.com' : ''
  )
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      login(res.data.token, res.data.user)
      const role = res.data.user.role
      navigate(`/${role}/dashboard`, { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-blue-400 px-8 py-7 text-white text-center">
            <div className="text-3xl mb-2">🎓</div>
            <h1 className="text-2xl font-heading font-bold">SSEA</h1>
            <p className="text-blue-100 text-sm mt-1">Student Social Engagement Analyser</p>
          </div>

          {/* Form */}
          <div className="px-8 py-7">
            <h2 className="font-heading font-bold text-xl text-slate-800 mb-5">Sign In</h2>

            {error && (
              <div className="bg-red-50 border border-red-100 text-danger rounded-lg p-3 text-sm mb-4">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" id="login-form">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@ssea.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                id="login-submit"
                type="submit"
                className="btn-primary w-full justify-center py-2.5 mt-2"
                disabled={loading}
              >
                {loading ? '⏳ Signing in...' : '→ Sign In'}
              </button>
            </form>

            {/* Demo creds hint */}
            <div className="mt-5 bg-slate-50 border border-slate-100 rounded-lg p-3 text-xs text-slate-500">
              <p className="font-semibold text-slate-600 mb-1">Demo Credentials</p>
              <p>Admin: admin@ssea.com / Admin@1234</p>
              <p>Teacher: teacher1@ssea.com / Teacher@1234</p>
              <p>Student: student1@ssea.com / Student@1234</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="text-slate-300 hover:text-white text-sm transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
