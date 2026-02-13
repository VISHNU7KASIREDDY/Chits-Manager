import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Footer.css'

export default function Footer() {
  const { user } = useAuth()
  const dashboardPath = user?.role === 'admin' ? '/admin' : '/dashboard'

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="material-icons-round" style={{ fontSize: '18px' }}>account_balance</span>
          </div>
          <span className="footer-name">ChitFund</span>
        </div>
        <div className="footer-links">
          <Link to="/about" className="footer-link">About Us</Link>
          <Link to="/contact" className="footer-link">Contact</Link>
          {user ? (
            <>
              <Link to={dashboardPath} className="footer-link">Dashboard</Link>
              <Link to="/profile" className="footer-link">Profile</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="footer-link">Sign In</Link>
              <Link to="/register" className="footer-link">Register</Link>
            </>
          )}
        </div>
        <span className="footer-copy">© 2025 ChitFund Fintech Inc. All rights reserved.</span>
      </div>
    </footer>
  )
}
