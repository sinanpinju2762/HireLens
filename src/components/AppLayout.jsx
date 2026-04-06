import Sidebar from './Sidebar'

export default function AppLayout({ children, footer = true }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
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
