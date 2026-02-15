import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../../components/Header'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import '../Dashboard.css'

export default function ChitDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [chit, setChit] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChit()
  }, [id])

  const fetchChit = async () => {
    try {
      const res = await api.get(`/my-chits/${id}`)
      setChit(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleParticipate = async (monthNumber) => {
    try {
      if (!window.confirm('Are you sure you want to participate in this auction?')) return
      await api.post(`/my-chits/${id}/participate`, { monthNumber })
      alert('Participation registered successfully!')
      fetchChit()
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Failed to participate')
    }
  }

  const getMonthDate = (monthNumber) => {
    if (!chit?.startDate) return ''
    const d = new Date(chit.startDate)
    d.setMonth(d.getMonth() + monthNumber - 1)
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  if (loading) return <div className="empty-state" style={{ padding: '100px' }}>Loading chit details...</div>
  if (!chit) return <div className="empty-state" style={{ padding: '100px' }}>Chit not found.</div>

  const progress = Math.round(((chit.months?.length || 0) / chit.duration) * 100)
  const totalCollected = (chit.months?.length || 0) * chit.monthlyAmount * chit.totalMembers
  const totalDistributed = chit.months?.reduce((sum, m) => sum + (m.auctionAmount || 0), 0) || 0

  const isLifted = (chit.liftedMembers || []).includes(user._id)

  return (
    <>
      <Header
        title="Chit Details"
        subtitle="View complete analytics and history"
      />

      <div className="dashboard-content">
        <div className="detail-breadcrumb">
          <Link to="/dashboard">Dashboard</Link>
          <span className="material-icons-round" style={{ fontSize: '16px' }}>chevron_right</span>
          <Link to="/dashboard">My Chits</Link>
          <span className="material-icons-round" style={{ fontSize: '16px' }}>chevron_right</span>
          <span className="chit-id">{chit.name}</span>
        </div>

        <div className="detail-header">
          <div>
            <h2 className="detail-title">{chit.name}</h2>
            <div className="detail-meta">
              <span className={`badge badge-${chit.status}`}>{chit.status?.toUpperCase()}</span>
              {isLifted && (
                <>
                  <span style={{ color: 'var(--slate-300)' }}>•</span>
                  <span className="badge badge-paid" style={{ background: 'var(--emerald-100)', color: 'var(--emerald-700)', borderColor: 'var(--emerald-200)' }}>
                    LIFTED
                  </span>
                </>
              )}
              <span style={{ color: 'var(--slate-300)' }}>•</span>
              <span>{chit.duration} Month Cycle</span>
              <span style={{ color: 'var(--slate-300)' }}>•</span>
              <span>{chit.totalMembers} Members</span>
            </div>
          </div>
        </div>

        <div className="glass-card value-card">
          <div className="value-main">
            <span className="value-label">Total Chit Value</span>
            <span className="value-amount">₹{chit.chitValue?.toLocaleString()}</span>
            <div className="value-trend">
              <span className="positive">↑ Monthly ₹{chit.monthlyAmount?.toLocaleString()}</span>
              <span className="muted">per member instalment</span>
            </div>
          </div>
          <div className="value-secondary">
            <div className="value-sec-item">
              <span className="value-sec-label">Collected</span>
              <span className="value-sec-value">₹{totalCollected.toLocaleString()}</span>
            </div>
            <div className="value-sec-item">
              <span className="value-sec-label">Distributed</span>
              <span className="value-sec-value">₹{totalDistributed.toLocaleString()}</span>
            </div>
            <div className="value-sec-item">
              <span className="value-sec-label">Progress</span>
              <span className="value-sec-value">{progress}%</span>
            </div>
          </div>
        </div>

        <div className="detail-grid">
          <div className="glass-card members-table-card">
            <div className="members-table-header">
              <h3 style={{ fontWeight: 700 }}>Active Members</h3>
              <span className="count-badge">{chit.members?.length || 0}</span>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Months Paid</th>
                    <th>Contribution</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(chit.members || []).map((member, idx) => {
                    const memberId = typeof member === 'object' ? member._id : member
                    const memberName = typeof member === 'object' ? member.name : `Member ${idx + 1}`
                    const paidMonths = chit.months?.filter(m =>
                      m.payments?.some(p => (typeof p.member === 'object' ? p.member._id : p.member) === memberId && p.isPaid)
                    ).length || 0
                    const totalMonths = chit.months?.length || 0
                    const contribution = paidMonths * chit.monthlyAmount

                    return (
                      <tr key={memberId}>
                        <td>
                          <div className="user-name-cell">
                            <div className="user-avatar-sm">
                              <span className="material-icons-round">person</span>
                            </div>
                            <div>
                              <p style={{ fontWeight: 600, fontSize: '14px' }}>{memberName}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontWeight: 600 }}>{paidMonths}/{totalMonths}</td>
                        <td style={{ fontWeight: 700 }}>₹{contribution.toLocaleString()}</td>
                        <td>
                          <span className={`badge ${paidMonths >= totalMonths ? 'badge-paid' : 'badge-pending'}`}>
                            {paidMonths >= totalMonths ? 'PAID' : 'PENDING'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                  {(!chit.members || chit.members.length === 0) && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', color: 'var(--slate-400)', padding: '40px' }}>
                        No members found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-card">
             <h3 style={{ fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <span className="material-icons-round" style={{ color: 'var(--amber-500)' }}>campaign</span>
               Upcoming Auction
             </h3>
             {(() => {
               const latestMonth = chit.months && chit.months.length > 0 
                 ? chit.months.reduce((prev, curr) => (prev.monthNumber > curr.monthNumber) ? prev : curr)
                 : null
               
               if (!latestMonth) return <p style={{ color: 'var(--slate-400)', fontSize: '14px' }}>No active months yet.</p>
               if (latestMonth.winner) return <p style={{ color: 'var(--slate-400)', fontSize: '14px' }}>Every auction for current months has been completed.</p>

               const isParticipating = latestMonth.auctionParticipants?.includes(user._id)

               return (
                 <div style={{ background: 'var(--slate-50)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--slate-100)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                     <div>
                       <p style={{ fontWeight: 600, fontSize: '15px' }}>Month {latestMonth.monthNumber}</p>
                       <p style={{ fontSize: '13px', color: 'var(--slate-500)' }}>{getMonthDate(latestMonth.monthNumber)}</p>
                     </div>
                     {isParticipating ? (
                       <span className="badge badge-paid" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                         <span className="material-icons-round" style={{ fontSize: '14px' }}>check_circle</span>
                         Registered
                       </span>
                     ) : (
                       <button className="btn-primary" onClick={() => handleParticipate(latestMonth.monthNumber)}>
                         Participate in Auction
                       </button>
                     )}
                   </div>
                   <p style={{ fontSize: '13px', color: 'var(--slate-500)', lineHeight: 1.5 }}>
                     Click participate to let the admin know you are interested in bidding for this month's auction.
                   </p>
                 </div>
               )
             })()}
          </div>

          <div className="glass-card auction-card">
            <div className="auction-card-title">
              <span>Auction History</span>
              <span className="count-badge">{chit.months?.filter(m => m.winner).length || 0}</span>
            </div>

            {chit.months?.filter(m => m.winner).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--slate-400)', fontSize: '14px' }}>
                No auctions conducted yet.
              </div>
            ) : (
              chit.months?.filter(m => m.winner).map((month) => {
                const winnerName = typeof month.winner === 'object' ? month.winner.name : 'Winner'
                return (
                  <div className="auction-item" key={month.monthNumber}>
                    <div className="auction-icon">
                      <span className="material-icons-round" style={{ fontSize: '20px' }}>emoji_events</span>
                    </div>
                    <div className="auction-info">
                      <p className="auction-month">Month {month.monthNumber}</p>
                      <p className="auction-winner">{winnerName}</p>
                    </div>
                    <div>
                      <p className="auction-amount">₹{(month.auctionAmount || 0).toLocaleString()}</p>
                      <p className="auction-amount-label">Auction Bid</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </>
  )
}
