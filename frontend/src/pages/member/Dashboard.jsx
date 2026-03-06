import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import Modal from '../../components/Modal'
import LoadingScreen from '../../components/LoadingScreen'
import emailjs from '@emailjs/browser'
import '../Dashboard.css'

export default function MemberDashboard() {
  const { user } = useAuth()
  const [chits, setChits] = useState([])
  const [loading, setLoading] = useState(true)
  const [paymentFilter, setPaymentFilter] = useState('all')

  useEffect(() => {
    fetchChits()
  }, [])

  const fetchChits = async () => {
    try {
      const res = await api.get('/my-chits')
      setChits(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const activeChits = chits.filter(c => c.status === 'active')
  const totalContribution = chits.reduce((sum, chit) => {
    const userSlots = (chit.members || []).filter(m => {
      const mid = typeof m === 'object' ? m._id || m : m
      return mid === user?._id
    }).length || 1
    const paidMonths = chit.months?.filter(m =>
      m.payments?.some(p => p.member === user?._id && p.isPaid)
    ).length || 0
    return sum + (paidMonths * chit.monthlyAmount * userSlots)
  }, 0)

  const nextAuction = activeChits.length > 0 ? activeChits[0] : null
  const nextAuctionMonth = nextAuction ? (nextAuction.months?.length || 0) + 1 : 0

  const getProgress = (chit) => {
    const elapsed = chit.months?.length || 0
    return Math.round((elapsed / chit.duration) * 100)
  }

  const [showJoinModal, setShowJoinModal] = useState(false)
  const [joinForm, setJoinForm] = useState({ chitValue: '', slots: 1 })
  const [joinLoading, setJoinLoading] = useState(false)

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
      from_name: user?.name || 'Member',
      from_email: user?.email || 'N/A',
      phone: user?.phone || 'N/A',
      message: `NEW CHIT JOIN REQUEST\n\nChit Value: ₹${joinForm.chitValue}\nNumber of Slots: ${joinForm.slots}\n\nPlease process this request.`,
      to_name: 'Admin',
    }
    
    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
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

  const filteredPayments = chits.flatMap(chit =>
    (chit.months || []).map((month, idx) => ({
      chit,
      month,
      idx,
      myPayment: month.payments?.find(p => p.member === user?._id)
    }))
  ).filter(item => {
    if (paymentFilter === 'all') return true
    if (paymentFilter === 'paid') return item.myPayment?.isPaid
    if (paymentFilter === 'pending') return !item.myPayment?.isPaid
    return true
  })

  return (
    <>
      <Header
        title="Member Overview"
        subtitle={`Welcome back, ${user?.name || 'Member'}. Here's your portfolio summary.`}
        actions={null}
      />

      <div className="dashboard-content">
        <div className="stats-row">
          <div className="glass-card stat-card">
            <div className="stat-card-body">
              <div>
                <p className="stat-label">Total Active Chits</p>
                <h3 className="stat-value">{String(activeChits.length).padStart(2, '0')}</h3>
                <div className="stat-trend positive">
                  <span className="material-icons-round" style={{ fontSize: '14px' }}>trending_up</span>
                  <span>Active groups</span>
                </div>
              </div>
              <div className="stat-icon-box" style={{ background: 'var(--primary-light)' }}>
                <span className="material-icons-round" style={{ color: 'var(--primary)', fontSize: '28px' }}>view_agenda</span>
              </div>
            </div>
          </div>

          {nextAuction ? (
            <div className="gradient-card">
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p className="gradient-label">NEXT AUCTION</p>
                <h3 className="gradient-value">Month {nextAuctionMonth}</h3>
                <p className="gradient-sub">{nextAuction.name}</p>
              </div>
              <div className="gradient-badge">
                <span className="material-icons-round" style={{ fontSize: '14px' }}>schedule</span>
                {activeChits.length} active group{activeChits.length !== 1 ? 's' : ''}
              </div>
              <span className="material-icons-round watermark">alarm</span>
            </div>
          ) : (
            <div className="gradient-card">
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p className="gradient-label">NO ACTIVE CHITS</p>
                <h3 className="gradient-value">Join a Group</h3>
                <p className="gradient-sub">Start your savings journey today</p>
              </div>
              <span className="material-icons-round watermark">groups</span>
            </div>
          )}

          <div className="glass-card stat-card">
            <div className="stat-card-body">
              <div>
                <p className="stat-label">Total Contribution</p>
                <h3 className="stat-value">₹{totalContribution.toLocaleString()}</h3>
                <p className="stat-sub">Paid across all groups</p>
              </div>
              <div className="stat-icon-box" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                <span className="material-icons-round" style={{ color: 'var(--emerald-600)', fontSize: '28px' }}>payments</span>
              </div>
            </div>
          </div>
        </div>

        <section>
          <div className="section-header">
            <h2 className="section-title">
              My Active Chits
              <span className="count-badge">{String(activeChits.length).padStart(2, '0')}</span>
            </h2>
            <Link to="/my-chits" className="link-primary">View All</Link>
          </div>

          <div className="chits-grid">
            {loading ? (
              <LoadingScreen fullScreen={false} message="Loading dashboard" subMessage="Fetching your portfolio..." />
            ) : activeChits.length === 0 ? (
              <div className="empty-state">No active chits found. Join a group to get started.</div>
            ) : (
              <>
                {activeChits.map((chit) => {
                  const progress = getProgress(chit)
                  return (
                    <Link to={`/chits/${chit._id}`} key={chit._id} className="glass-card chit-card">
                      <div className="chit-card-top">
                        <div
                          className="circular-progress"
                          style={{
                            background: `radial-gradient(closest-side, white 79%, transparent 80% 100%), conic-gradient(var(--primary) ${progress}%, var(--slate-200) 0)`
                          }}
                        >
                          {progress}%
                        </div>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <span className="badge badge-active" style={{ fontSize: '9px', padding: '2px 8px' }}>
                            {chit.status.toUpperCase()}
                          </span>
                          {(() => {
                            const userSlots = (chit.members || []).filter(m => {
                              const mid = typeof m === 'object' ? m._id || m : m
                              return mid === user?._id
                            }).length
                            return userSlots > 1 ? (
                              <span className="badge badge-draft" style={{ fontSize: '9px', padding: '2px 8px' }}>
                                ×{userSlots} SLOTS
                              </span>
                            ) : null
                          })()}
                        </div>
                      </div>
                      <h4 className="chit-card-name">{chit.name}</h4>
                      <p className="chit-card-id">Value: ₹{chit.chitValue?.toLocaleString()}</p>
                      <div className="chit-card-bottom">
                        <span className="chit-card-duration">{chit.months?.length || 0}/{chit.duration} Months</span>
                        <span className="chit-card-amount">₹{chit.monthlyAmount?.toLocaleString()} / mo</span>
                      </div>
                    </Link>
                  )
                })}
                <div className="chit-card-add" onClick={() => setShowJoinModal(true)} style={{ cursor: 'pointer' }}>
                  <div className="add-icon-circle">
                    <span className="material-icons-round">add</span>
                  </div>
                  <span className="add-label">Join Another Scheme</span>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="glass-card" style={{ overflow: 'hidden', border: '1px solid rgba(226, 232, 240, 0.6)' }}>
          <div className="table-header">
            <h2 className="section-title">Monthly Payment Statement</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                className="filter-select"
                style={{ padding: '6px 12px', fontSize: '12px', height: 'auto', minWidth: '140px' }}
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option value="all">All Transactions</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Chit Name</th>
                  <th>Month</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length > 0 ? (
                  filteredPayments.map(({ chit, month, idx, myPayment }) => (
                    <tr key={`${chit._id}-${idx}`}>
                      <td>
                        <p style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{chit.name}</p>
                        <p style={{ fontSize: '10px', color: 'var(--slate-400)' }}>Instalment {month.monthNumber}/{chit.duration}</p>
                      </td>
                      <td style={{ fontWeight: 600 }}>Month {month.monthNumber}</td>
                      <td style={{ fontWeight: 700, color: 'var(--slate-900)' }}>₹{chit.monthlyAmount?.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${myPayment?.isPaid ? 'badge-paid' : 'badge-pending'}`}>
                          {myPayment?.isPaid ? 'PAID' : 'PENDING'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--slate-400)', padding: '40px' }}>
                      {chits.length === 0 ? 'No chits found.' : 'No matching payment records found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <p className="table-footer-note">All payments are secured with end-to-end 256-bit encryption.</p>
          </div>
        </section>
      </div>
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
    </>
  )
}
