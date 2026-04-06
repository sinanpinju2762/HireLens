import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Logo = () => (
  <svg viewBox="0 0 32 32" width="28" height="28" fill="none">
    <rect width="32" height="32" rx="7" fill="#8225C4"/>
    <polygon points="14,15 21,22 14,29 7,22"   fill="none" stroke="white" strokeWidth="1.3"/>
    <polygon points="14,17 19,22 14,27 9,22"   fill="none" stroke="white" strokeWidth="1.3"/>
    <polygon points="14,19 17,22 14,25 11,22"  fill="none" stroke="white" strokeWidth="1.3"/>
    <polygon points="8,7.5 13.5,13 8,18.5 2.5,13" fill="none" stroke="white" strokeWidth="1.3"/>
    <polygon points="8,9.5 11.5,13 8,16.5 4.5,13" fill="none" stroke="white" strokeWidth="1.3"/>
    <polygon points="19,3 23,7 19,11 15,7"     fill="none" stroke="white" strokeWidth="1.3"/>
    <polygon points="19,4.5 21.5,7 19,9.5 16.5,7" fill="none" stroke="white" strokeWidth="1.3"/>
    <polygon points="24,14 26,16 24,18 22,16"  fill="none" stroke="white" strokeWidth="1.3"/>
  </svg>
)

export default function Sidebar() {
  const { displayName, initials, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Logo />
        HireLens
      </div>

      <div className="sidebar-user">
        <div className="sidebar-avatar">{initials}</div>
        <div>
          <div className="sidebar-user-name">{displayName}</div>
          <div className="sidebar-user-role">Pro Candidate</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          Dashboard
        </NavLink>
        <NavLink to="/practice" className={({ isActive }) => isActive ? 'active' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          Practice
        </NavLink>
        <NavLink to="/resume" className={({ isActive }) => isActive ? 'active' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          Resume
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => isActive ? 'active' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          History
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Profile
        </NavLink>
      </nav>

      <div className="sidebar-cta">
        <NavLink to="/practice" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '13px', padding: '11px 16px' }}>
          Start Mock Interview
        </NavLink>
      </div>

      <div className="sidebar-bottom">
        <a href="#settings">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
          Settings
        </a>
        <button onClick={handleLogout} style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '12px', fontSize: '13px', color: 'var(--text-secondary)', transition: 'all .2s', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}
          onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
