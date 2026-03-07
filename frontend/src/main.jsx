import { StrictMode, useState, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ServerLoadingScreen from './components/ServerLoadingScreen'

function Root() {
  const [serverReady, setServerReady] = useState(false)
  const handleReady = useCallback(() => setServerReady(true), [])

  if (!serverReady) {
    return <ServerLoadingScreen onServerReady={handleReady} />
  }

  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
