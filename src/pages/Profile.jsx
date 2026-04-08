import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function Profile() {
  const { user, profile, initials, displayName, avatarUrl, refreshProfile } = useAuth()
  const fileRef = useRef()
  const [uploading, setUploading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(avatarUrl)

  useEffect(() => { setAvatarPreview(avatarUrl) }, [avatarUrl])

  async function handleAvatarChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const ext  = file.name.split('.').pop()
      const path = `${user.id}/avatar.${ext}`
      const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
      if (upErr) throw upErr
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      const url = `${data.publicUrl}?t=${Date.now()}`
      await supabase.from('profiles').update({ avatar_url: url }).eq('id', user.id)
      setAvatarPreview(url)
      await refreshProfile()
    } catch (err) {
      alert('Upload failed: ' + err.message)
    } finally { setUploading(false) }
  }
  const [resumes,     setResumes]     = useState([])
  const [editOpen,    setEditOpen]    = useState(false)
  const [editName,    setEditName]    = useState('')
  const [editSaving,  setEditSaving]  = useState(false)
  const [editError,   setEditError]   = useState('')

  function openEdit() {
    setEditName(displayName)
    setEditError('')
    setEditOpen(true)
  }

  async function saveEdit(e) {
    e.preventDefault()
    if (!editName.trim()) return setEditError('Name cannot be empty.')
    setEditSaving(true)
    try {
      const { error } = await supabase.from('profiles').update({ name: editName.trim() }).eq('id', user.id)
      if (error) throw error
      await refreshProfile()
      setEditOpen(false)
    } catch (err) {
      setEditError(err.message || 'Failed to save.')
    } finally { setEditSaving(false) }
  }

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
          <div className="profile-avatar-lg-wrap" onClick={() => fileRef.current.click()} title="Click to change photo">
            {avatarPreview
              ? <img src={avatarPreview} alt="avatar" className="profile-avatar-lg-img" />
              : <span>{initials}</span>}
            <div className="profile-avatar-edit">
              {uploading
                ? <span className="spinner" style={{ width:14, height:14, borderWidth:2 }}/>
                : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleAvatarChange}/>
          </div>
          <div style={{ flex:1 }}>
            <div className="profile-name">{displayName}</div>
            <div className="profile-role-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Pro Candidate
            </div>
            <div className="profile-email">{user?.email}</div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={openEdit}>Edit Profile</button>
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
      {/* Edit Profile Modal */}
      {editOpen && (
        <div className="legal-overlay" onClick={() => setEditOpen(false)}>
          <div className="legal-modal" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
            <div className="legal-header">
              <h2 className="legal-title">Edit Profile</h2>
              <button className="legal-close" onClick={() => setEditOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <form onSubmit={saveEdit}>
              <div className="legal-body" style={{ padding: '24px' }}>
                {editError && <div className="ac-error" style={{ marginBottom: 16 }}>{editError}</div>}
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    className="form-input"
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    placeholder="Enter your full name"
                    autoFocus
                  />
                </div>
                <div className="form-group" style={{ marginTop: 16 }}>
                  <label className="form-label">Email Address</label>
                  <input
                    className="form-input"
                    type="email"
                    value={user?.email}
                    disabled
                    style={{ opacity: .6, cursor: 'not-allowed' }}
                  />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Email cannot be changed.</span>
                </div>
              </div>
              <div className="legal-footer">
                <button type="submit" className="legal-agree-btn" disabled={editSaving}>
                  {editSaving
                    ? <span className="spinner" style={{ width:18,height:18,borderWidth:2,display:'inline-block',verticalAlign:'middle' }}/>
                    : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
