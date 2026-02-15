import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import '../Dashboard.css'

export default function MyChits() {
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

  const getProgress = (chit) => {
    const elapsed = chit.months?.length || 0
    return Math.round((elapsed / chit.duration) * 100)
  }

  const getLastAuction = (chit) => {
    if (!chit.months || chit.months.length === 0) return null
    return chit.months[chit.months.length - 1]
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <>
      <Header
        title="My Chits"
        subtitle="All your enrolled chit groups with detailed information."
      />

      <div className="dashboard-content">
        {loading ? (
          <div className="empty-state">Loading chits...</div>
        ) : chits.length === 0 ? (
          <div className="empty-state">
            <span className="material-icons-round" style={{ fontSize: '48px', color: 'var(--slate-300)', marginBottom: '16px' }}>layers</span>
            <p>No chits found. Join a group to get started.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {chits.map((chit) => {
              const progress = getProgress(chit)
              const lastAuction = getLastAuction(chit)
              const monthsCompleted = chit.months?.length || 0
              const userSlots = (chit.members || []).filter(m => {
                const mid = typeof m === 'object' ? m._id || m : m
                return mid === user?._id
              }).length || 1
              const myPaidPayments = chit.months?.reduce((sum, m) =>
                sum + (m.payments?.filter(p => p.member === user?._id && p.isPaid).length || 0)
              , 0) || 0
              const totalExpectedPayments = monthsCompleted * userSlots

              return (
                <Link to={`/chits/${chit._id}`} key={chit._id} className="glass-card" style={{ padding: '28px', textDecoration: 'none', color: 'inherit', borderRadius: 'var(--radius-2xl)', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                        <h3 style={{ fontWeight: 800, fontSize: '18px', color: 'var(--slate-900)' }}>{chit.name}</h3>
                        <span className={`badge badge-${chit.status}`} style={{ fontSize: '9px', padding: '2px 10px' }}>
                          {chit.status?.toUpperCase()}
                        </span>
                        {userSlots > 1 && (
                          <span className="badge badge-draft" style={{ fontSize: '9px', padding: '2px 10px' }}>
                            ×{userSlots} SLOTS
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--slate-500)' }}>
                        Chit Value: <span style={{ fontWeight: 700, color: 'var(--slate-800)' }}>₹{chit.chitValue?.toLocaleString()}</span>
                        <span style={{ margin: '0 8px', color: 'var(--slate-300)' }}>•</span>
                        Monthly: <span style={{ fontWeight: 700, color: 'var(--slate-800)' }}>₹{chit.monthlyAmount?.toLocaleString()}</span>
                      </p>
                    </div>
                    <div className="circular-progress" style={{
                      width: '52px', height: '52px', fontSize: '12px', fontWeight: 800,
                      background: `radial-gradient(closest-side, white 79%, transparent 80% 100%), conic-gradient(var(--primary) ${progress}%, var(--slate-200) 0)`
                    }}>
                      {progress}%
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ padding: '14px', background: 'var(--slate-50)', borderRadius: 'var(--radius-xl)' }}>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--slate-500)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Start Date</p>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--slate-800)' }}>{formatDate(chit.startDate)}</p>
                    </div>
                    <div style={{ padding: '14px', background: 'var(--slate-50)', borderRadius: 'var(--radius-xl)' }}>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--slate-500)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>End Date</p>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--slate-800)' }}>{formatDate(chit.endDate)}</p>
                    </div>
                    <div style={{ padding: '14px', background: 'var(--slate-50)', borderRadius: 'var(--radius-xl)' }}>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--slate-500)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Months Done</p>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--slate-800)' }}>{monthsCompleted} / {chit.duration}</p>
                    </div>
                    <div style={{ padding: '14px', background: 'var(--slate-50)', borderRadius: 'var(--radius-xl)' }}>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--slate-500)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>My Slots</p>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>×{userSlots}</p>
                    </div>
                    <div style={{ padding: '14px', background: 'var(--slate-50)', borderRadius: 'var(--radius-xl)' }}>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--slate-500)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Paid</p>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: myPaidPayments === totalExpectedPayments ? 'var(--emerald-600)' : 'var(--amber-600)' }}>{myPaidPayments} / {totalExpectedPayments}</p>
                    </div>
                  </div>

                  {lastAuction && (
                    <div style={{ padding: '14px 18px', background: 'linear-gradient(135deg, var(--primary-light), rgba(99, 102, 241, 0.06))', borderRadius: 'var(--radius-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="material-icons-round" style={{ fontSize: '20px', color: 'var(--primary)' }}>gavel</span>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>Last Auction — Month {lastAuction.monthNumber}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '20px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--slate-600)' }}>
                          Bid: <span style={{ fontWeight: 700, color: 'var(--slate-800)' }}>₹{lastAuction.auctionAmount?.toLocaleString()}</span>
                        </span>
                        {lastAuction.winner && (
                          <span style={{ fontSize: '13px', color: 'var(--slate-600)' }}>
                            Winner: <span style={{ fontWeight: 700, color: 'var(--slate-800)' }}>{typeof lastAuction.winner === 'object' ? lastAuction.winner.name : 'Member'}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
