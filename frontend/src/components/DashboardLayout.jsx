import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Footer from './Footer'
import './DashboardLayout.css'

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main custom-scrollbar">
        <div className="dashboard-page-wrapper">
          <Outlet />
        </div>
        <Footer />
      </main>
      <div className="decoration-blob blob-top"></div>
      <div className="decoration-blob blob-bottom"></div>
    </div>
  )
}
