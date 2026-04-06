import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Logo = () => (
  <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
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

export default function Signup() {
  const { signUp } = useAuth()
  const navigate   = useNavigate()

  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!name || !email || !password) return setError('Please fill in all fields.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true)
    try {
      await signUp(name, email, password)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.message || ''
      if (msg.includes('already registered')) setError('That email is already in use.')
      else if (msg.includes('valid email'))   setError('Please enter a valid email address.')
      else setError(msg || 'Sign up failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-page">
      {/* Left */}
      <div className="signup-left">
        <div className="signup-logo"><Logo/>HireLens</div>
        <div className="signup-steps">
          <div className="step-indicator active"/>
          <div className="step-indicator"/>
          <div className="step-indicator"/>
          <span className="step-label">Step 01 of 03</span>
        </div>
        <h1 style={{ fontSize:'2.2rem', marginBottom:6 }}>Create your sanctuary</h1>
        <p className="signup-subtitle">Start your journey to career mastery with AI-driven interview preparation.</p>

        {error && <div style={{ background:'#FEE2E2', color:'#991B1B', padding:'10px 14px', borderRadius:10, fontSize:13, marginBottom:16 }}>{error}</div>}

        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input id="name" type="text" className="form-input" placeholder="Alex Rivera"
              value={name} onChange={e => setName(e.target.value)} autoComplete="name" required/>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input id="email" type="email" className="form-input" placeholder="alex@rivera.com"
              value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required/>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input id="password" type={showPwd ? 'text' : 'password'} className="form-input" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" required/>
              <button type="button" className="password-toggle" onClick={() => setShowPwd(v => !v)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: showPwd ? .5 : 1 }}>
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary signup-btn" disabled={loading}>
            {loading ? <><span className="spinner" style={{ width:18, height:18, borderWidth:2, display:'inline-block', verticalAlign:'middle', marginRight:8 }}/>Creating…</> : 'Create Account'}
          </button>
        </form>

        <p className="signup-footer-text">Already have an account? <Link to="/login">Sign In</Link></p>

        <div className="signup-badges">
          <div className="signup-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Enterprise Secure
          </div>
          <div className="signup-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
            AI Optimized
          </div>
        </div>

        <div className="signup-left-footer">
          <span>© 2026 HireLens</span>
          <div style={{ display:'flex', gap:16 }}><a href="#">Privacy</a><a href="#">Terms</a></div>
        </div>
      </div>

      {/* Right */}
      <div className="signup-right">
        <div className="signup-right-content">
          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-quote">"The feedback I received was surgical. It didn't just tell me what was wrong, it showed me how to articulate my value with confidence I never knew I had."</p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">DC</div>
              <div>
                <div className="testimonial-name">David Chen</div>
                <div className="testimonial-title">Senior Product Manager @ TechFlow</div>
              </div>
            </div>
          </div>
          <div className="signup-stats">
            <div><div className="signup-stat-number">12k+</div><div className="signup-stat-label">Interviews Conducted</div></div>
            <div><div className="signup-stat-number">94%</div><div className="signup-stat-label">Hire Success Rate</div></div>
          </div>
        </div>
      </div>
    </div>
  )
}
