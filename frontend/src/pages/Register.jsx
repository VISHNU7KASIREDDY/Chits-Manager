import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Register() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await register(name, phone, password)
      navigate(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
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
            Join the Future of Savings
          </div>

          <h1 className="auth-headline">
            Start Your Savings <span className="auth-headline-accent">Journey Today.</span>
          </h1>

          <p className="auth-description">
            Join thousands of groups managing their chit funds digitally with complete transparency and security.
          </p>

          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <span className="material-icons-round">rocket_launch</span>
              </div>
              <div>
                <h4 className="auth-feature-title">Quick Onboarding</h4>
                <p className="auth-feature-desc">Get started in under 2 minutes with simple verification.</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <span className="material-icons-round">groups</span>
              </div>
              <div>
                <h4 className="auth-feature-title">Join Active Groups</h4>
                <p className="auth-feature-desc">Browse and join verified chit fund groups instantly.</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <span className="material-icons-round">shield</span>
              </div>
              <div>
                <h4 className="auth-feature-title">Bank-Grade Security</h4>
                <p className="auth-feature-desc">256-bit encryption for all your financial data.</p>
              </div>
            </div>
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
            <h2 className="auth-form-title">Create Account</h2>
            <p className="auth-form-subtitle">Start managing your chit funds digitally.</p>
          </div>

          {error && (
            <div className="auth-error">
              <span className="material-icons-round" style={{ fontSize: '18px' }}>error</span>
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <span className="material-icons-round input-icon">person</span>
                <input
                  id="name"
                  className="input-field"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

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
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="material-icons-round input-icon">lock</span>
                <input
                  id="password"
                  className="input-field"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
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
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <span className="material-icons-round" style={{ fontSize: '20px' }}>arrow_forward</span>}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="link-primary" style={{ fontSize: '14px' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
