import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinks = {
  student: [
    { to: '/student/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/student/stats', label: 'My Stats', icon: '📈' },
    { to: '/student/book-review', label: 'Book Review', icon: '📅' },
  ],
  teacher: [
    { to: '/teacher/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/teacher/reviews', label: 'Reviews', icon: '📋' },
  ],
  admin: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/admin/users', label: 'Manage Users', icon: '👥' },
    { to: '/admin/reviews', label: 'Assign Reviews', icon: '📋' },
  ],
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const links = navLinks[user?.role] || []

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-100 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <div>
            <div className="text-sm font-bold font-heading text-primary leading-tight">SSEA</div>
            <div className="text-xs text-slate-400 leading-tight">Engagement Analyser</div>
          </div>
        </div>
      </div>

      {/* Role Badge */}
      <div className="px-4 pt-4 pb-2">
        <span className={`pill text-xs ${
          user?.role === 'admin' ? 'pill-red' :
          user?.role === 'teacher' ? 'pill-blue' : 'pill-green'
        }`}>
          {user?.role?.toUpperCase()}
        </span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 pb-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info + Logout */}
      <div className="px-4 py-4 border-t border-slate-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-outline w-full justify-center text-xs py-2">
          🚪 Logout
        </button>
      </div>
    </aside>
  )
}
