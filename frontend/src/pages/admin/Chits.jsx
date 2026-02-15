import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import api from '../../services/api'
import '../Dashboard.css'

export default function AdminChits() {
  const [chits, setChits] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [formData, setFormData] = useState({
    name: '', chitValue: '', monthlyAmount: '', totalMembers: '', duration: '', startDate: '', endDate: ''
  })
  const [editForm, setEditForm] = useState({
    name: '', chitValue: '', monthlyAmount: '', totalMembers: '', duration: '', startDate: '', endDate: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchChits()
  }, [])

  const fetchChits = async () => {
    try {
      const res = await api.get('/admin/chits/')
      setChits(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/admin/chits/', {
        ...formData,
        chitValue: Number(formData.chitValue),
        monthlyAmount: Number(formData.monthlyAmount),
        totalMembers: Number(formData.totalMembers),
        duration: Number(formData.duration)
      })
      setShowModal(false)
      setFormData({ name: '', chitValue: '', monthlyAmount: '', totalMembers: '', duration: '', startDate: '', endDate: '' })
      fetchChits()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create chit')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this chit group?')) return
    try {
      await api.delete(`/admin/chits/${id}`)
      fetchChits()
    } catch (err) {
      console.error(err)
    }
  }

  const openEditModal = (chit) => {
    setEditId(chit._id)
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

  const handleEdit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.put(`/admin/chits/${editId}`, {
        ...editForm,
        chitValue: Number(editForm.chitValue),
        monthlyAmount: Number(editForm.monthlyAmount),
        totalMembers: Number(editForm.totalMembers),
        duration: Number(editForm.duration)
      })
      setShowEditModal(false)
      fetchChits()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update chit')
    }
  }

  return (
    <>
      <Header
        title="Chit Management"
        subtitle="Create and manage chit fund groups."
        actions={
          <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '13px' }} onClick={() => { setShowModal(true); setError('') }}>
            <span className="material-icons-round" style={{ fontSize: '16px' }}>add</span>
            Create New Chit
          </button>
        }
      />

      <div className="dashboard-content">
        <div className="glass-card" style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden', border: '1px solid rgba(226, 232, 240, 0.5)' }}>
          <div className="table-header" style={{ borderBottom: '1px solid var(--slate-100)' }}>
            <h2 className="section-title">
              All Chit Groups
              <span className="count-badge">{chits.length}</span>
            </h2>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Group Name</th>
                  <th>Value</th>
                  <th>Monthly</th>
                  <th>Members</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--slate-400)' }}>Loading...</td></tr>
                ) : chits.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--slate-400)' }}>No chit groups. Create one to get started.</td></tr>
                ) : (
                  chits.map((chit) => (
                    <tr key={chit._id}>
                      <td>
                        <Link to={`/admin/chits/${chit._id}`} className="chit-id-link">{chit.name}</Link>
                      </td>
                      <td style={{ fontWeight: 700 }}>₹{chit.chitValue?.toLocaleString()}</td>
                      <td style={{ fontWeight: 600, color: 'var(--slate-600)' }}>₹{chit.monthlyAmount?.toLocaleString()}</td>
                      <td>{chit.members?.length || 0}/{chit.totalMembers}</td>
                      <td>{chit.duration}m</td>
                      <td><span className={`badge badge-${chit.status}`}>{chit.status?.toUpperCase()}</span></td>
                      <td>
                        <div className="actions-cell" style={{ opacity: 1 }}>
                          <button className="icon-btn" onClick={() => openEditModal(chit)}>
                            <span className="material-icons-round" style={{ fontSize: '18px' }}>edit</span>
                          </button>
                          <Link to={`/admin/chits/${chit._id}`} className="icon-btn">
                            <span className="material-icons-round" style={{ fontSize: '18px' }}>visibility</span>
                          </Link>
                          <button className="icon-btn icon-btn-danger" onClick={() => handleDelete(chit._id)}>
                            <span className="material-icons-round" style={{ fontSize: '18px' }}>delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-content">
            <h3 className="modal-title">Create New Chit Group</h3>

            {error && (
              <div className="auth-error" style={{ marginBottom: '16px' }}>
                <span className="material-icons-round" style={{ fontSize: '18px' }}>error</span>
                {error}
              </div>
            )}

            <form className="modal-form" onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Group Name</label>
                <input className="input-field" style={{ paddingLeft: '16px' }} type="text" placeholder="e.g. Gold Tier - Group A" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Chit Value (₹)</label>
                  <input className="input-field" style={{ paddingLeft: '16px' }} type="number" placeholder="500000" value={formData.chitValue} onChange={(e) => setFormData({ ...formData, chitValue: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Monthly Amount (₹)</label>
                  <input className="input-field" style={{ paddingLeft: '16px' }} type="number" placeholder="25000" value={formData.monthlyAmount} onChange={(e) => setFormData({ ...formData, monthlyAmount: e.target.value })} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Total Members</label>
                  <input className="input-field" style={{ paddingLeft: '16px' }} type="number" placeholder="20" value={formData.totalMembers} onChange={(e) => setFormData({ ...formData, totalMembers: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (months)</label>
                  <input className="input-field" style={{ paddingLeft: '16px' }} type="number" placeholder="20" value={formData.duration} onChange={(e) => {
                    const dur = e.target.value
                    const updated = { ...formData, duration: dur }
                    if (formData.startDate && dur) {
                      const d = new Date(formData.startDate)
                      d.setMonth(d.getMonth() + Number(dur) - 1)
                      updated.endDate = d.toISOString().split('T')[0]
                    }
                    setFormData(updated)
                  }} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input className="input-field" style={{ paddingLeft: '16px' }} type="date" value={formData.startDate} onChange={(e) => {
                    const start = e.target.value
                    const updated = { ...formData, startDate: start }
                    if (start && formData.duration) {
                      const d = new Date(start)
                      d.setMonth(d.getMonth() + Number(formData.duration) - 1)
                      updated.endDate = d.toISOString().split('T')[0]
                    }
                    setFormData(updated)
                  }} required />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input className="input-field" style={{ paddingLeft: '16px', background: 'var(--slate-50)', color: 'var(--slate-500)' }} type="date" value={formData.endDate} readOnly />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Chit Group</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowEditModal(false)}>
          <div className="modal-content">
            <h3 className="modal-title">Edit Chit Group</h3>
            {error && <div className="auth-error" style={{ marginBottom: '16px' }}><span className="material-icons-round" style={{ fontSize: '18px' }}>error</span>{error}</div>}
            <form className="modal-form" onSubmit={handleEdit}>
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
