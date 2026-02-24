import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'
import './Landing.css'

export default function Contact() {
  const { user } = useAuth()
  const dashboardPath = user?.role === 'admin' ? '/admin' : user?.role === 'viewer' ? '/' : '/dashboard'
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
      alert('EmailJS credentials not configured in environment variables.')
      return
    }

    const templateParams = {
      from_name: form.name,
      from_email: form.email,
      phone: form.phone,
      message: form.message,
      to_name: 'ChitFund Admin',
    }

    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        setSubmitted(true)
        setForm({ name: '', email: '', phone: '', message: '' })
        setTimeout(() => setSubmitted(false), 4000)
      }, (err) => {
        console.error('FAILED...', err)
        alert('Failed to send message. Please try again later.')
      })
  }

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
            Contact Us
          </div>
          <h1 className="landing-hero-title" style={{ fontSize: '42px' }}>
            We'd Love to <span>Hear From You.</span>
          </h1>
          <p className="landing-hero-subtitle">
            Have questions about ChitFund or want to learn more? Drop us a message and our team will get back to you within 24 hours.
          </p>
        </div>
      </section>

      <section className="landing-features" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '16px' }}>Get In Touch</h2>
            <p style={{ fontSize: '15px', color: 'var(--slate-500)', lineHeight: 1.7, marginBottom: '40px' }}>
              Whether you're a chit fund organizer looking to go digital or a member wanting to join, we're here to help.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="landing-feature-icon blue" style={{ width: '48px', height: '48px', marginBottom: 0, flexShrink: 0 }}>
                  <span className="material-icons-round" style={{ fontSize: '22px' }}>email</span>
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--slate-800)', fontSize: '14px' }}>Email</p>
                  <p style={{ color: 'var(--slate-500)', fontSize: '14px' }}>support@chitfund.in</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="landing-feature-icon purple" style={{ width: '48px', height: '48px', marginBottom: 0, flexShrink: 0 }}>
                  <span className="material-icons-round" style={{ fontSize: '22px' }}>phone</span>
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--slate-800)', fontSize: '14px' }}>Phone</p>
                  <p style={{ color: 'var(--slate-500)', fontSize: '14px' }}>+91 98765 43210</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="landing-feature-icon emerald" style={{ width: '48px', height: '48px', marginBottom: 0, flexShrink: 0 }}>
                  <span className="material-icons-round" style={{ fontSize: '22px' }}>location_on</span>
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--slate-800)', fontSize: '14px' }}>Office</p>
                  <p style={{ color: 'var(--slate-500)', fontSize: '14px' }}>Hyderabad, Telangana, India</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--white)', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-2xl)', padding: '32px', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
            {submitted && (
              <div style={{ background: 'var(--emerald-50)', color: 'var(--emerald-700)', padding: '12px 16px', borderRadius: 'var(--radius-xl)', fontSize: '14px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-icons-round" style={{ fontSize: '18px' }}>check_circle</span>
                Message sent! We'll get back to you soon.
              </div>
            )}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--slate-700)', display: 'block', marginBottom: '6px' }}>Full Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Your name" style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-xl)', fontSize: '14px', fontFamily: 'var(--font)', background: 'var(--slate-50)', transition: 'border-color 0.2s', outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--slate-700)', display: 'block', marginBottom: '6px' }}>Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="you@email.com" style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-xl)', fontSize: '14px', fontFamily: 'var(--font)', background: 'var(--slate-50)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--slate-700)', display: 'block', marginBottom: '6px' }}>Phone</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Optional" style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-xl)', fontSize: '14px', fontFamily: 'var(--font)', background: 'var(--slate-50)', outline: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--slate-700)', display: 'block', marginBottom: '6px' }}>Message</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows="4" placeholder="How can we help?" style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-xl)', fontSize: '14px', fontFamily: 'var(--font)', background: 'var(--slate-50)', resize: 'vertical', outline: 'none' }} />
              </div>
              <button type="submit" className="landing-hero-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '4px' }}>
                Send Message
                <span className="material-icons-round" style={{ fontSize: '20px' }}>send</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
