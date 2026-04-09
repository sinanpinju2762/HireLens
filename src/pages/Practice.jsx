import { useState, useEffect, useRef } from 'react'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { analyzeInterviewResponse } from '../lib/claude'

const QUESTIONS = [
  // Behavioral
  { text: 'Tell me about a time you handled a conflict within a team.', category: 'Behavioral' },
  { text: 'Describe a situation where you had to meet a tight deadline. How did you manage it?', category: 'Behavioral' },
  { text: 'What is your greatest professional failure and what did you learn?', category: 'Behavioral' },
  { text: 'Tell me about a time you went above and beyond for a project or customer.', category: 'Behavioral' },
  { text: 'Describe a situation where you had to adapt quickly to a major change at work.', category: 'Behavioral' },
  { text: 'Tell me about a time you disagreed with your manager. How did you handle it?', category: 'Behavioral' },
  { text: 'Describe a time when you had to work with a difficult colleague.', category: 'Behavioral' },
  { text: 'Tell me about a time you made a mistake. How did you fix it?', category: 'Behavioral' },

  // Problem Solving
  { text: 'Tell me about the most challenging project you have worked on.', category: 'Problem Solving' },
  { text: 'Describe a time you had to solve a problem with limited resources or information.', category: 'Problem Solving' },
  { text: 'Tell me about a time you identified a problem before it became serious.', category: 'Problem Solving' },
  { text: 'How do you approach breaking down a complex problem into smaller parts?', category: 'Problem Solving' },

  // Leadership
  { text: 'How do you prioritize competing deadlines in a high-pressure environment?', category: 'Leadership' },
  { text: 'Describe a time when you led a team through a difficult situation.', category: 'Leadership' },
  { text: 'Tell me about a time you had to motivate a demotivated team member.', category: 'Leadership' },
  { text: 'How do you handle giving negative feedback to someone on your team?', category: 'Leadership' },
  { text: 'Describe a time you had to make a tough decision with incomplete information.', category: 'Leadership' },

  // Technical
  { text: 'How do you stay up to date with new technologies in your field?', category: 'Technical' },
  { text: 'Describe a technical challenge you faced and how you solved it.', category: 'Technical' },
  { text: 'How do you ensure the quality and reliability of your work?', category: 'Technical' },

  // Career
  { text: 'Where do you see yourself in 5 years?', category: 'Career' },
  { text: 'Why do you want to leave your current job?', category: 'Career' },
  { text: 'What motivates you in your work?', category: 'Career' },
  { text: 'Tell me about yourself and your background.', category: 'Career' },
  { text: 'What are your greatest strengths and weaknesses?', category: 'Career' },
]

function badgeClass(r = '') {
  if (r.toLowerCase().includes('excellent')) return 'badge-excellent'
  if (r.toLowerCase().includes('needs') || r.toLowerCase().includes('improve')) return 'badge-improve'
  return 'badge-good'
}

const CATEGORIES = ['All', 'Behavioral', 'Problem Solving', 'Leadership', 'Technical', 'Career']

export default function Practice() {
  const { user, refreshProfile } = useAuth()
  const [category,   setCategory]   = useState('All')
  const [qIdx,       setQIdx]       = useState(0)
  const [answer,     setAnswer]     = useState('')
  const [loading,    setLoading]    = useState(false)
  const [feedback,   setFeedback]   = useState(null)
  const [seconds,    setSeconds]    = useState(300)
  const [toast,      setToast]      = useState(null)
  const timerRef = useRef(null)
  const feedbackRef = useRef(null)

  const filtered = category === 'All' ? QUESTIONS : QUESTIONS.filter(q => q.category === category)

  function showToast(msg, type = 'default') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  function startTimer() {
    clearInterval(timerRef.current)
    setSeconds(300)
    timerRef.current = setInterval(() => {
      setSeconds(s => { if (s <= 1) { clearInterval(timerRef.current); return 0; } return s - 1 })
    }, 1000)
  }

  useEffect(() => { startTimer(); return () => clearInterval(timerRef.current) }, [qIdx])

  function loadQuestion(idx) {
    setQIdx(idx); setAnswer(''); setFeedback(null)
  }

  async function analyze() {
    if (!answer.trim() || answer.trim().length < 20) {
      showToast('Write a more complete answer before analyzing.', 'error'); return
    }
    setLoading(true)
    try {
      const fb = await analyzeInterviewResponse(filtered[qIdx].text, answer)
      setFeedback(fb)
      setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
      // Save to Supabase
      if (user) {
        await supabase.from('interviews').insert({
          user_id:  user.id,
          question: filtered[qIdx].text,
          answer,
          category: filtered[qIdx].category,
          score:    fb.overall_score ?? 0,
          feedback: fb,
        })
        // Recalculate avg_score and total from all interviews
        const { data: all } = await supabase.from('interviews').select('score').eq('user_id', user.id)
        const total = all?.length ?? 1
        const avg   = all ? Math.round(all.reduce((sum, r) => sum + (r.score || 0), 0) / total) : fb.overall_score
        await supabase.from('profiles').update({ total_interviews: total, avg_score: avg }).eq('id', user.id)
        await refreshProfile()
      }
      showToast('Analysis complete!', 'success')
    } catch (err) {
      console.error(err)
      if (err.message === 'RATE_LIMITED') {
        showToast('AI rate limit reached. Please wait 1 minute and try again.', 'error')
      } else {
        showToast('Analysis failed. Please try again.', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  const m = String(Math.floor(seconds / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')

  return (
    <AppLayout>
      <div className="practice-layout">
        {/* Header */}
        <div className="practice-header">
          <div>
            <h2>Focused Practice</h2>
            <p style={{ fontSize:13, color:'var(--text-muted)' }}>Session: {filtered[qIdx]?.category}</p>
          </div>
          <div className="timer-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {m}:{s}
          </div>
        </div>

        {/* Category Filter */}
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
          {CATEGORIES.map(cat => (
            <button key={cat}
              onClick={() => { setCategory(cat); setQIdx(0); setAnswer(''); setFeedback(null) }}
              style={{
                padding:'5px 14px', borderRadius:20, fontSize:12, fontWeight:600, cursor:'pointer', border:'1.5px solid',
                background: category === cat ? 'var(--primary)' : 'transparent',
                color: category === cat ? '#fff' : 'var(--primary)',
                borderColor: 'var(--primary)',
              }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Question Nav */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <div style={{ display:'flex', gap:8 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => loadQuestion(qIdx - 1)} disabled={qIdx === 0}>← Prev</button>
            <button className="btn btn-secondary btn-sm" onClick={() => loadQuestion(qIdx + 1)} disabled={qIdx === filtered.length - 1}>Next →</button>
          </div>
          <span style={{ fontSize:12, color:'var(--text-muted)' }}>Question {qIdx + 1} of {filtered.length}</span>
        </div>

        {/* Prompt */}
        <div className="prompt-card">
          <div className="prompt-badge">Prompt</div>
          <div className="prompt-quote-icon">"</div>
          <h3>{filtered[qIdx]?.text}</h3>
        </div>

        {/* Response */}
        <div className="response-card">
          <textarea className="response-textarea" placeholder="Type your response here… Use the STAR method (Situation, Task, Action, Result) for clarity."
            value={answer} onChange={e => setAnswer(e.target.value)}/>
          <div className="response-footer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            AI auto-saving enabled
          </div>
        </div>

        <button className="btn btn-primary analyze-btn" onClick={analyze} disabled={loading}>
          {loading
            ? <><span className="spinner" style={{ width:18, height:18, borderWidth:2, display:'inline-block', verticalAlign:'middle', marginRight:8 }}/>Analyzing…</>
            : <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>Analyze Response</>
          }
        </button>

        {/* Feedback */}
        {feedback && (
          <div ref={feedbackRef}>
            <div className="feedback-section-header">
              <h3>Immediate Feedback Insights</h3>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ background:'var(--primary)', color:'#fff', borderRadius:12, padding:'6px 16px', fontWeight:800, fontSize:18 }}>
                  {feedback.overall_score}<span style={{ fontSize:12, fontWeight:400, opacity:.8 }}>/100</span>
                </div>
                <div className="feedback-badges">
                  <span className="badge badge-good">Good</span>
                  <span className="badge badge-excellent">Excellent</span>
                  <span className="badge badge-improve">Improve</span>
                </div>
              </div>
            </div>
            <div className="feedback-grid">
              {[
                { label:'Tone & Poise',       rating: feedback.tone_rating,      text: feedback.tone_feedback,      iconColor:'#8B5CF6', iconClass:'feedback-icon-purple' },
                { label:'STAR Structure',      rating: feedback.structure_rating, text: feedback.structure_feedback, iconColor:'#10B981', iconClass:'feedback-icon-green' },
                { label:'Quantifiable Impact', rating: feedback.impact_rating,    text: feedback.impact_feedback,    iconColor:'#F59E0B', iconClass:'feedback-icon-orange' },
              ].map(fb => (
                <div key={fb.label} className="card feedback-card">
                  <div className={`feedback-icon ${fb.iconClass}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={fb.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 7 22 7 22 12"/></svg>
                  </div>
                  <h4>{fb.label}</h4>
                  <p>{fb.text}</p>
                  <span className={`badge ${badgeClass(fb.rating)}`}>{fb.rating}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>{toast.msg}</div>
        </div>
      )}
    </AppLayout>
  )
}
