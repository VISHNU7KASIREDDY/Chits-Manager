import { useNotification } from '../../context/NotificationContext'
import Header from '../../components/Header'
import '../Dashboard.css'

export default function Notifications() {
  const { notifications, loading, markAsRead, unreadCount } = useNotification()

  return (
    <>
      <Header
        title="Notifications"
        subtitle={`You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
      />
      
      <div className="dashboard-content">
        <div className="glass-card" style={{ padding: '0' }}>
           {loading ? (
             <div style={{ padding: '40px', textAlign: 'center', color: 'var(--slate-400)' }}>Loading...</div>
           ) : notifications.length === 0 ? (
             <div style={{ padding: '60px', textAlign: 'center' }}>
               <div style={{ background: 'var(--slate-100)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                 <span className="material-icons-round" style={{ fontSize: '30px', color: 'var(--slate-400)' }}>notifications_none</span>
               </div>
               <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--slate-700)' }}>No notifications</h3>
               <p style={{ fontSize: '14px', color: 'var(--slate-400)', marginTop: '4px' }}>We'll let you know when something important arrives.</p>
             </div>
           ) : (
             <div>
               {notifications.map((n) => (
                 <div 
                   key={n._id} 
                   onClick={() => markAsRead(n._id)}
                   style={{ 
                     padding: '20px', 
                     borderBottom: '1px solid var(--slate-100)', 
                     background: n.isRead ? 'transparent' : 'var(--primary-50, #f0f7ff)',
                     cursor: n.isRead ? 'default' : 'pointer',
                     transition: 'background 0.2s',
                     display: 'flex',
                     gap: '16px'
                   }}
                 >
                   <div style={{ 
                     width: '40px', height: '40px', borderRadius: '50%', 
                     background: n.type === 'auction_participation' ? '#dcfce7' : '#e0f2fe',
                     color: n.type === 'auction_participation' ? '#166534' : '#0369a1',
                     display: 'flex', alignItems: 'center', justifyContent: 'center',
                     flexShrink: 0
                   }}>
                     <span className="material-icons-round" style={{ fontSize: '20px' }}>
                       {n.type === 'auction_participation' ? 'pan_tool' : 'campaign'}
                     </span>
                   </div>
                   <div style={{ flex: 1 }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--slate-800)', margin: 0 }}>
                          {n.type === 'auction_participation' ? 'Participation Request' : 'Reminder'}
                        </h4>
                        <span style={{ fontSize: '12px', color: 'var(--slate-400)' }}>
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                     </div>
                     <p style={{ fontSize: '14px', color: 'var(--slate-600)', margin: 0, lineHeight: 1.5 }}>
                       {n.message}
                     </p>
                     {!n.isRead && (
                       <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                         <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
                           <span className="material-icons-round" style={{ fontSize: '12px', marginRight: '4px' }}>mark_email_read</span>
                           Click to mark read
                         </span>
                       </div>
                     )}
                   </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>
    </>
  )
}
