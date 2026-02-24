const LoadingScreen = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'var(--bg-light)',
      fontFamily: 'var(--font)',
      gap: '24px'
    }}>
      <div className="loading-spinner" />
      <p style={{
        color: 'var(--slate-500)',
        fontSize: '15px',
        fontWeight: 500,
        letterSpacing: '0.3px'
      }}>
        Fetching your details...
      </p>
    </div>
  )
}

export default LoadingScreen
