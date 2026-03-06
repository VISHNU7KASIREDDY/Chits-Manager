import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import LoadingScreen from '../components/LoadingScreen'
import './Login.css'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(phone, password)
      navigate(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (role) => {
    setError('')
    setDemoLoading(role)
    try {
      const res = await api.post('/demo-login', { role })
      const { token, user } = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      window.location.href = user.role === 'admin' ? '/admin' : '/dashboard'
    } catch (err) {
      setError(err.response?.data?.message || 'Demo login failed')
    } finally {
      setDemoLoading('')
    }
  }

  if (loading) {
    return <LoadingScreen message="Signing in..." subMessage="Authenticating your credentials" fullScreen={true} />
  }

  if (demoLoading) {
    return (
      <LoadingScreen 
        message="Preparing Demo" 
        subMessage={demoLoading === 'admin' ? "Logging in as Administrator" : "Logging in as Member"} 
        fullScreen={true} 
      />
    )
  }

  return (
    <main className="auth-page">
      <div className="auth-left mesh-gradient">
        <div className="auth-brand">
          <div className="auth-brand-logo">
            <span className="material-icons-round">account_balance</span>
          </div>
          <span className="auth-brand-name">ChitFund</span>
        </div>

        <div className="auth-hero glass-login-card">
          <div className="auth-tag">
            <span className="auth-tag-dot"></span>
            Fintech for the Digital Era
          </div>

          <h1 className="auth-headline">
            Modernizing Chit Funds for <span className="auth-headline-accent">Modern Wealth.</span>
          </h1>

          <p className="auth-description">
            Experience a seamless, transparent, and secure platform designed to automate your group savings and credit cycles.
          </p>

          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <span className="material-icons-round">insights</span>
              </div>
              <div>
                <h4 className="auth-feature-title">Transparent Tracking</h4>
                <p className="auth-feature-desc">Real-time ledger access for every group member.</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <span className="material-icons-round">auto_awesome</span>
              </div>
              <div>
                <h4 className="auth-feature-title">Automated Dividends</h4>
                <p className="auth-feature-desc">Instant calculations and payouts after every auction.</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <span className="material-icons-round">verified_user</span>
              </div>
              <div>
                <h4 className="auth-feature-title">Secure Vaulting</h4>
                <p className="auth-feature-desc">Enterprise-grade encryption for all financial assets.</p>
              </div>
            </div>
          </div>

          <div className="auth-trust">
            <div className="auth-avatars">
              <div className="auth-avatar-circle">
                <span className="material-icons-round" style={{fontSize: '16px'}}>person</span>
              </div>
              <div className="auth-avatar-circle">
                <span className="material-icons-round" style={{fontSize: '16px'}}>person</span>
              </div>
              <div className="auth-avatar-circle">
                <span className="material-icons-round" style={{fontSize: '16px'}}>person</span>
              </div>
              <div className="auth-avatar-count">+12k</div>
            </div>
            <p className="auth-trust-text">Trusted by 12,000+ groups worldwide</p>
          </div>
        </div>

        <div className="auth-copyright">© 2024 ChitFund Fintech Inc.</div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-mobile-brand">
            <div className="auth-brand-logo" style={{ background: 'var(--primary)' }}>
              <span className="material-icons-round" style={{ color: 'white' }}>account_balance</span>
            </div>
            <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--slate-900)' }}>ChitFund</span>
          </div>

          <div className="auth-form-header">
            <h2 className="auth-form-title">Welcome Back</h2>
            <p className="auth-form-subtitle">Manage your wealth and groups with ease.</p>
          </div>

          {error && (
            <div className="auth-error">
              <span className="material-icons-round" style={{ fontSize: '18px' }}>error</span>
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone Number</label>
              <div className="input-wrapper">
                <span className="material-icons-round input-icon">phone</span>
                <input
                  id="phone"
                  className="input-field"
                  type="text"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label" htmlFor="password">Password</label>
              </div>
              <div className="input-wrapper">
                <span className="material-icons-round input-icon">lock</span>
                <input
                  id="password"
                  className="input-field"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-icons-round">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary auth-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In to Account'}
              {!loading && <span className="material-icons-round" style={{ fontSize: '20px' }}>arrow_forward</span>}
            </button>
          </form>

          <div className="demo-divider">
            <span className="demo-divider-line"></span>
            <span className="demo-divider-text">Or try a demo</span>
            <span className="demo-divider-line"></span>
          </div>

          <div className="demo-buttons">
            <button
              className="demo-btn demo-btn-member"
              onClick={() => handleDemoLogin('member')}
              disabled={!!demoLoading}
            >
              <span className="material-icons-round" style={{ fontSize: '20px' }}>person</span>
              {demoLoading === 'member' ? 'Logging in...' : 'Login as Member'}
            </button>
            <button
              className="demo-btn demo-btn-admin"
              onClick={() => handleDemoLogin('admin')}
              disabled={!!demoLoading}
            >
              <span className="material-icons-round" style={{ fontSize: '20px' }}>admin_panel_settings</span>
              {demoLoading === 'admin' ? 'Logging in...' : 'Login as Admin'}
            </button>
          </div>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="link-primary" style={{ fontSize: '14px' }}>
                Create an account
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-system-status">
          <span className="status-dot"></span>
          <span className="status-text">SYSTEM STATUS: OPERATIONAL</span>
        </div>
      </div>
    </main>
  )
}
