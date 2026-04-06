import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import LandingPage from './pages/LandingPage'
import Login from './pages/auth/Login'

import StudentDashboard from './pages/student/StudentDashboard'
import PlatformStats from './pages/student/PlatformStats'
import ReviewBooking from './pages/student/ReviewBooking'

import TeacherDashboard from './pages/teacher/TeacherDashboard'
import StudentView from './pages/teacher/StudentView'
import ReviewManagement from './pages/teacher/ReviewManagement'

import AdminDashboard from './pages/admin/AdminDashboard'
import ManageUsers from './pages/admin/ManageUsers'
import AssignReviews from './pages/admin/AssignReviews'

function PrivateRoute({ children, role }) {
  const { user, token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  if (role && user?.role !== role) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />

      {/* Student */}
      <Route path="/student/dashboard" element={<PrivateRoute role="student"><StudentDashboard /></PrivateRoute>} />
      <Route path="/student/stats" element={<PrivateRoute role="student"><PlatformStats /></PrivateRoute>} />
      <Route path="/student/book-review" element={<PrivateRoute role="student"><ReviewBooking /></PrivateRoute>} />

      {/* Teacher */}
      <Route path="/teacher/dashboard" element={<PrivateRoute role="teacher"><TeacherDashboard /></PrivateRoute>} />
      <Route path="/teacher/student/:id" element={<PrivateRoute role="teacher"><StudentView /></PrivateRoute>} />
      <Route path="/teacher/reviews" element={<PrivateRoute role="teacher"><ReviewManagement /></PrivateRoute>} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
      <Route path="/admin/users" element={<PrivateRoute role="admin"><ManageUsers /></PrivateRoute>} />
      <Route path="/admin/reviews" element={<PrivateRoute role="admin"><AssignReviews /></PrivateRoute>} />
      <Route path="/admin/student/:id" element={<PrivateRoute role="admin"><StudentView /></PrivateRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
