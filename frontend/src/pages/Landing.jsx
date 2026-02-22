import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import Footer from '../components/Footer'
import Modal from '../components/Modal'
import LoadingScreen from '../components/LoadingScreen'
import emailjs from '@emailjs/browser'
import { useState, useEffect } from 'react'
import './Landing.css'

export default function Landing() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [joinForm, setJoinForm] = useState({ chitValue: '', slots: 1 })
  const [joinLoading, setJoinLoading] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        } else {
          entry.target.classList.remove('visible')
        }
      })
    }, { threshold: 0.1 })

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [loading])

  const handleJoinSubmit = (e) => {
    e.preventDefault()

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
      alert('EmailJS credentials missing in .env file')
      return
    }

    setJoinLoading(true)

    const templateParams = {
      from_name: user?.name || 'Viewer',
      from_email: user?.email || 'N/A',
      phone: user?.phone || 'N/A',
      message: `NEW CHIT JOIN REQUEST\n\nChit Value: ₹${joinForm.chitValue}\nNumber of Slots: ${joinForm.slots}\n\nPlease process this request.`,
      to_name: 'Admin',
    }

    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then(() => {
        alert('Join request sent successfully!')
        setShowJoinModal(false)
        setJoinForm({ chitValue: '', slots: 1 })
      })
      .catch((err) => {
        console.error('EmailJS FAILED...', err)
        alert('Failed to send request.')
      })
      .finally(() => {
        setJoinLoading(false)
      })
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) return <LoadingScreen />
  if (user && user.role !== 'viewer') return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />

  const isViewer = user?.role === 'viewer'

  return (
    <div className="landing-page">
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="landing-nav-brand">
          <div className="landing-nav-logo">
            <span className="material-icons-round">account_balance</span>
          </div>
          <span className="landing-nav-name">ChitFund</span>
        </div>

        <div className="landing-nav-actions">
          <Link to="/about">
            <button className="landing-btn-ghost">About</button>
          </Link>
          <Link to="/contact">
            <button className="landing-btn-ghost">Contact</button>
          </Link>
          {isViewer ? (
            <>
              <Link to="/profile">
                <button className="landing-btn-ghost">Profile</button>
              </Link>
              <button className="landing-btn-ghost" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="landing-btn-ghost">Sign In</button>
              </Link>
              <Link to="/register">
                <button className="landing-btn-solid">Get Started</button>
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="landing-main">
        <section className="landing-hero">
          <div className="landing-hero-content animate-on-scroll">
            <div className="landing-hero-tag">
              <span className="landing-hero-tag-dot"></span>
              Fintech for the Digital Era
            </div>

            <h1 className="landing-hero-title">
              Modernizing Chit Funds for <span>Modern Wealth.</span>
            </h1>

            <p className="landing-hero-subtitle">
              Experience a seamless, transparent, and secure platform designed to automate your group savings and credit cycles with real-time tracking.
            </p>

            <div className="landing-hero-buttons">
              {isViewer ? (
                <button className="landing-hero-btn-primary" onClick={() => setShowJoinModal(true)}>
                  Join a New Group
                  <span className="material-icons-round" style={{ fontSize: '20px' }}>arrow_forward</span>
                </button>
              ) : (
                <Link to="/register">
                  <button className="landing-hero-btn-primary">
                    Join a New Group
                    <span className="material-icons-round" style={{ fontSize: '20px' }}>arrow_forward</span>
                  </button>
                </Link>
              )}
              {!isViewer && (
                <Link to="/login">
                  <button className="landing-hero-btn-outline">
                    <span className="material-icons-round" style={{ fontSize: '20px' }}>login</span>
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </div>

          <div className="landing-hero-visual animate-on-scroll stagger-2">
            <div className="landing-hero-card">
              <div className="landing-hero-floating-badge">
                <div className="landing-hero-floating-badge-icon">
                  <span className="material-icons-round" style={{ fontSize: '18px' }}>trending_up</span>
                </div>
                <div>
                  <div className="landing-hero-floating-badge-text">This Month</div>
                  <div className="landing-hero-floating-badge-value">+₹2.4L</div>
                </div>
              </div>

              <div className="landing-hero-card-header">
                <span className="landing-hero-card-title">Group Overview</span>
                <span className="landing-hero-card-badge">Active</span>
              </div>

              <div className="landing-hero-stats">
                <div className="landing-hero-stat">
                  <div className="landing-hero-stat-label">Total Pool</div>
                  <div className="landing-hero-stat-value">₹5L</div>
                </div>
                <div className="landing-hero-stat">
                  <div className="landing-hero-stat-label">Monthly EMI</div>
                  <div className="landing-hero-stat-value accent">₹25K</div>
                </div>
                <div className="landing-hero-stat">
                  <div className="landing-hero-stat-label">Duration</div>
                  <div className="landing-hero-stat-value">20 Mo</div>
                </div>
                <div className="landing-hero-stat">
                  <div className="landing-hero-stat-label">Members</div>
                  <div className="landing-hero-stat-value">20</div>
                </div>
              </div>

              <div className="landing-hero-members">
                <span className="landing-hero-members-label">Active Members</span>
                <div className="landing-hero-avatars">
                  <div className="landing-hero-avatar" style={{ background: '#6366f1' }}>V</div>
                  <div className="landing-hero-avatar" style={{ background: '#f59e0b' }}>R</div>
                  <div className="landing-hero-avatar" style={{ background: '#10b981' }}>A</div>
                  <div className="landing-hero-avatar" style={{ background: '#94a3b8' }}>+17</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-features">
          <div className="landing-section-header animate-on-scroll">
            <div className="landing-section-tag">Why ChitFund</div>
            <h2 className="landing-section-title">Built for Trust & Transparency</h2>
            <p className="landing-section-subtitle">
              Every feature is designed to give you complete control and visibility over your group savings.
            </p>
          </div>

          <div className="landing-features-grid">
            <div className="landing-feature-card animate-on-scroll stagger-1">
              <div className="landing-feature-icon blue">
                <span className="material-icons-round">notifications_active</span>
              </div>
              <h3 className="landing-feature-title">Automated Reminders</h3>
              <p className="landing-feature-desc">
                Never miss a payment with smart notifications via email and SMS.
              </p>
            </div>

            <div className="landing-feature-card animate-on-scroll stagger-2">
              <div className="landing-feature-icon purple">
                <span className="material-icons-round">gavel</span>
              </div>
              <h3 className="landing-feature-title">Digital Auctions</h3>
              <p className="landing-feature-desc">
                Participate in auctions remotely with real-time bidding and instant results.
              </p>
            </div>

            <div className="landing-feature-card animate-on-scroll stagger-3">
              <div className="landing-feature-icon emerald">
                <span className="material-icons-round">receipt_long</span>
              </div>
              <h3 className="landing-feature-title">Transparent Ledger</h3>
              <p className="landing-feature-desc">
                Real-time tracking of all payments, dividends, and group history.
              </p>
            </div>

            <div className="landing-feature-card animate-on-scroll stagger-1">
              <div className="landing-feature-icon purple">
                <span className="material-icons-round">auto_awesome</span>
              </div>
              <h3 className="landing-feature-title">Automated Dividends</h3>
              <p className="landing-feature-desc">
                Instant calculations and payouts after every auction cycle. No manual work, zero errors.
              </p>
            </div>

            <div className="landing-feature-card animate-on-scroll stagger-2">
              <div className="landing-feature-icon emerald">
                <span className="material-icons-round">verified_user</span>
              </div>
              <h3 className="landing-feature-title">Secure Vaulting</h3>
              <p className="landing-feature-desc">
                Enterprise-grade encryption for all financial data. Your money and information stay protected.
              </p>
            </div>

            <div className="landing-feature-card animate-on-scroll stagger-3">
              <div className="landing-feature-icon blue">
                <span className="material-icons-round">insights</span>
              </div>
              <h3 className="landing-feature-title">Smart Analytics</h3>
              <p className="landing-feature-desc">
                Get deep insights into your savings patterns and visualize your future wealth growth.
              </p>
            </div>
          </div>
        </section>

        <section className="landing-steps">
          <div className="landing-section-header animate-on-scroll">
            <div className="landing-section-tag">How It Works</div>
            <h2 className="landing-section-title">Get Started in 3 Steps</h2>
            <p className="landing-section-subtitle">
              Join a chit fund group and start growing your wealth in minutes.
            </p>
          </div>

          <div className="landing-steps-grid">
            <div className="landing-step-card animate-on-scroll stagger-1">
              <div className="landing-step-number">1</div>
              <h3 className="landing-step-title">Create Account</h3>
              <p className="landing-step-desc">Sign up with your phone number and get verified in seconds.</p>
              <div className="landing-step-connector"></div>
            </div>

            <div className="landing-step-card animate-on-scroll stagger-2">
              <div className="landing-step-number">2</div>
              <h3 className="landing-step-title">Join a Group</h3>
              <p className="landing-step-desc">Browse available chit fund groups and join one that fits your budget.</p>
              <div className="landing-step-connector"></div>
            </div>

            <div className="landing-step-card animate-on-scroll stagger-3">
              <div className="landing-step-number">3</div>
              <h3 className="landing-step-title">Track & Earn</h3>
              <p className="landing-step-desc">Monitor your contributions, bid in auctions, and receive payouts seamlessly.</p>
            </div>
          </div>
        </section>

        <section className="landing-cta">
          <div className="landing-cta-card mesh-gradient animate-on-scroll">
            <h2 className="landing-cta-title">Ready to Modernize Your Savings?</h2>
            <p className="landing-cta-subtitle">
              Join thousands of groups already managing their chit funds digitally.
            </p>
            {isViewer ? (
              <button className="landing-cta-btn" onClick={() => setShowJoinModal(true)}>
                Join a New Group
                <span className="material-icons-round" style={{ fontSize: '20px' }}>arrow_forward</span>
              </button>
            ) : (
              <Link to="/register">
                <button className="landing-cta-btn">
                  Start Your Free Account
                  <span className="material-icons-round" style={{ fontSize: '20px' }}>arrow_forward</span>
                </button>
              </Link>
            )}
            <span className="material-icons-round landing-cta-watermark">account_balance</span>
          </div>
        </section>
      </main>
      <Footer />

      <Modal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} title="Join New Chit">
        <form onSubmit={handleJoinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="form-label">Chit Value (₹)</label>
            <input
              type="number"
              required
              min="1000"
              placeholder="e.g. 100000"
              className="input-field"
              value={joinForm.chitValue}
              onChange={e => setJoinForm({ ...joinForm, chitValue: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">Number of Slots</label>
            <input
              type="number"
              required
              min="1"
              max="5"
              className="input-field"
              value={joinForm.slots}
              onChange={e => setJoinForm({ ...joinForm, slots: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button type="button" onClick={() => setShowJoinModal(false)} className="btn-outline">Cancel</button>
            <button type="submit" className="btn-primary" disabled={joinLoading}>
              {joinLoading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
