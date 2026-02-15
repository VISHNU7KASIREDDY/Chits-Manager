import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../../components/Header'
import api from '../../services/api'
import '../Dashboard.css'

export default function AdminChitDetail() {
  const { id } = useParams()
  const [chit, setChit] = useState(null)
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showMonthModal, setShowMonthModal] = useState(false)
  const [showMemberModal, setShowMemberModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [monthForm, setMonthForm] = useState({ monthNumber: '', auctionAmount: '', winner: '' })
  const [editForm, setEditForm] = useState({ name: '', chitValue: '', monthlyAmount: '', totalMembers: '', duration: '', startDate: '', endDate: '' })
  const [selectedMemberId, setSelectedMemberId] = useState('')
  const [slotsCount, setSlotsCount] = useState(1)
  const [memberSearch, setMemberSearch] = useState('')
  const [expandedMonths, setExpandedMonths] = useState(new Set())
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      const [chitRes, usersRes] = await Promise.all([
        api.get(`/admin/chits/${id}`),
        api.get('/admin/users/')
      ])
      setChit(chitRes.data)
      setAllUsers(usersRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchChit = async () => {
    try {
      const res = await api.get(`/admin/chits/${id}`)
      setChit(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddMonth = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        monthNumber: Number(monthForm.monthNumber),
        auctionAmount: Number(monthForm.auctionAmount),
        winner: monthForm.winner || undefined
      }
      await api.post(`/admin/chits/${id}/months`, payload)
      setShowMonthModal(false)
      setMonthForm({ monthNumber: '', auctionAmount: '', winner: '' })
      fetchChit()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add month data')
    }
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post(`/admin/chits/${id}/members`, { members: [selectedMemberId], slots: slotsCount })
      setShowMemberModal(false)
      setSelectedMemberId('')
      setSlotsCount(1)
      setMemberSearch('')
      fetchChit()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member')
    }
  }

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Remove this member?')) return
    try {
      await api.delete(`/admin/chits/${id}/members/${memberId}`)
      fetchChit()
    } catch (err) {
      console.error(err)
    }
  }

  const togglePayment = async (monthNumber, memberId, isPaid, paymentIndex) => {
    try {
      await api.put(`/admin/chits/${id}/months/payments`, { monthNumber, memberId, isPaid: !isPaid, paymentIndex })
      fetchChit()
    } catch (err) {
      console.error(err)
    }
  }

  const markAllPaid = async (monthNumber) => {
    if (!window.confirm(`Mark all payments for Month ${monthNumber} as paid?`)) return
    try {
      await api.put(`/admin/chits/${id}/months/payments/mark-all-paid`, { monthNumber })
      fetchChit()
    } catch (err) {
      console.error(err)
    }
  }

  const openEditModal = () => {
    setEditForm({
      name: chit.name || '',
      chitValue: String(chit.chitValue || ''),
      monthlyAmount: String(chit.monthlyAmount || ''),
      totalMembers: String(chit.totalMembers || ''),
      duration: String(chit.duration || ''),
      startDate: chit.startDate ? new Date(chit.startDate).toISOString().split('T')[0] : '',
      endDate: chit.endDate ? new Date(chit.endDate).toISOString().split('T')[0] : ''
    })
    setError('')
    setShowEditModal(true)
  }

  const handleEditChit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.put(`/admin/chits/${id}`, {
        ...editForm,
        chitValue: Number(editForm.chitValue),
        monthlyAmount: Number(editForm.monthlyAmount),
        totalMembers: Number(editForm.totalMembers),
        duration: Number(editForm.duration)
      })
      setShowEditModal(false)
      fetchChit()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update chit')
    }
  }

  if (loading) return <div className="empty-state" style={{ padding: '100px' }}>Loading...</div>
  if (!chit) return <div className="empty-state" style={{ padding: '100px' }}>Chit not found.</div>

  const progress = Math.round(((chit.months?.length || 0) / chit.duration) * 100)
  const totalCollected = (chit.months?.length || 0) * chit.monthlyAmount * (chit.members?.length || 0)

  const existingMemberIds = (chit.members || []).map(m => typeof m === 'object' ? m._id : m)
  const availableUsers = allUsers

  const getMonthDate = (monthNumber) => {
    if (!chit?.startDate) return ''
    const d = new Date(chit.startDate)
    d.setMonth(d.getMonth() + monthNumber - 1)
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const handleLiftedToggle = async (memberId) => {
    try {
      await api.put(`/admin/chits/${id}/lifted/${memberId}`)
      fetchChit()
    } catch (err) {
      console.error(err)
      alert('Failed to update lifted status')
    }
  }

  const handleSendReminder = async (monthNumber) => {
    if (!window.confirm(`Send auction reminder for Month ${monthNumber} to all members?`)) return
    try {
      await api.post(`/admin/chits/${id}/months/send-reminders`, { monthNumber })
      alert('Reminders sent successfully!')
    } catch (err) {
      console.error(err)
      alert('Failed to send reminders')
    }
  }

  const nextMonth = (chit.months?.length || 0) + 1
  const isCompleted = (chit.months?.length || 0) >= chit.duration

  return (
    <>
      <Header
        title="Chit Details"
        subtitle="Manage months, members, and payments."
        actions={
          <div style={{ display: 'flex', gap: '12px' }}>
            {!isCompleted && (
              <button 
                className="btn-outline" 
                style={{ padding: '10px 16px', fontSize: '13px', borderColor: 'var(--amber-200)', color: 'var(--amber-700)', background: 'var(--amber-50)' }} 
                onClick={() => handleSendReminder(nextMonth)}
              >
                <span className="material-icons-round" style={{ fontSize: '16px', color: 'var(--amber-500)' }}>notifications_active</span>
                Remind Month {nextMonth}
              </button>
            )}
            <button className="btn-outline" style={{ padding: '10px 16px', fontSize: '13px' }} onClick={openEditModal}>
              <span className="material-icons-round" style={{ fontSize: '16px' }}>edit</span>
              Edit Chit
            </button>
            <button className="btn-outline" style={{ padding: '10px 16px', fontSize: '13px' }} onClick={() => { setShowMemberModal(true); setError('') }}>
              <span className="material-icons-round" style={{ fontSize: '16px' }}>person_add</span>
              Add Member
            </button>
            <button className="btn-primary" style={{ padding: '10px 16px', fontSize: '13px' }} onClick={() => { setShowMonthModal(true); setError(''); setMonthForm({ ...monthForm, monthNumber: String((chit.months?.length || 0) + 1) }) }}>
              <span className="material-icons-round" style={{ fontSize: '16px' }}>add</span>
              Add Month
            </button>
          </div>
        }
      />

      <div className="dashboard-content">
        <div className="detail-breadcrumb">
          <Link to="/admin">Dashboard</Link>
          <span className="material-icons-round" style={{ fontSize: '16px' }}>chevron_right</span>
          <Link to="/admin/chits">Chit Management</Link>
          <span className="material-icons-round" style={{ fontSize: '16px' }}>chevron_right</span>
          <span className="chit-id">{chit.name}</span>
        </div>

        <div className="detail-header">
          <div>
            <h2 className="detail-title">{chit.name}</h2>
            <div className="detail-meta">
              <span className={`badge badge-${chit.status}`}>{chit.status?.toUpperCase()}</span>
              <span style={{ color: 'var(--slate-300)' }}>•</span>
              <span>{chit.duration} months</span>
              <span style={{ color: 'var(--slate-300)' }}>•</span>
              <span>{chit.members?.length || 0}/{chit.totalMembers} members</span>
            </div>
          </div>
        </div>

        <div className="stats-row">
          <div className="glass-card stat-card">
            <div className="stat-card-body">
              <div>
                <p className="stat-label">Chit Value</p>
                <h3 className="stat-value">₹{chit.chitValue?.toLocaleString()}</h3>
                <p className="stat-sub">Monthly: ₹{chit.monthlyAmount?.toLocaleString()}</p>
              </div>
              <div className="stat-icon-box" style={{ background: 'var(--primary-light)' }}>
                <span className="material-icons-round" style={{ color: 'var(--primary)', fontSize: '28px' }}>account_balance_wallet</span>
              </div>
            </div>
          </div>

          <div className="gradient-card">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p className="gradient-label">Progress</p>
              <h3 className="gradient-value">{chit.months?.length || 0}/{chit.duration} months</h3>
              <p className="gradient-sub">{progress}% complete</p>
            </div>
            <span className="material-icons-round watermark">timeline</span>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-card-body">
              <div>
                <p className="stat-label">Total Collected</p>
                <h3 className="stat-value">₹{totalCollected.toLocaleString()}</h3>
                <p className="stat-sub">Across {chit.months?.length || 0} months</p>
              </div>
              <div className="stat-icon-box" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                <span className="material-icons-round" style={{ color: 'var(--emerald-600)', fontSize: '28px' }}>savings</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card members-table-card">
          <div className="members-table-header">
            <h3 style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              Members
              <span className="count-badge">{chit.members?.length || 0} slots</span>
            </h3>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Phone</th>
                  <th>Slots</th>
                  <th>Lifted?</th>
                  <th>Role</th>
                  <th style={{ textAlign: 'right' }}>Remove Slot</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const membersList = chit.members || []
                  const grouped = []
                  const seen = new Map()
                  membersList.forEach((member, idx) => {
                    const m = typeof member === 'object' ? member : { _id: member, name: `Member ${idx + 1}` }
                    const key = m._id
                    const isLifted = (chit.liftedMembers || []).includes(m._id)
                    
                    if (seen.has(key)) {
                      seen.get(key).count += 1
                    } else {
                      const entry = { ...m, count: 1, isLifted }
                      seen.set(key, entry)
                      grouped.push(entry)
                    }
                  })
                  return grouped.map((m) => (
                    <tr key={m._id}>
                      <td>
                        <div className="user-name-cell">
                          <div className="user-avatar-sm">
                            <span className="material-icons-round">person</span>
                          </div>
                          <p style={{ fontWeight: 700, fontSize: '14px' }}>{m.name}</p>
                        </div>
                      </td>
                      <td style={{ color: 'var(--slate-600)' }}>{m.phone || '—'}</td>
                      <td>
                        <span className="badge badge-active" style={{ fontSize: '11px', padding: '2px 8px' }}>
                          ×{m.count}
                        </span>
                      </td>
                      <td>
                         <button 
                           className={`badge ${m.isLifted ? 'badge-paid' : 'badge-draft'}`} 
                           style={{ cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                           onClick={() => handleLiftedToggle(m._id)}
                         >
                           <span className="material-icons-round" style={{ fontSize: '14px' }}>
                             {m.isLifted ? 'check_circle' : 'radio_button_unchecked'}
                           </span>
                           {m.isLifted ? 'Yes' : 'No'}
                         </button>
                      </td>
                      <td><span className={`badge ${m.role === 'admin' ? 'badge-draft' : 'badge-active'}`} >{(m.role || 'member').toUpperCase()}</span></td>
                      <td>
                        <div className="actions-cell" style={{ opacity: 1 }}>
                          <button className="icon-btn icon-btn-danger" onClick={() => handleRemoveMember(m._id)} title="Remove 1 slot">
                            <span className="material-icons-round" style={{ fontSize: '18px' }}>person_remove</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                })()}
                {(!chit.members || chit.members.length === 0) && (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--slate-400)' }}>No members yet. Add members to get started.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card members-table-card">
          <div className="members-table-header">
            <h3 style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              Monthly Auctions
              <span className="count-badge">{chit.months?.length || 0}</span>
            </h3>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Auction Amount</th>
                  <th>Winner</th>
                  <th>Participants</th>
                  <th>Bonus/Member</th>
                  <th>Final Amount</th>
                </tr>
              </thead>
              <tbody>
                {(chit.months || []).map((month) => {
                  const winnerName = typeof month.winner === 'object' ? month.winner?.name : allUsers.find(u => u._id === month.winner)?.name || '—'
                  const participantsCount = (month.auctionParticipants || []).length
                  return (
                    <tr key={month.monthNumber}>
                      <td style={{ fontWeight: 700 }}>
                        Month {month.monthNumber}
                        <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--slate-400)', marginTop: '2px' }}>{getMonthDate(month.monthNumber)}</p>
                      </td>
                      <td style={{ fontWeight: 600 }}>₹{(month.auctionAmount || 0).toLocaleString()}</td>
                      <td>{winnerName}</td>
                      <td>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                           <span className="material-icons-round" style={{ fontSize: '14px', color: participantsCount > 0 ? 'var(--primary)' : 'var(--slate-300)' }}>group</span>
                           <span style={{ fontWeight: 600 }}>{participantsCount}</span>
                         </div>
                      </td>
                      <td>₹{(month.bonusPerMember || 0).toLocaleString()}</td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{(month.finalChitAmount || 0).toLocaleString()}</td>
                    </tr>
                  )
                })}
                {(!chit.months || chit.months.length === 0) && (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--slate-400)' }}>No months recorded yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {(chit.months || []).map((month) => {
          const slotCountMap = {}
          ;(month.payments || []).forEach(p => {
            const mid = typeof p.member === 'object' ? p.member._id : p.member
            slotCountMap[mid] = (slotCountMap[mid] || 0) + 1
          })
          const slotIndexMap = {}
          const paidCount = (month.payments || []).filter(p => p.isPaid).length
          const totalCount = (month.payments || []).length
          const isExpanded = expandedMonths.has(month.monthNumber)

          return (
          <div key={month.monthNumber} className="glass-card members-table-card">
            <div
              className="members-table-header"
              onClick={() => {
                setExpandedMonths(prev => {
                  const next = new Set(prev)
                  if (next.has(month.monthNumber)) next.delete(month.monthNumber)
                  else next.add(month.monthNumber)
                  return next
                })
              }}
              style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <h3 style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                Month {month.monthNumber}
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--slate-500)' }}>{getMonthDate(month.monthNumber)}</span>
                <span style={{ color: 'var(--slate-300)', fontSize: '14px' }}>—</span>
                Payments
                <span className={`badge ${paidCount === totalCount ? 'badge-paid' : 'badge-pending'}`} style={{ fontSize: '11px', padding: '2px 10px' }}>
                  {paidCount}/{totalCount} Paid
                </span>
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {paidCount < totalCount && (
                  <button
                    className="btn-primary"
                    style={{ padding: '5px 12px', fontSize: '11px', fontWeight: 600 }}
                    onClick={(e) => { e.stopPropagation(); markAllPaid(month.monthNumber) }}
                  >
                    <span className="material-icons-round" style={{ fontSize: '14px', marginRight: '4px', verticalAlign: 'middle' }}>done_all</span>
                    Mark All Paid
                  </button>
                )}
                <span className="material-icons-round" style={{ fontSize: '22px', color: 'var(--slate-400)', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  expand_more
                </span>
              </div>
            </div>
            {isExpanded && (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Payment Status</th>
                    <th>Paid Date</th>
                    <th style={{ textAlign: 'right' }}>Mark Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {(month.payments || []).map((payment, pIdx) => {
                    const memberId = typeof payment.member === 'object' ? payment.member._id : payment.member
                    const memberObj = typeof payment.member === 'object' ? payment.member : allUsers.find(u => u._id === memberId)
                    const totalSlots = slotCountMap[memberId] || 1
                    slotIndexMap[memberId] = (slotIndexMap[memberId] || 0) + 1
                    const currentSlot = slotIndexMap[memberId]
                    const slotLabel = totalSlots > 1 ? ` (Slot ${currentSlot})` : ''

                    return (
                      <tr key={pIdx}>
                        <td>
                          <div className="user-name-cell">
                            <div className="user-avatar-sm">
                              <span className="material-icons-round">person</span>
                            </div>
                            <p style={{ fontWeight: 600, fontSize: '14px' }}>{memberObj?.name || 'Unknown'}{slotLabel}</p>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${payment.isPaid ? 'badge-paid' : 'badge-pending'}`}>
                            {payment.isPaid ? 'PAID' : 'PENDING'}
                          </span>
                        </td>
                        <td style={{ fontSize: '13px', color: 'var(--slate-500)' }}>
                          {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : '—'}
                        </td>
                        <td>
                          <div className="actions-cell" style={{ opacity: 1 }}>
                            <button
                              className={`icon-btn ${payment.isPaid ? 'icon-btn-danger' : ''}`}
                              onClick={() => togglePayment(month.monthNumber, memberId, payment.isPaid, pIdx)}
                              style={!payment.isPaid ? { color: 'var(--emerald-500)' } : {}}
                            >
                              <span className="material-icons-round" style={{ fontSize: '18px' }}>
                                {payment.isPaid ? 'undo' : 'check_circle'}
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {(!month.payments || month.payments.length === 0) && (
                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: 'var(--slate-400)' }}>No payment records.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            )}
          </div>
          )
        })}
      </div>

      {showMonthModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowMonthModal(false)}>
          <div className="modal-content">
            <h3 className="modal-title">Add Month Data</h3>
            {error && <div className="auth-error" style={{ marginBottom: '16px' }}><span className="material-icons-round" style={{ fontSize: '18px' }}>error</span>{error}</div>}
            <form className="modal-form" onSubmit={handleAddMonth}>
              <div className="form-group">
                <label className="form-label">Month Number</label>
                <input className="input-field" style={{ paddingLeft: '16px' }} type="number" value={monthForm.monthNumber} onChange={(e) => setMonthForm({ ...monthForm, monthNumber: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Auction Amount (₹)</label>
                <input className="input-field" style={{ paddingLeft: '16px' }} type="number" placeholder="Winning bid amount" value={monthForm.auctionAmount} onChange={(e) => setMonthForm({ ...monthForm, auctionAmount: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Winner</label>
                <select value={monthForm.winner} onChange={(e) => setMonthForm({ ...monthForm, winner: e.target.value })}>
                  <option value="">Select winner (optional)</option>
                  {(() => {
                    const seen = new Set()
                    return (chit.members || []).map((m) => {
                      const member = typeof m === 'object' ? m : { _id: m, name: m }
                      if (seen.has(member._id)) return null
                      seen.add(member._id)
                      return <option key={member._id} value={member._id}>{member.name}</option>
                    })
                  })()}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setShowMonthModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add Month</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMemberModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowMemberModal(false)}>
          <div className="modal-content">
            <h3 className="modal-title">Add Member</h3>
            {error && <div className="auth-error" style={{ marginBottom: '16px' }}><span className="material-icons-round" style={{ fontSize: '18px' }}>error</span>{error}</div>}
            <form className="modal-form" onSubmit={handleAddMember}>
              <div className="form-group">
                <label className="form-label">Search User</label>
                <input
                  className="input-field"
                  style={{ paddingLeft: '16px' }}
                  type="text"
                  placeholder="Search by name or phone..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                />
                <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)', marginTop: '8px' }}>
                  {availableUsers
                    .filter(u => {
                      const q = memberSearch.toLowerCase()
                      return !q || u.name?.toLowerCase().includes(q) || u.phone?.toLowerCase().includes(q)
                    })
                    .map((u) => (
                      <div
                        key={u._id}
                        onClick={() => { setSelectedMemberId(u._id); setMemberSearch(u.name) }}
                        style={{
                          padding: '10px 16px',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          background: selectedMemberId === u._id ? 'var(--primary-50, #eff6ff)' : 'transparent',
                          borderBottom: '1px solid var(--slate-100)',
                          transition: 'background 0.15s'
                        }}
                      >
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '13px', color: 'var(--slate-900)' }}>{u.name}</p>
                          <p style={{ fontSize: '11px', color: 'var(--slate-400)' }}>{u.phone} • {u.role}</p>
                        </div>
                        {selectedMemberId === u._id && (
                          <span className="material-icons-round" style={{ fontSize: '18px', color: 'var(--primary)' }}>check_circle</span>
                        )}
                      </div>
                    ))
                  }
                  {availableUsers.filter(u => {
                    const q = memberSearch.toLowerCase()
                    return !q || u.name?.toLowerCase().includes(q) || u.phone?.toLowerCase().includes(q)
                  }).length === 0 && (
                    <p style={{ padding: '16px', textAlign: 'center', color: 'var(--slate-400)', fontSize: '13px' }}>No users found</p>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Number of Slots</label>
                <input className="input-field" style={{ paddingLeft: '16px' }} type="number" min="1" max="10" value={slotsCount} onChange={(e) => setSlotsCount(Number(e.target.value) || 1)} />
                <p style={{ fontSize: '11px', color: 'var(--slate-400)', marginTop: '4px' }}>Each slot = 1 monthly contribution. A user with 2 slots pays 2× per month.</p>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setShowMemberModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowEditModal(false)}>
          <div className="modal-content">
            <h3 className="modal-title">Edit Chit Details</h3>
            {error && <div className="auth-error" style={{ marginBottom: '16px' }}><span className="material-icons-round" style={{ fontSize: '18px' }}>error</span>{error}</div>}
            <form className="modal-form" onSubmit={handleEditChit}>
              <div className="form-group">
                <label className="form-label">Group Name</label>
                <input className="input-field" style={{ paddingLeft: '16px' }} type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Chit Value (₹)</label>
                  <input className="input-field" style={{ paddingLeft: '16px' }} type="number" value={editForm.chitValue} onChange={(e) => setEditForm({ ...editForm, chitValue: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Monthly Amount (₹)</label>
                  <input className="input-field" style={{ paddingLeft: '16px' }} type="number" value={editForm.monthlyAmount} onChange={(e) => setEditForm({ ...editForm, monthlyAmount: e.target.value })} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Total Members</label>
                  <input className="input-field" style={{ paddingLeft: '16px' }} type="number" value={editForm.totalMembers} onChange={(e) => setEditForm({ ...editForm, totalMembers: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (months)</label>
                  <input className="input-field" style={{ paddingLeft: '16px' }} type="number" value={editForm.duration} onChange={(e) => {
                    const dur = e.target.value
                    const updated = { ...editForm, duration: dur }
                    if (editForm.startDate && dur) {
                      const d = new Date(editForm.startDate)
                      d.setMonth(d.getMonth() + Number(dur) - 1)
                      updated.endDate = d.toISOString().split('T')[0]
                    }
                    setEditForm(updated)
                  }} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input className="input-field" style={{ paddingLeft: '16px' }} type="date" value={editForm.startDate} onChange={(e) => {
                    const start = e.target.value
                    const updated = { ...editForm, startDate: start }
                    if (start && editForm.duration) {
                      const d = new Date(start)
                      d.setMonth(d.getMonth() + Number(editForm.duration) - 1)
                      updated.endDate = d.toISOString().split('T')[0]
                    }
                    setEditForm(updated)
                  }} required />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input className="input-field" style={{ paddingLeft: '16px', background: 'var(--slate-50)', color: 'var(--slate-500)' }} type="date" value={editForm.endDate} readOnly />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
