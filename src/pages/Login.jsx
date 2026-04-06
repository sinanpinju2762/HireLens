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

export default function Login() {
  const { signIn, resetPassword } = useAuth()
  const navigate = useNavigate()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  function friendly(code) {
    const m = {
      'invalid_credentials': 'Incorrect email or password.',
      'user_not_found':      'No account with that email.',
      'email_not_confirmed': 'Please confirm your email first.',
    }
    return m[code] || 'Something went wrong. Please try again.'
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) return setError('Please fill in all fields.')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(friendly(err.message?.toLowerCase().includes('invalid') ? 'invalid_credentials' : err.code || ''))
    } finally {
      setLoading(false)
    }
  }

  async function handleForgot(e) {
    e.preventDefault()
    if (!email) return setError('Enter your email first.')
    try {
      await resetPassword(email)
      setError('')
      alert('Password reset email sent!')
    } catch {
      setError('Could not send reset email.')
    }
  }

  return (
    <div className="auth-page">
      <nav className="auth-nav">
        <Link to="/" className="auth-nav-logo"><Logo/>HireLens</Link>
        <Link to="/signup" className="auth-nav-link">Join the Elite</Link>
      </nav>

      <div className="login-body">
        <div className="login-card">
          <h1>Welcome Back</h1>
          <p className="subtitle">Continue your journey to the cognitive sanctuary.</p>

          {error && <div style={{ background:'#FEE2E2', color:'#991B1B', padding:'10px 14px', borderRadius:10, fontSize:13, marginBottom:16 }}>{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="login-fields">
              <div className="form-group">
                <label className="form-label" htmlFor="email">Work Email</label>
                <input id="email" type="email" className="form-input" placeholder="name@company.com"
                  value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required/>
              </div>
              <div className="form-group">
                <div className="field-header">
                  <label className="form-label" htmlFor="password">Password</label>
                  <a href="#" className="forgot-link" onClick={handleForgot}>Forgot Password?</a>
                </div>
                <input id="password" type="password" className="form-input" placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required/>
              </div>
            </div>
            <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
              {loading ? <span className="spinner" style={{ width:18, height:18, borderWidth:2, display:'inline-block', verticalAlign:'middle' }}/> : 'Sign In →'}
            </button>
          </form>

          <p className="login-divider">New to the sanctuary?</p>
          <Link to="/signup" className="join-btn">Join the Elite</Link>

          <div className="login-trust">
            <p>Trusted by Candidates at Global Leaders</p>
            <div className="trust-logos">
              {'GMANS'.split('').map(l => <div key={l} className="trust-logo">{l}</div>)}
            </div>
          </div>
        </div>
      </div>

      <footer className="auth-footer">
        <span>© 2026 HireLens. The Cognitive Sanctuary.</span>
        <div className="auth-footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </footer>
    </div>
  )
}
