import { useState, useEffect } from 'react'

const LoadingScreen = () => {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(145deg, #f8fafc 0%, #eef2f7 40%, #e8edf5 100%)',
      fontFamily: "'Manrope', 'Inter', sans-serif",
      gap: '28px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Floating background orbs */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '20%',
        width: '280px',
        height: '280px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(25,127,230,0.08) 0%, transparent 70%)',
        animation: 'loadFloat 7s ease-in-out infinite',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '15%',
        width: '220px',
        height: '220px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)',
        animation: 'loadFloat 9s ease-in-out infinite reverse',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: '55%',
        left: '65%',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
        animation: 'loadFloat 8s ease-in-out infinite 1s',
        pointerEvents: 'none'
      }} />

      {/* Animated logo with pulse rings */}
      <div style={{
        position: 'relative',
        width: '88px',
        height: '88px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Outer pulse ring */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '2px solid rgba(25,127,230,0.2)',
          animation: 'loadPing 2.5s cubic-bezier(0, 0, 0.2, 1) infinite'
        }} />
        {/* Inner pulse ring */}
        <div style={{
          position: 'absolute',
          inset: '10px',
          borderRadius: '50%',
          border: '2px solid rgba(25,127,230,0.15)',
          animation: 'loadPing 2.5s cubic-bezier(0, 0, 0.2, 1) infinite 0.6s'
        }} />
        {/* Logo circle */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #197fe6 0%, #1570cc 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(25,127,230,0.3)',
          animation: 'loadBreathe 3s ease-in-out infinite'
        }}>
          <span className="material-icons-round" style={{
            color: 'white',
            fontSize: '28px'
          }}>account_balance</span>
        </div>
      </div>

      {/* Text section */}
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <h2 style={{
          color: '#1e293b',
          fontSize: '18px',
          fontWeight: 700,
          margin: '0 0 8px 0',
          letterSpacing: '-0.3px'
        }}>
          Loading your dashboard{dots}
        </h2>
        <p style={{
          color: '#94a3b8',
          fontSize: '14px',
          fontWeight: 500,
          margin: 0
        }}>
          Fetching your details and portfolio
        </p>
      </div>

      {/* Shimmer progress bar */}
      <div style={{
        width: '180px',
        height: '3px',
        borderRadius: '4px',
        background: 'rgba(25,127,230,0.1)',
        overflow: 'hidden',
        zIndex: 1
      }}>
        <div style={{
          width: '40%',
          height: '100%',
          borderRadius: '4px',
          background: 'linear-gradient(90deg, #197fe6, #60a5fa, #197fe6)',
          animation: 'loadShimmer 1.4s ease-in-out infinite'
        }} />
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes loadPing {
          0% { transform: scale(1); opacity: 0.7; }
          75%, 100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes loadFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes loadShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
        @keyframes loadBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
      `}</style>
    </div>
  )
}

export default LoadingScreen
