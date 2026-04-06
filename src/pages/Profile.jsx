import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function Profile() {
  const { user, profile, initials, displayName } = useAuth()
  const [resumes, setResumes] = useState([])

  useEffect(() => {
    if (!user) return
    supabase.from('resumes').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
      .then(({ data }) => { if (data?.length) setResumes(data) })
  }, [user])

  const joinedDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—'

  const CATEGORIES = [
    { label: 'Behavioral',     pct: 72 },
    { label: 'Problem Solving', pct: 85 },
    { label: 'Leadership',      pct: 91 },
    { label: 'Technical',       pct: 68 },
  ]

  return (
    <AppLayout>
      <div className="profile-layout">
        {/* Header Card */}
        <div className="profile-header-card">
          <div className="profile-avatar-lg">{initials}</div>
          <div style={{ flex:1 }}>
            <div className="profile-name">{displayName}</div>
            <div className="profile-role-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Pro Candidate
            </div>
            <div className="profile-email">{user?.email}</div>
          </div>
          <button className="btn btn-secondary btn-sm">Edit Profile</button>
        </div>

        {/* Stats Grid */}
        <div className="profile-stats-grid">
          <div className="card profile-stat-card">
            <div className="profile-stat-value">{profile?.avg_score ?? 0}</div>
            <div className="profile-stat-label">Average Score</div>
          </div>
          <div className="card profile-stat-card">
            <div className="profile-stat-value">{profile?.total_interviews ?? 0}</div>
            <div className="profile-stat-label">Interviews Practiced</div>
          </div>
          <div className="card profile-stat-card">
            <div className="profile-stat-value">{profile?.total_resumes ?? 0}</div>
            <div className="profile-stat-label">Resumes Analyzed</div>
          </div>
        </div>

        {/* Info + Category */}
        <div className="profile-info-grid">
          <div className="card profile-info-card">
            <h4>Personal Information</h4>
            {[
              { label: 'Full Name',     value: displayName },
              { label: 'Email Address', value: user?.email },
              { label: 'Member Since',  value: joinedDate },
              { label: 'Account Type',  value: 'Pro Candidate' },
            ].map(f => (
              <div key={f.label} className="profile-field">
                <div className="profile-field-label">{f.label}</div>
                <div className="profile-field-value">{f.value}</div>
              </div>
            ))}
          </div>

          <div className="card profile-info-card">
            <h4>Interview Category Breakdown</h4>
            {CATEGORIES.map(c => (
              <div key={c.label} className="profile-field">
                <div className="profile-field-label">{c.label}</div>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:4 }}>
                  <div className="progress-bar-track" style={{ flex:1 }}>
                    <div className="progress-bar-fill" style={{ width:`${c.pct}%` }}/>
                  </div>
                  <span style={{ fontSize:13, fontWeight:700 }}>{c.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resume History */}
        <div className="card" style={{ padding:'24px 28px' }}>
          <div className="section-header" style={{ marginBottom:16 }}>
            <h4>Resume Analysis History</h4>
            <Link to="/resume" className="view-all-link">Analyze New Resume</Link>
          </div>
          {resumes.length === 0
            ? (
              <div style={{ textAlign:'center', padding:32, color:'var(--text-muted)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="36" height="36" strokeLinecap="round" strokeLinejoin="round" style={{ margin:'0 auto 10px', display:'block', opacity:.4 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                No resume analyses yet. <Link to="/resume" style={{ color:'var(--primary)', fontWeight:600 }}>Upload your first resume →</Link>
              </div>
            )
            : resumes.map(r => (
              <div key={r.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid #F3F4F6' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:36, height:36, background:'#F3F4F6', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" width="16" height="16" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600 }}>{r.file_name || 'Resume.pdf'}</div>
                    <div style={{ fontSize:11, color:'var(--text-muted)' }}>{new Date(r.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ fontSize:'1.1rem', fontWeight:800, color:'var(--primary)' }}>{r.score}<span style={{ fontSize:11, fontWeight:400, color:'var(--text-muted)' }}>/100</span></div>
                  <Link to="/resume" style={{ fontSize:12, fontWeight:700, color:'var(--primary)' }}>View →</Link>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </AppLayout>
  )
}
