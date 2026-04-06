import { Link } from 'react-router-dom'

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

export default function Landing() {
  return (
    <div className="landing-body">
      {/* Navbar */}
      <nav className="landing-nav">
        <Link to="/" className="nav-logo"><Logo />HireLens</Link>
        <div className="nav-links">
          <a href="#features">Product</a>
          <a href="#">Pricing</a>
          <a href="#">Resources</a>
        </div>
        <div className="nav-actions">
          <Link to="/login" className="nav-signin">Sign In</Link>
          <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: 'var(--gradient-hero)' }}>
        <div className="hero">
          <div>
            <div className="hero-eyebrow">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><circle cx="6" cy="6" r="6"/></svg>
              AI-Powered Career Growth
            </div>
            <h1>Master Your<br/>Interviews <span className="highlight">with AI</span></h1>
            <p>The world's most advanced cognitive sanctuary for career preparation. Practice with realistic AI personas and receive real-time emotional and technical feedback.</p>
            <div className="hero-actions">
              <Link to="/signup" className="btn btn-primary btn-lg">Start Practice →</Link>
              <a href="#features" className="btn btn-secondary btn-lg">View Demo</a>
            </div>
          </div>
          <div className="hero-preview">
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:'var(--gradient-primary)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700 }}>AR</div>
              <div>
                <div style={{ fontSize:14, fontWeight:700 }}>Alex Rivera</div>
                <div style={{ fontSize:11, color:'var(--primary)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.05em' }}>Pro Candidate</div>
              </div>
              <div style={{ marginLeft:'auto', display:'flex', gap:5 }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:'#FF5F57' }}/>
                <div style={{ width:10, height:10, borderRadius:'50%', background:'#FEBC2E' }}/>
                <div style={{ width:10, height:10, borderRadius:'50%', background:'#28C840' }}/>
              </div>
            </div>
            <div className="preview-confidence">
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'var(--text-secondary)' }}>Confidence Score</div>
                <div className="preview-bar"><div className="preview-bar-fill"/></div>
              </div>
              <div className="preview-confidence-value">88%</div>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:8 }}>
              <div style={{ flex:1, background:'#F9FAFB', borderRadius:10, padding:12, fontSize:12, color:'var(--text-muted)' }}>Response Quality<strong style={{ display:'block', color:'var(--text-primary)', fontSize:'1rem', marginTop:2 }}>High</strong></div>
              <div style={{ flex:1, background:'#F9FAFB', borderRadius:10, padding:12, fontSize:12, color:'var(--text-muted)' }}>Clarity Score<strong style={{ display:'block', color:'var(--text-primary)', fontSize:'1rem', marginTop:2 }}>91%</strong></div>
            </div>
            <div className="preview-feedback-badge">
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', opacity:.8, marginBottom:6 }}>✦ AI Feedback</div>
              "Great use of the STAR method here. Try slowing down your conclusion for more impact."
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features-section">
        <h2>Designed for Peak Performance</h2>
        <p className="section-eyebrow">We've eliminated the friction of interview preparation by combining cutting-edge LLMs with behavioral science.</p>
        <div className="features-grid">
          {[
            { icon: 'blue', title: 'Mock Interviews', desc: 'Roleplay with hundreds of specialized AI interviewers tailored to specific industries and seniority levels.', svgPath: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>, stroke: '#5B4EFF' },
            { icon: 'purple', title: 'Instant AI Feedback', desc: 'Receive granular analysis of your body language, tone of voice, and content accuracy within seconds.', svgPath: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>, stroke: '#8B5CF6' },
            { icon: 'pink', title: 'Confidence Boost', desc: 'Our proprietary training modules help you eliminate filler words and master the art of storytelling.', svgPath: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>, stroke: '#EF4444' },
          ].map(f => (
            <div key={f.title} className="feature-card">
              <div className={`feature-icon feature-icon-${f.icon}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke={f.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{f.svgPath}</svg>
              </div>
              <h3>{f.title}</h3>
              <p style={{ fontSize:13, lineHeight:1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Showcase */}
      <section className="showcase-section">
        <div className="showcase-inner">
          <div className="showcase-voice">
            <div className="showcase-voice-bg"/>
            <div className="showcase-voice-content">
              <h2>Analyze Every Nuance of Your Voice</h2>
              <p>Our AI tracks your pitch, tempo, and emotional tone to provide an editorial-grade review of your vocal delivery.</p>
              <Link to="/signup" style={{ background:'var(--gradient-primary)', color:'white', padding:'10px 22px', borderRadius:'var(--radius-full)', fontSize:13, fontWeight:600, textDecoration:'none', display:'inline-block' }}>Explore Vocal Insights</Link>
            </div>
          </div>
          <div className="showcase-cert">
            <div className="cert-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
            </div>
            <h3>Certified Preparation</h3>
            <p>Earn certificates recognized by top tech recruiters as you master specific interview tracks.</p>
            <div className="cert-users">
              <div className="cert-avatars">
                <div className="cert-avatar">JL</div>
                <div className="cert-avatar">MK</div>
                <div className="cert-avatar">SR</div>
              </div>
              <span className="cert-count">+12k candidates certified</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to Land Your Dream Job?</h2>
        <p>Join over 50,000 candidates who used our cognitive sanctuary to build unshakeable confidence.</p>
        <Link to="/signup" className="cta-btn">Start Practice for Free</Link>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div>
          <div className="footer-logo"><Logo/>HireLens</div>
          <div className="footer-copy">© 2026 HireLens. The Cognitive Sanctuary.</div>
        </div>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </footer>
    </div>
  )
}
