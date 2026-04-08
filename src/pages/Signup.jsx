import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Logo from '../components/Logo'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate   = useNavigate()

  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [agreed,   setAgreed]   = useState(false)

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
    <div className="gr-page">

      {/* ── Left panel ── */}
      <div className="gr-left">
        <div className="gr-card">

          <div className="gr-logo">
            <Logo size={28} />
            <span>HireLens</span>
          </div>

          <h2 className="gr-heading">Join HireLens Today!</h2>
          <p className="gr-subheading">Start Your AI-Powered Interview Journey</p>

          {/* Sign In / Sign Up tabs */}
          <div className="gr-tabs">
            <Link to="/login" className="gr-tab">Sign In</Link>
            <button className="gr-tab gr-tab-active" type="button">Sign Up</button>
          </div>

          {error && <div className="gr-error">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>

            {/* Full Name */}
            <div className="gr-field">
              <input
                type="text"
                className="gr-input"
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
                required
              />
              <span className="gr-input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  width="18" height="18" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
            </div>

            {/* Email */}
            <div className="gr-field">
              <input
                type="email"
                className="gr-input"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              <span className="gr-input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  width="18" height="18" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
            </div>

            {/* Password */}
            <div className="gr-field">
              <input
                type={showPwd ? 'text' : 'password'}
                className="gr-input"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="gr-input-icon gr-eye-btn"
                onClick={() => setShowPwd(v => !v)}
              >
                {showPwd ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    width="18" height="18" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    width="18" height="18" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Terms row */}
            <div className="gr-terms-row">
              <label className="gr-check-label">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  className="gr-checkbox"
                />
                <span>I agree to the <a href="#">Terms</a> &amp; <a href="#">Privacy Policy</a></span>
              </label>
            </div>

            <button type="submit" className="gr-submit-btn" disabled={loading}>
              {loading
                ? <><span className="spinner" style={{ width:18, height:18, borderWidth:2, display:'inline-block', verticalAlign:'middle', marginRight:8 }}/>Creating…</>
                : 'Create Account'
              }
            </button>
          </form>

          <div className="gr-divider"><span>OR</span></div>

          <button className="gr-social-btn gr-google-btn" type="button">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>

          <p className="gr-footer-text">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>

      {/* ── Right panel — animated fluid blobs ── */}
      <div className="gr-right">
        <div className="gr-blob gr-blob-1" />
        <div className="gr-blob gr-blob-2" />
        <div className="gr-blob gr-blob-3" />

        {/* Product mockup */}
        <div className="gr-mockup">
          {/* Browser chrome */}
          <div className="gr-mockup-bar">
            <span className="gr-dot gr-dot-r" />
            <span className="gr-dot gr-dot-y" />
            <span className="gr-dot gr-dot-g" />
            <div className="gr-url-bar">hirelens.ai/interview</div>
          </div>

          {/* App body */}
          <div className="gr-mockup-body">
            {/* Top label */}
            <div className="gr-mk-header">
              <div className="gr-mk-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  width="12" height="12" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                </svg>
                Live Session
              </div>
              <div className="gr-mk-score">Score: <strong>87</strong></div>
            </div>

            {/* Question card */}
            <div className="gr-mk-question">
              <div className="gr-mk-q-label">Question 2 of 5</div>
              <p className="gr-mk-q-text">Tell me about a time you led a cross-functional team through a high-pressure product launch.</p>
            </div>

            {/* AI feedback pills */}
            <div className="gr-mk-feedback-row">
              <div className="gr-mk-pill gr-pill-green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  width="11" height="11" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Strong STAR structure
              </div>
              <div className="gr-mk-pill gr-pill-amber">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  width="11" height="11" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add metrics
              </div>
              <div className="gr-mk-pill gr-pill-blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  width="11" height="11" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Tone confident
              </div>
            </div>

            {/* Score bar */}
            <div className="gr-mk-bar-wrap">
              <div className="gr-mk-bar-labels">
                <span>Clarity</span><span>87%</span>
              </div>
              <div className="gr-mk-bar-track">
                <div className="gr-mk-bar-fill" style={{ width: '87%' }} />
              </div>
            </div>
            <div className="gr-mk-bar-wrap">
              <div className="gr-mk-bar-labels">
                <span>Confidence</span><span>74%</span>
              </div>
              <div className="gr-mk-bar-track">
                <div className="gr-mk-bar-fill gr-bar-accent" style={{ width: '74%' }} />
              </div>
            </div>

            {/* Bottom action row */}
            <div className="gr-mk-actions">
              <div className="gr-mk-mic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  width="16" height="16" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              </div>
              <div className="gr-mk-next-btn">Next Question →</div>
            </div>
          </div>
        </div>

        <div className="gr-right-content">
          <div className="gr-right-card">
            <div className="gr-stars">★★★★★</div>
            <p className="gr-quote">
              "The feedback I received was surgical. It didn't just tell me what was wrong —
              it showed me how to articulate my value with confidence I never knew I had."
            </p>
            <div className="gr-author">
              <div className="gr-avatar">DC</div>
              <div>
                <div className="gr-author-name">David Chen</div>
                <div className="gr-author-title">Senior PM @ TechFlow</div>
              </div>
            </div>
          </div>

          <div className="gr-stats">
            <div>
              <div className="gr-stat-num">12k+</div>
              <div className="gr-stat-lbl">Interviews Done</div>
            </div>
            <div>
              <div className="gr-stat-num">94%</div>
              <div className="gr-stat-lbl">Hire Success Rate</div>
            </div>
          </div>
        </div>

        <div className="gr-copyright">© 2026 HireLens. All rights reserved.</div>
      </div>

    </div>
  )
}
