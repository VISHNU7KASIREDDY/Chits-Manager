import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import './Dashboard.css'

export default function Profile() {
  const { user } = useAuth()

  return (
    <>
      <Header
        title="My Profile"
        subtitle="Your account details and preferences."
      />

      <div className="dashboard-content">
        <div className="detail-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 25px var(--primary-shadow)' }}>
              <span className="material-icons-round" style={{ fontSize: '36px', color: 'var(--white)' }}>person</span>
            </div>
            <div>
              <h2 className="detail-title">{user?.name || 'User'}</h2>
              <div className="detail-meta">
                <span className={`badge ${user?.role === 'admin' ? 'badge-draft' : 'badge-active'}`}>{(user?.role || 'member').toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="stats-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="glass-card stat-card">
            <div className="stat-card-body">
              <div>
                <p className="stat-label">Full Name</p>
                <h3 className="stat-value" style={{ fontSize: '20px' }}>{user?.name || '—'}</h3>
              </div>
              <div className="stat-icon-box" style={{ background: 'var(--primary-light)' }}>
                <span className="material-icons-round" style={{ color: 'var(--primary)', fontSize: '28px' }}>badge</span>
              </div>
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-card-body">
              <div>
                <p className="stat-label">Phone Number</p>
                <h3 className="stat-value" style={{ fontSize: '20px' }}>{user?.phone || '—'}</h3>
              </div>
              <div className="stat-icon-box" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                <span className="material-icons-round" style={{ color: 'var(--emerald-600)', fontSize: '28px' }}>phone</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '32px', borderRadius: 'var(--radius-2xl)' }}>
          <h3 style={{ fontWeight: 700, fontSize: '16px', color: 'var(--slate-800)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-icons-round" style={{ fontSize: '20px', color: 'var(--primary)' }}>info</span>
            Account Details
          </h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--slate-100)' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--slate-500)' }}>Name</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--slate-900)' }}>{user?.name || '—'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--slate-100)' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--slate-500)' }}>Phone</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--slate-900)' }}>{user?.phone || '—'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--slate-100)' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--slate-500)' }}>Role</span>
              <span className={`badge ${user?.role === 'admin' ? 'badge-draft' : 'badge-active'}`}>{(user?.role || 'member').toUpperCase()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--slate-500)' }}>Account ID</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--slate-400)', fontFamily: 'monospace' }}>{user?._id || user?.id || '—'}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
