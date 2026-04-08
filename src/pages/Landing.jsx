import { Link } from 'react-router-dom'
import { useState } from 'react'
import Logo from '../components/Logo'

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="landing-body">

      {/* Navbar */}
      <nav className="landing-nav">
        <Link to="/" className="nav-logo"><Logo size={28}/>HireLens</Link>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#showcase">Success Stories</a>
        </div>
        <div className="nav-actions">
          <Link to="/login" className="nav-signin">Sign In</Link>
          <Link to="/login?tab=signup" className="btn btn-primary btn-sm">Get Started</Link>
        </div>
        {/* Hamburger — mobile only */}
        <button className="nav-hamburger" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
          <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }}/>
          <span style={{ opacity: menuOpen ? 0 : 1 }}/>
          <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }}/>
        </button>
      </nav>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <div className="nav-mobile-drawer">
          <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#pricing"  onClick={() => setMenuOpen(false)}>Pricing</a>
          <a href="#showcase" onClick={() => setMenuOpen(false)}>Success Stories</a>
          <Link to="/login"            className="nav-signin" onClick={() => setMenuOpen(false)}>Sign In</Link>
          <Link to="/login?tab=signup" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Get Started</Link>
        </div>
      )}

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
              <Link to="/login?tab=signup" className="btn btn-primary btn-lg">Start Practice →</Link>
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
            { icon: 'blue',   title: 'Mock Interviews',    desc: 'Roleplay with hundreds of specialized AI interviewers tailored to specific industries and seniority levels.', svgPath: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>, stroke: '#5B4EFF' },
            { icon: 'purple', title: 'Instant AI Feedback', desc: 'Receive granular analysis of your body language, tone of voice, and content accuracy within seconds.',         svgPath: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>,                    stroke: '#8B5CF6' },
            { icon: 'pink',   title: 'Confidence Boost',   desc: 'Our proprietary training modules help you eliminate filler words and master the art of storytelling.',          svgPath: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,              stroke: '#EF4444' },
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
      <section id="showcase" className="showcase-section">
        <div className="showcase-inner">
          <div className="showcase-voice">
            <div className="showcase-voice-bg"/>
            <div className="showcase-voice-content">
              <h2>Analyze Every Nuance of Your Voice</h2>
              <p>Our AI tracks your pitch, tempo, and emotional tone to provide an editorial-grade review of your vocal delivery.</p>
              <Link to="/login?tab=signup" style={{ background:'var(--gradient-primary)', color:'white', padding:'10px 22px', borderRadius:'var(--radius-full)', fontSize:13, fontWeight:600, textDecoration:'none', display:'inline-block' }}>Explore Vocal Insights</Link>
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

      {/* Success Stories */}
      <section id="showcase" className="ss-section">
        <div className="ss-eyebrow">Success Stories</div>
        <h2 className="ss-heading">Trusted by Candidates Who <span className="highlight">Got the Offer</span></h2>
        <p className="ss-sub">Real results from real people who used HireLens to land roles at the world's top companies.</p>

        <div className="ss-grid">
          {[
            {
              initials: 'SR', name: 'Sophia Rahman', role: 'Software Engineer @ Google',
              stars: 5, color: '#5B4EFF',
              quote: '"After 3 failed loops, HireLens helped me identify my exact weak points. Two weeks later I had an offer from Google. The AI feedback is frighteningly accurate."',
              tag: 'System Design Track',
            },
            {
              initials: 'DC', name: 'David Chen', role: 'Senior PM @ Meta',
              stars: 5, color: '#8B5CF6',
              quote: '"The behavioral interview coach pushed me in ways a human coach never did. It called out my vague answers instantly. My confidence went from 40% to 94% in a month."',
              tag: 'Product Management Track',
            },
            {
              initials: 'AL', name: 'Aisha Laurent', role: 'Data Scientist @ Microsoft',
              stars: 5, color: '#EC4899',
              quote: '"I landed 4 offers simultaneously. HireLens made me obsessively prepared. Every question felt familiar because I\'d already practiced 10 variations of it."',
              tag: 'Data Science Track',
            },
            {
              initials: 'MJ', name: 'Marcus Johnson', role: 'Engineering Manager @ Amazon',
              stars: 5, color: '#10B981',
              quote: '"The leadership question simulations are elite. It felt like a real panel interview every time. I walked into Amazon\'s loop feeling like I\'d already done it before."',
              tag: 'Leadership Track',
            },
            {
              initials: 'PK', name: 'Priya Kapoor', role: 'UX Designer @ Apple',
              stars: 5, color: '#F59E0B',
              quote: '"Portfolio critiques, design challenge walkthroughs, stakeholder Q&A — HireLens covered every corner of my Apple design interview. I was over-prepared in the best way."',
              tag: 'Design Track',
            },
            {
              initials: 'TW', name: 'Tyler Wu', role: 'Quant Analyst @ Jane Street',
              stars: 5, color: '#3B82F6',
              quote: '"The mental math and probability drills are no joke. HireLens stress-tested me harder than the actual interview. I felt completely calm on the day."',
              tag: 'Finance & Quant Track',
            },
          ].map(t => (
            <div key={t.name} className="ss-card">
              <div className="ss-stars">{'★'.repeat(t.stars)}</div>
              <p className="ss-quote">{t.quote}</p>
              <div className="ss-tag">{t.tag}</div>
              <div className="ss-author">
                <div className="ss-avatar" style={{ background: t.color }}>{t.initials}</div>
                <div>
                  <div className="ss-name">{t.name}</div>
                  <div className="ss-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="ss-stats">
          {[
            { num: '50k+', lbl: 'Candidates Trained' },
            { num: '94%',  lbl: 'Offer Success Rate' },
            { num: '200+', lbl: 'Companies Represented' },
            { num: '4.9★', lbl: 'Average Rating' },
          ].map(s => (
            <div key={s.lbl} className="ss-stat">
              <div className="ss-stat-num">{s.num}</div>
              <div className="ss-stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="cta-section">
        <h2>Ready to Land Your Dream Job?</h2>
        <p>Join over 50,000 candidates who used our cognitive sanctuary to build unshakeable confidence.</p>
        <Link to="/login?tab=signup" className="cta-btn">Start Practice for Free</Link>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div>
          <div className="footer-logo"><Logo size={22}/>HireLens</div>
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
