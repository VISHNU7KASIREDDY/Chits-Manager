import { useState, useEffect } from 'react'

const ServerLoadingScreen = ({ onServerReady }) => {
  const [dots, setDots] = useState('')
  const [elapsed, setElapsed] = useState(0)

  // Animate the dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Track elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Ping the server
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    let cancelled = false

    const ping = async () => {
      try {
        const res = await fetch(`${apiUrl}/health`, { method: 'GET' })
        if (res.ok && !cancelled) {
          onServerReady()
        }
      } catch {
        // Server not ready yet, will retry
      }
    }

    // Ping immediately, then every 3 seconds
    ping()
    const interval = setInterval(ping, 3000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [onServerReady])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      gap: '32px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Animated background orbs */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '15%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
        animation: 'float 6s ease-in-out infinite',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '10%',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
        animation: 'float 8s ease-in-out infinite reverse',
        pointerEvents: 'none'
      }} />

      {/* Server icon with pulse */}
      <div style={{
        position: 'relative',
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '2px solid rgba(99,102,241,0.3)',
          animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
        }} />
        <div style={{
          position: 'absolute',
          inset: '8px',
          borderRadius: '50%',
          border: '2px solid rgba(99,102,241,0.2)',
          animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite 0.5s'
        }} />
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
          <line x1="6" y1="6" x2="6.01" y2="6" />
          <line x1="6" y1="18" x2="6.01" y2="18" />
        </svg>
      </div>

      {/* Main text */}
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <h2 style={{
          color: '#e2e8f0',
          fontSize: '22px',
          fontWeight: 600,
          margin: '0 0 12px 0',
          letterSpacing: '-0.3px'
        }}>
          Server is waking up{dots}
        </h2>
        <p style={{
          color: '#94a3b8',
          fontSize: '15px',
          fontWeight: 400,
          margin: '0 0 8px 0',
          lineHeight: 1.6
        }}>
          Our server sleeps when inactive to save resources.
        </p>
        <p style={{
          color: '#64748b',
          fontSize: '14px',
          fontWeight: 400,
          margin: 0,
          lineHeight: 1.6
        }}>
          This usually takes <span style={{ color: '#818cf8', fontWeight: 500 }}>30–60 seconds</span>. Hang tight!
        </p>
      </div>

      {/* Progress / timer */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        zIndex: 1
      }}>
        {/* Animated bar */}
        <div style={{
          width: '200px',
          height: '4px',
          borderRadius: '4px',
          background: 'rgba(99,102,241,0.15)',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '40%',
            height: '100%',
            borderRadius: '4px',
            background: 'linear-gradient(90deg, #6366f1, #a78bfa)',
            animation: 'shimmer 1.5s ease-in-out infinite'
          }} />
        </div>
        <span style={{
          color: '#475569',
          fontSize: '13px',
          fontFamily: "'SF Mono', 'Fira Code', monospace"
        }}>
          {elapsed}s elapsed
        </span>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.8; }
          75%, 100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  )
}

export default ServerLoadingScreen
