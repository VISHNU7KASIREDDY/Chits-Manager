import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import './Header.css'

export default function Header({ title, subtitle, actions }) {
  const { user } = useAuth()
  const { unreadCount } = useNotification()
  const navigate = useNavigate()

  const handleNotificationClick = () => {
    if (user?.role === 'admin') {
      navigate('/admin/notifications')
    } else {
      navigate('/notifications')
    }
  }

  return (
    <header className="page-header">
      <div className="header-info">
        <h1 className="header-title">{title}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>
      <div className="header-actions">
        <button className="notification-btn" onClick={handleNotificationClick}>
          <span className="material-icons-round">notifications</span>
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </button>
        {actions}
      </div>
    </header>
  )
}
