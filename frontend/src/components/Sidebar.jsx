import { NavLink, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Sidebar.css'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const memberLinks = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/my-chits', icon: 'layers', label: 'My Chits' },
    { path: '/payments', icon: 'receipt_long', label: 'Payments' },
    { path: '/profile', icon: 'person', label: 'Profile' },
    { path: '/about', icon: 'info', label: 'About Us' },
    { path: '/contact', icon: 'mail', label: 'Contact' },
  ]

  const adminLinks = [
    { path: '/admin', icon: 'dashboard', label: 'Dashboard' },
    { path: '/admin/chits', icon: 'account_tree', label: 'Manage Chits' },
    { path: '/admin/users', icon: 'people', label: 'User Management' },
    { path: '/admin/notifications', icon: 'notifications', label: 'Notifications' },
    { path: '/profile', icon: 'person', label: 'Profile' },
    { path: '/about', icon: 'info', label: 'About Us' },
    { path: '/contact', icon: 'mail', label: 'Contact' },
  ]

  const links = isAdmin ? adminLinks : memberLinks

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <span className="material-icons-round">account_balance_wallet</span>
        </div>
        <span className="sidebar-name">ChitFund</span>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/admin' || link.path === '/dashboard'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-item-active' : ''}`
            }
          >
            <span className="material-icons-round">{link.icon}</span>
            <span className="sidebar-link-label">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-link" onClick={handleLogout}>
          <span className="material-icons-round">logout</span>
          <span className="sidebar-link-label">Logout</span>
        </button>
        <Link to="/profile" className="sidebar-profile" style={{ textDecoration: 'none', cursor: 'pointer' }}>
          <div className="sidebar-avatar">
            <span className="material-icons-round">person</span>
          </div>
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{user?.name || 'User'}</p>
            <p className="sidebar-user-role">{isAdmin ? 'Admin' : 'Member'}</p>
          </div>
        </Link>
      </div>
    </aside>
  )
}
