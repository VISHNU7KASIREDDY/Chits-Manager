import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import api from '../../services/api'
import LoadingScreen from '../../components/LoadingScreen'
import '../Dashboard.css'

export default function AdminDashboard() {
  const [chits, setChits] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const perPage = 8

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [chitsRes, usersRes] = await Promise.all([
        api.get('/admin/chits/'),
        api.get('/admin/users/')
      ])
      setChits(chitsRes.data)
      setUsers(usersRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredChits = chits.filter(c => {
    const matchSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalPages = Math.ceil(filteredChits.length / perPage)
  const paginatedChits = filteredChits.slice((page - 1) * perPage, page * perPage)

  const activeChits = chits.filter(c => c.status === 'active')
  const totalRevenue = chits.reduce((sum, c) => sum + c.chitValue, 0)

  return (
    <>
      <Header
        title="Management Suite"
        subtitle="Overview of platform operations and analytics."
        actions={
          <Link to="/admin/chits" className="btn-primary" style={{ padding: '10px 20px', fontSize: '13px' }}>
            <span className="material-icons-round" style={{ fontSize: '16px' }}>add</span>
            Create Chit Group
          </Link>
        }
      />

      <div className="dashboard-content">
        <div className="admin-stats-row">
          <div className="glass-card admin-stat-card">
            <div className="admin-stat-top">
              <div className="admin-stat-icon" style={{ background: 'var(--primary-light)' }}>
                <span className="material-icons-round" style={{ color: 'var(--primary)', fontSize: '24px' }}>groups</span>
              </div>
              <span className="admin-stat-change" style={{ background: 'var(--emerald-100)', color: 'var(--emerald-700)' }}>
                ↑ Active
              </span>
            </div>
            <p className="admin-stat-label">Total Active Users</p>
            <p className="admin-stat-value">{users.length.toLocaleString()}</p>
          </div>

          <div className="glass-card admin-stat-card">
            <div className="admin-stat-top">
              <div className="admin-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                <span className="material-icons-round" style={{ color: 'var(--emerald-600)', fontSize: '24px' }}>payments</span>
              </div>
              <span className="admin-stat-change" style={{ background: 'var(--emerald-100)', color: 'var(--emerald-700)' }}>
                ₹ Total
              </span>
            </div>
            <p className="admin-stat-label">Total Revenue</p>
            <p className="admin-stat-value">₹{totalRevenue.toLocaleString()}</p>
          </div>

          <div className="glass-card admin-stat-card">
            <div className="admin-stat-top">
              <div className="admin-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                <span className="material-icons-round" style={{ color: 'var(--amber-600)', fontSize: '24px' }}>schedule</span>
              </div>
              <span className="admin-stat-change" style={{ background: 'var(--amber-100)', color: 'var(--amber-700)' }}>
                Active
              </span>
            </div>
            <p className="admin-stat-label">Active Chit Groups</p>
            <p className="admin-stat-value">{activeChits.length}</p>
          </div>
        </div>

        <div className="glass-card" style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden', border: '1px solid rgba(226, 232, 240, 0.5)' }}>
          <div className="table-controls">
            <div className="search-bar">
              <span className="material-icons-round">search</span>
              <input
                type="text"
                placeholder="Search by chit name..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1) }}
              />
            </div>
            <div className="filter-controls">
              <select className="filter-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
              <button className="filter-btn">
                <span className="material-icons-round">tune</span>
              </button>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Group Name</th>
                  <th>Total Value</th>
                  <th>Members</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ padding: '0' }}>
                    <LoadingScreen fullScreen={false} message="Loading dashboard data" subMessage="Fetching users and chits..." />
                  </td></tr>
                ) : paginatedChits.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--slate-400)' }}>No chit groups found.</td></tr>
                ) : (
                  paginatedChits.map((chit) => (
                    <tr key={chit._id}>
                      <td>
                        <Link to={`/admin/chits/${chit._id}`} className="chit-id-link">{chit.name}</Link>
                      </td>
                      <td style={{ fontWeight: 700 }}>₹{chit.chitValue?.toLocaleString()}</td>
                      <td>
                        <div className="members-stack">
                          {(chit.members || []).slice(0, 3).map((_, i) => (
                            <div className="member-avatar" key={i}>
                              <span className="material-icons-round" style={{ fontSize: '14px' }}>person</span>
                            </div>
                          ))}
                          {(chit.members?.length || 0) > 3 && (
                            <div className="member-count">+{chit.members.length - 3}</div>
                          )}
                        </div>
                      </td>
                      <td style={{ fontSize: '14px', color: 'var(--slate-600)' }}>{chit.duration} months</td>
                      <td><span className={`badge badge-${chit.status}`}>{chit.status?.toUpperCase()}</span></td>
                      <td>
                        <div className="actions-cell">
                          <Link to={`/admin/chits/${chit._id}`} className="icon-btn">
                            <span className="material-icons-round" style={{ fontSize: '18px' }}>visibility</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <p className="pagination-info">Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filteredChits.length)} of {filteredChits.length}</p>
              <div className="pagination-btns">
                <button className="pagination-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i} className={`pagination-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>
                    {i + 1}
                  </button>
                ))}
                <button className="pagination-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
              </div>
            </div>
          )}
        </div>


      </div>
    </>
  )
}
