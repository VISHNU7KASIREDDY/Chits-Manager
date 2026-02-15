import { useState, useEffect } from 'react'
import Header from '../../components/Header'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import '../Dashboard.css'

export default function Payments() {
  const { user } = useAuth()
  const [chits, setChits] = useState([])
  const [loading, setLoading] = useState(true)

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

  const allPayments = chits.flatMap(chit => {
    const slotCountMap = {}
    ;(chit.members || []).forEach(m => {
      const mid = typeof m === 'object' ? m._id || m : m
      if (mid === user?._id) slotCountMap[mid] = (slotCountMap[mid] || 0) + 1
    })
    const userSlots = slotCountMap[user?._id] || 1

    return (chit.months || []).flatMap(month => {
      const myPayments = month.payments?.filter(p => p.member === user?._id) || []
      return myPayments.map((p, slotIdx) => ({
        chitName: chit.name,
        chitId: chit._id,
        monthNumber: month.monthNumber,
        duration: chit.duration,
        amount: chit.monthlyAmount,
        isPaid: p.isPaid || false,
        paidDate: p.paidDate || null,
        slotLabel: userSlots > 1 ? `Slot ${slotIdx + 1}` : null,
        userSlots
      }))
    })
  }).sort((a, b) => b.monthNumber - a.monthNumber)

  const totalAmountDue = allPayments.reduce((sum, p) => sum + p.amount, 0)
  const totalPaid = allPayments.filter(p => p.isPaid).reduce((sum, p) => sum + p.amount, 0)
  const balance = totalAmountDue - totalPaid
  const paidCount = allPayments.filter(p => p.isPaid).length
  const pendingCount = allPayments.filter(p => !p.isPaid).length

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <>
      <Header
        title="Payments"
        subtitle="Track all your payment activity across chit groups."
      />

      <div className="dashboard-content">
        <div className="stats-row">
          <div className="glass-card stat-card">
            <div className="stat-card-body">
              <div>
                <p className="stat-label">Total Amount Due</p>
                <h3 className="stat-value">₹{totalAmountDue.toLocaleString()}</h3>
                <p className="stat-sub">{allPayments.length} instalments total</p>
              </div>
              <div className="stat-icon-box" style={{ background: 'var(--primary-light)' }}>
                <span className="material-icons-round" style={{ color: 'var(--primary)', fontSize: '28px' }}>receipt_long</span>
              </div>
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-card-body">
              <div>
                <p className="stat-label">Amount Paid</p>
                <h3 className="stat-value" style={{ color: 'var(--emerald-600)' }}>₹{totalPaid.toLocaleString()}</h3>
                <div className="stat-trend positive">
                  <span className="material-icons-round" style={{ fontSize: '14px' }}>check_circle</span>
                  <span>{paidCount} paid</span>
                </div>
              </div>
              <div className="stat-icon-box" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                <span className="material-icons-round" style={{ color: 'var(--emerald-600)', fontSize: '28px' }}>payments</span>
              </div>
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-card-body">
              <div>
                <p className="stat-label">Balance Pending</p>
                <h3 className="stat-value" style={{ color: balance > 0 ? 'var(--amber-600)' : 'var(--emerald-600)' }}>₹{balance.toLocaleString()}</h3>
                {pendingCount > 0 ? (
                  <div className="stat-trend negative">
                    <span className="material-icons-round" style={{ fontSize: '14px' }}>pending</span>
                    <span>{pendingCount} pending</span>
                  </div>
                ) : (
                  <div className="stat-trend positive">
                    <span className="material-icons-round" style={{ fontSize: '14px' }}>done_all</span>
                    <span>All clear</span>
                  </div>
                )}
              </div>
              <div className="stat-icon-box" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                <span className="material-icons-round" style={{ color: 'var(--amber-600)', fontSize: '28px' }}>account_balance_wallet</span>
              </div>
            </div>
          </div>
        </div>

        <section className="glass-card" style={{ overflow: 'hidden', border: '1px solid rgba(226, 232, 240, 0.6)' }}>
          <div className="table-header">
            <h2 className="section-title">
              Payment History
              <span className="count-badge">{String(allPayments.length).padStart(2, '0')}</span>
            </h2>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Chit Name</th>
                  <th>Month</th>
                  <th>Amount</th>
                  <th>Payment Status</th>
                  <th>Paid Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--slate-400)', padding: '40px' }}>Loading...</td>
                  </tr>
                ) : allPayments.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--slate-400)', padding: '40px' }}>
                      No payment records yet.
                    </td>
                  </tr>
                ) : (
                  allPayments.map((p, idx) => (
                    <tr key={idx}>
                      <td>
                        <p style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{p.chitName}</p>
                        <p style={{ fontSize: '10px', color: 'var(--slate-400)' }}>Instalment {p.monthNumber}/{p.duration}{p.slotLabel ? ` • ${p.slotLabel}` : ''}</p>
                      </td>
                      <td style={{ fontWeight: 600 }}>Month {p.monthNumber}</td>
                      <td style={{ fontWeight: 700, color: 'var(--slate-900)' }}>₹{p.amount?.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${p.isPaid ? 'badge-paid' : 'badge-pending'}`}>
                          {p.isPaid ? 'PAID' : 'PENDING'}
                        </span>
                      </td>
                      <td style={{ fontSize: '13px', color: 'var(--slate-500)' }}>{formatDate(p.paidDate)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <p className="table-footer-note">All payments are secured with end-to-end 256-bit encryption.</p>
          </div>
        </section>
      </div>
    </>
  )
}
