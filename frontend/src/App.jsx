import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import ScrollToTop from './components/ScrollToTop'
import DashboardLayout from './components/DashboardLayout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import MemberDashboard from './pages/member/Dashboard'
import MyChits from './pages/member/MyChits'
import Payments from './pages/member/Payments'
import ChitDetail from './pages/member/ChitDetail'
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminChits from './pages/admin/Chits'
import AdminChitDetail from './pages/admin/ChitDetail'
import Notifications from './pages/admin/Notifications'
import About from './pages/About'
import Contact from './pages/Contact'
import Profile from './pages/Profile'
import LoadingScreen from './components/LoadingScreen'

function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />
    if (user.role === 'viewer') return <Navigate to="/" replace />
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

function AuthRedirect({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />
    if (user.role === 'viewer') return <Navigate to="/" replace />
    return <Navigate to="/dashboard" replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
            <Route path="/register" element={<AuthRedirect><Register /></AuthRedirect>} />

            <Route element={<ProtectedRoute allowedRoles={['member']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<MemberDashboard />} />
                <Route path="/my-chits" element={<MyChits />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/chits/:id" element={<ChitDetail />} />
                <Route path="/notifications" element={<Notifications />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/chits" element={<AdminChits />} />
                <Route path="/admin/chits/:id" element={<AdminChitDetail />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/notifications" element={<Notifications />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['member', 'viewer', 'admin']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Route>

            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
