import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'
import './Landing.css'

export default function About() {
  const { user } = useAuth()
  const dashboardPath = user?.role === 'admin' ? '/admin' : user?.role === 'viewer' ? '/' : '/dashboard'

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <Link to="/" className="landing-nav-brand" style={{ textDecoration: 'none' }}>
          <div className="landing-nav-logo">
            <span className="material-icons-round">account_balance</span>
          </div>
          <span className="landing-nav-name">ChitFund</span>
        </Link>
        <div className="landing-nav-actions">
          {user ? (
            <Link to={dashboardPath}>
              <button className="landing-btn-solid">
                <span className="material-icons-round" style={{ fontSize: '18px' }}>dashboard</span>
                Go to Dashboard
              </button>
            </Link>
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

      <section className="landing-hero" style={{ paddingBottom: '60px' }}>
        <div className="landing-hero-content" style={{ maxWidth: '720px' }}>
          <div className="landing-hero-tag">
            <span className="landing-hero-tag-dot"></span>
            About Us
          </div>
          <h1 className="landing-hero-title" style={{ fontSize: '42px' }}>
            Reimagining <span>Chit Funds</span> for a Digital World.
          </h1>
          <p className="landing-hero-subtitle">
            ChitFund Fintech was built with a singular mission — to bring transparency, automation, and trust to one of India's oldest and most powerful community savings systems.
          </p>
        </div>
      </section>

      <section className="landing-features">
        <div className="landing-section-header">
          <div className="landing-section-tag">Our Mission</div>
          <h2 className="landing-section-title">Empowering Communities</h2>
          <p className="landing-section-subtitle">
            We believe that financial inclusion starts with trust. Our platform digitizes the chit fund experience while preserving the community spirit that makes it unique.
          </p>
        </div>

        <div className="landing-features-grid">
          <div className="landing-feature-card">
            <div className="landing-feature-icon blue">
              <span className="material-icons-round">groups</span>
            </div>
            <h3 className="landing-feature-title">Community First</h3>
            <p className="landing-feature-desc">
              Built around the principles of mutual trust and collective benefit that have powered chit funds for generations.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="landing-feature-icon purple">
              <span className="material-icons-round">visibility</span>
            </div>
            <h3 className="landing-feature-title">Full Transparency</h3>
            <p className="landing-feature-desc">
              Every transaction, auction, and payout is recorded and visible to all members. No hidden fees, no surprises.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="landing-feature-icon emerald">
              <span className="material-icons-round">speed</span>
            </div>
            <h3 className="landing-feature-title">Modern Technology</h3>
            <p className="landing-feature-desc">
              Real-time tracking, automated calculations, and instant notifications keep everyone informed and in control.
            </p>
          </div>
        </div>
      </section>

      <section className="landing-steps">
        <div className="landing-section-header">
          <div className="landing-section-tag">Our Values</div>
          <h2 className="landing-section-title">What Drives Us</h2>
        </div>

        <div className="landing-steps-grid">
          <div className="landing-step-card">
            <div className="landing-step-number">
              <span className="material-icons-round" style={{ fontSize: '24px' }}>handshake</span>
            </div>
            <h3 className="landing-step-title">Trust</h3>
            <p className="landing-step-desc">Every feature is designed to build and maintain trust between group members and administrators.</p>
          </div>

          <div className="landing-step-card">
            <div className="landing-step-number">
              <span className="material-icons-round" style={{ fontSize: '24px' }}>equalizer</span>
            </div>
            <h3 className="landing-step-title">Fairness</h3>
            <p className="landing-step-desc">Automated calculations ensure every member receives their fair share. No human error, no bias.</p>
          </div>

          <div className="landing-step-card">
            <div className="landing-step-number">
              <span className="material-icons-round" style={{ fontSize: '24px' }}>rocket_launch</span>
            </div>
            <h3 className="landing-step-title">Innovation</h3>
            <p className="landing-step-desc">We continuously evolve our platform to serve you better with cutting-edge technology.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
