import { useState, useEffect } from 'react'
import Header from '../../components/Header'
import api from '../../services/api'
import '../Dashboard.css'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({ name: '', phone: '', password: '', role: 'member' })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users/')
      setUsers(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setEditingUser(null)
    setFormData({ name: '', phone: '', password: '', role: 'member' })
    setError('')
    setShowModal(true)
  }

  const openEdit = (user) => {
    setEditingUser(user)
    setFormData({ name: user.name, phone: user.phone, password: '', role: user.role })
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editingUser) {
        const payload = { name: formData.name, phone: formData.phone, role: formData.role }
        if (formData.password) payload.password = formData.password
        await api.put(`/admin/users/${editingUser._id}`, payload)
      } else {
        await api.post('/admin/users/', formData)
      }
      setShowModal(false)
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    try {
      await api.delete(`/admin/users/${id}`)
      fetchUsers()
    } catch (err) {
      console.error(err)
    }
  }

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'badge-draft'
      case 'member': return 'badge-active'
      default: return 'badge-completed'
    }
  }

  return (
    <>
      <Header
        title="User Management"
        subtitle="Manage platform users and access control."
        actions={
          <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '13px' }} onClick={openCreate}>
            <span className="material-icons-round" style={{ fontSize: '16px' }}>person_add</span>
            Add New User
          </button>
        }
      />

      <div className="dashboard-content">
        <div className="glass-card" style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden', border: '1px solid rgba(226, 232, 240, 0.5)' }}>
          <div className="table-header" style={{ borderBottom: '1px solid var(--slate-100)' }}>
            <h2 className="section-title">
              All Users
              <span className="count-badge">{users.length}</span>
            </h2>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--slate-400)' }}>Loading users...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--slate-400)' }}>No users found.</td></tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div className="user-name-cell">
                          <div className="user-avatar-sm">
                            <span className="material-icons-round">person</span>
                          </div>
                          <div>
                            <p style={{ fontWeight: 700, fontSize: '14px' }}>{u.name}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--slate-600)' }}>{u.phone}</td>
                      <td><span className={`badge ${getRoleBadgeClass(u.role)}`}>{u.role?.toUpperCase()}</span></td>
                      <td style={{ fontSize: '13px', color: 'var(--slate-500)' }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td>
                        <div className="actions-cell" style={{ opacity: 1 }}>
                          <button className="icon-btn" onClick={() => openEdit(u)}>
                            <span className="material-icons-round" style={{ fontSize: '18px' }}>edit</span>
                          </button>
                          <button className="icon-btn icon-btn-danger" onClick={() => handleDelete(u._id)}>
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
            <h3 className="modal-title">{editingUser ? 'Edit User' : 'Create New User'}</h3>

            {error && (
              <div className="auth-error" style={{ marginBottom: '16px' }}>
                <span className="material-icons-round" style={{ fontSize: '18px' }}>error</span>
                {error}
              </div>
            )}

            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="input-field"
                  style={{ paddingLeft: '16px' }}
                  type="text"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  className="input-field"
                  style={{ paddingLeft: '16px' }}
                  type="text"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{editingUser ? 'Password (leave empty to keep current)' : 'Password'}</label>
                <input
                  className="input-field"
                  style={{ paddingLeft: '16px' }}
                  type="password"
                  placeholder={editingUser ? 'Leave empty to keep current' : 'Create a password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  {...(!editingUser && { required: true })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">{editingUser ? 'Update User' : 'Create User'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
