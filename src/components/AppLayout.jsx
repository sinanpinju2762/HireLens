import { useState } from 'react'
import Sidebar from './Sidebar'
import Logo from './Logo'

export default function AppLayout({ children, footer = true }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-layout">

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Overlay — mobile only */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? '' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)}
      />

      <main className="main-content">
        {/* Mobile top bar */}
        <div className="mobile-topbar">
          <a href="/dashboard" className="mobile-topbar-logo" style={{ textDecoration:'none', color:'inherit' }}>
            <Logo size={24} />
            HireLens
          </a>
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(v => !v)} aria-label="Open menu">
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className="page-body">
          {children}
        </div>

        {footer && (
          <footer className="app-footer">
            <span>HireLens · © 2026 HireLens The Cognitive Sanctuary.</span>
            <div className="app-footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </footer>
        )}
      </main>
    </div>
  )
}
