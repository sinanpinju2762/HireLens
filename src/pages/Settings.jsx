import { useState } from 'react'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

function Section({ title, children }) {
  return (
    <div className="card" style={{ padding:'28px 32px', marginBottom:20 }}>
      <h4 style={{ marginBottom:20, paddingBottom:14, borderBottom:'1px solid #F3F4F6' }}>{title}</h4>
      {children}
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:24, padding:'14px 0', borderBottom:'1px solid #F9FAFB' }}>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:14, fontWeight:600, color:'var(--text-primary)' }}>{label}</div>
        {hint && <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:3 }}>{hint}</div>}
      </div>
      <div style={{ minWidth:200 }}>{children}</div>
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width:44, height:24, borderRadius:12, border:'none', cursor:'pointer',
        background: value ? 'var(--primary)' : '#D1D5DB',
        position:'relative', transition:'background .2s', flexShrink:0,
      }}
    >
      <span style={{
        position:'absolute', top:3, left: value ? 22 : 3,
        width:18, height:18, borderRadius:'50%', background:'white',
        transition:'left .2s', boxShadow:'0 1px 4px rgba(0,0,0,.2)',
        display:'block',
      }}/>
    </button>
  )
}

export default function Settings() {
  const { user, profile, displayName, initials, refreshProfile } = useAuth()
  const [theme, setTheme] = useState('light')

  // Profile form
  const [name,       setName]       = useState(profile?.name  || '')
  const [saving,     setSaving]     = useState(false)
  const [saveMsg,    setSaveMsg]    = useState('')

  // Password form
  const [newPwd,     setNewPwd]     = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [pwdMsg,     setPwdMsg]     = useState('')
  const [pwdSaving,  setPwdSaving]  = useState(false)

  // Notifications
  const [notif, setNotif] = useState({
    practiceReminders: true,
    weeklyReport:      true,
    productUpdates:    false,
    tipsAndTricks:     true,
  })

  // Appearance
  const [language, setLanguage] = useState('en')

  async function handleSaveProfile(e) {
    e.preventDefault()
    if (!name.trim()) return setSaveMsg('Name cannot be empty.')
    setSaving(true)
    setSaveMsg('')
    const { error } = await supabase.from('profiles').update({ name: name.trim() }).eq('id', user.id)
    if (error) setSaveMsg('Failed to save. Please try again.')
    else {
      await refreshProfile()
      setSaveMsg('Profile updated successfully.')
    }
    setSaving(false)
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    setPwdMsg('')
    if (newPwd.length < 6)       return setPwdMsg('Password must be at least 6 characters.')
    if (newPwd !== confirmPwd)    return setPwdMsg('Passwords do not match.')
    setPwdSaving(true)
    const { error } = await supabase.auth.updateUser({ password: newPwd })
    if (error) setPwdMsg(error.message || 'Failed to update password.')
    else {
      setPwdMsg('Password changed successfully.')
      setNewPwd('')
      setConfirmPwd('')
    }
    setPwdSaving(false)
  }

  return (
    <AppLayout>
      <div style={{ marginBottom:28 }}>
        <h2>Settings</h2>
        <p style={{ fontSize:14 }}>Manage your account preferences and security.</p>
      </div>

      {/* Profile */}
      <Section title="Profile Information">
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
          <div style={{
            width:64, height:64, borderRadius:'50%',
            background:'var(--gradient-primary)', color:'white',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'1.4rem', fontWeight:700, flexShrink:0,
          }}>{initials}</div>
          <div>
            <div style={{ fontSize:16, fontWeight:700 }}>{displayName}</div>
            <div style={{ fontSize:13, color:'var(--text-muted)' }}>{user?.email}</div>
          </div>
        </div>
        <form onSubmit={handleSaveProfile}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
            <div className="form-group" style={{ margin:0 }}>
              <label className="form-label">Full Name</label>
              <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name"/>
            </div>
            <div className="form-group" style={{ margin:0 }}>
              <label className="form-label">Email Address</label>
              <input className="form-input" value={user?.email || ''} disabled style={{ background:'#F9FAFB', cursor:'not-allowed', opacity:.7 }}/>
            </div>
          </div>
          {saveMsg && (
            <div style={{
              fontSize:13, padding:'8px 12px', borderRadius:8, marginBottom:12,
              background: saveMsg.includes('success') ? '#D1FAE5' : '#FEE2E2',
              color:      saveMsg.includes('success') ? '#065F46' : '#991B1B',
            }}>{saveMsg}</div>
          )}
          <button type="submit" className="btn btn-primary btn-sm" disabled={saving} style={{ minWidth:120 }}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </Section>

      {/* Password */}
      <Section title="Change Password">
        <form onSubmit={handleChangePassword}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
            <div className="form-group" style={{ margin:0 }}>
              <label className="form-label">New Password</label>
              <input className="form-input" type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="Min. 6 characters"/>
            </div>
            <div className="form-group" style={{ margin:0 }}>
              <label className="form-label">Confirm Password</label>
              <input className="form-input" type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} placeholder="Repeat new password"/>
            </div>
          </div>
          {pwdMsg && (
            <div style={{
              fontSize:13, padding:'8px 12px', borderRadius:8, marginBottom:12,
              background: pwdMsg.includes('success') ? '#D1FAE5' : '#FEE2E2',
              color:      pwdMsg.includes('success') ? '#065F46' : '#991B1B',
            }}>{pwdMsg}</div>
          )}
          <button type="submit" className="btn btn-primary btn-sm" disabled={pwdSaving} style={{ minWidth:140 }}>
            {pwdSaving ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        <Field label="Practice Reminders" hint="Daily reminder to keep your streak going">
          <div style={{ display:'flex', justifyContent:'flex-end' }}>
            <Toggle value={notif.practiceReminders} onChange={v => setNotif(p => ({ ...p, practiceReminders: v }))}/>
          </div>
        </Field>
        <Field label="Weekly Progress Report" hint="Summary of your weekly interview performance">
          <div style={{ display:'flex', justifyContent:'flex-end' }}>
            <Toggle value={notif.weeklyReport} onChange={v => setNotif(p => ({ ...p, weeklyReport: v }))}/>
          </div>
        </Field>
        <Field label="Product Updates" hint="New features, improvements and announcements">
          <div style={{ display:'flex', justifyContent:'flex-end' }}>
            <Toggle value={notif.productUpdates} onChange={v => setNotif(p => ({ ...p, productUpdates: v }))}/>
          </div>
        </Field>
        <Field label="Tips & Tricks" hint="Interview tips and career advice">
          <div style={{ display:'flex', justifyContent:'flex-end' }}>
            <Toggle value={notif.tipsAndTricks} onChange={v => setNotif(p => ({ ...p, tipsAndTricks: v }))}/>
          </div>
        </Field>
      </Section>

      {/* Appearance */}
      <Section title="Appearance & Language">
        <Field label="Theme" hint="Choose your preferred display theme">
          <div style={{ display:'flex', gap:8 }}>
            {[
              { value:'light',  label:'Light', icon:'☀️' },
              { value:'dark',   label:'Dark',  icon:'🌙' },
              { value:'system', label:'System', icon:'💻' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                style={{
                  flex:1, padding:'8px 6px', borderRadius:10, fontSize:12, fontWeight:600,
                  border: theme === opt.value ? '2px solid var(--primary)' : '1.5px solid #E5E7EB',
                  background: theme === opt.value ? 'rgba(91,78,255,.08)' : 'transparent',
                  color: theme === opt.value ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor:'pointer', transition:'all .15s',
                  display:'flex', flexDirection:'column', alignItems:'center', gap:4,
                }}
              >
                <span style={{ fontSize:18 }}>{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Language" hint="Interface display language">
          <select
            className="form-input"
            value={language}
            onChange={e => setLanguage(e.target.value)}
            style={{ padding:'8px 12px', fontSize:13 }}
          >
            <option value="en">English</option>
            <option value="tr">Turkish</option>
            <option value="de">German</option>
            <option value="fr">French</option>
          </select>
        </Field>
      </Section>

      {/* Danger Zone */}
      <Section title="Danger Zone">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>
          <div>
            <div style={{ fontSize:14, fontWeight:600 }}>Delete Account</div>
            <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:3 }}>Permanently delete your account and all your data. This cannot be undone.</div>
          </div>
          <button
            className="btn btn-sm"
            style={{ background:'#FEE2E2', color:'#991B1B', border:'1px solid #FECACA', flexShrink:0 }}
            onClick={() => alert('To delete your account, please contact support@hirelens.ai')}
          >
            Delete Account
          </button>
        </div>
      </Section>
    </AppLayout>
  )
}
