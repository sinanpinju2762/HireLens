import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import ScoreCircle from '../components/ScoreCircle'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const PAGE_SIZE = 10

const STATIC = [
  { question: 'Describe a time you led a team through a significant transition.', answer: 'During the merger of 2023, I spearheaded the integration of the engineering departments by establishing a common framework for communication and…', category: 'Leadership Strategy', score: 92, created_at: '2024-10-24', feedback: { tone_rating: 'Authoritative' } },
  { question: 'How do you prioritize competing deadlines in a high-pressure environment?', answer: "I utilize the Eisenhower Matrix to categorize tasks by urgency and importance, ensuring that long-term strategic goals aren't sacrificed for…", category: 'Problem Solving', score: 75, created_at: '2024-10-22', feedback: { tone_rating: 'Analytical' } },
  { question: 'What is your greatest professional failure and what did you learn?', answer: 'In my previous role, I underestimated the complexity of a legacy system migration which led to a 48-hour downtime for our beta testers.', category: 'Behavioral', score: 58, created_at: '2024-10-19', feedback: { tone_rating: 'Humble' } },
]

function catClass(cat = '') {
  const c = cat.toLowerCase()
  if (c.includes('leader')) return 'category-leadership'
  if (c.includes('problem')) return 'category-problem'
  if (c.includes('technical')) return 'category-technical'
  return 'category-behavioral'
}
function ratingLabel(score) { return score >= 85 ? 'Excellent' : score >= 65 ? 'Good' : 'Improve' }
function ratingClass(score) { return score >= 85 ? 'badge-excellent' : score >= 65 ? 'badge-good' : 'badge-improve' }
function fillClass(score)   { return score >= 85 ? 'fill-excellent'  : score >= 65 ? 'fill-good'  : 'fill-improve' }
function fmtDate(d) {
  const dt = d?.toDate ? d.toDate() : new Date(d)
  return isNaN(dt) ? '' : dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function HistoryEntry({ item }) {
  return (
    <div className="history-entry">
      <div className="history-entry-header">
        <div className="history-entry-meta">
          <span className={`category-badge ${catClass(item.category)}`}>{item.category || 'Behavioral'}</span>
          <span className="history-date">{fmtDate(item.created_at)}</span>
        </div>
        <span className={`badge ${ratingClass(item.score)}`}>{ratingLabel(item.score)}</span>
      </div>
      <div className="history-question">"{item.question}"</div>
      <div className="history-excerpt">"{item.answer?.slice(0, 140)}…"</div>
      <div className="history-entry-footer">
        <div className="history-metrics">
          <span className="history-metric">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {Math.floor(Math.random() * 3 + 1)}m {Math.floor(Math.random() * 60)}s
          </span>
          <span className="history-metric">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
            Tone: {item.feedback?.tone_rating || 'Analytical'}
          </span>
        </div>
        <div className="history-confidence">
          <div className="history-confidence-label">Confidence</div>
          <div className="confidence-bar">
            <div className={`confidence-fill ${fillClass(item.score)}`} style={{ width: `${item.score}%` }}/>
          </div>
        </div>
        <Link to="/practice" className="view-analysis-link">View Analysis</Link>
      </div>
    </div>
  )
}

export default function History() {
  const { user, profile } = useAuth()
  const [items,    setItems]   = useState([])
  const [loading,  setLoading] = useState(true)
  const [hasMore,  setHasMore] = useState(false)
  const [lastId,   setLastId]  = useState(null)

  async function loadMore(reset = false) {
    if (!user) return
    setLoading(true)
    let q = supabase.from('interviews').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(PAGE_SIZE)
    if (!reset && lastId) q = q.lt('id', lastId)
    const { data } = await q
    if (data?.length) {
      setItems(prev => reset ? data : [...prev, ...data])
      setLastId(data.at(-1).id)
      setHasMore(data.length === PAGE_SIZE)
    } else if (reset) {
      setItems(STATIC)
    }
    setLoading(false)
  }

  useEffect(() => { loadMore(true) }, [user])

  const avgScore = profile?.avg_score ?? 84
  const total    = profile?.total_interviews ?? 42

  return (
    <AppLayout>
      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <h2>Cognitive Sanctuary</h2>
        <p style={{ fontSize:14 }}>Review your growth and prepare for your next milestone.</p>
      </div>

      {/* Stats Row */}
      <div className="history-stats-row">
        <div className="card history-stat-card">
          <div className="history-stat-label">Overall Score</div>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <ScoreCircle score={avgScore} size={80}/>
            <div>
              <div style={{ fontSize:'2rem', fontWeight:800 }}>{avgScore}<span style={{ fontSize:'1rem', fontWeight:400, color:'var(--text-muted)' }}>/100</span></div>
              <div className="progress-bar-track" style={{ width:120, marginTop:8 }}>
                <div className="progress-bar-fill" style={{ width:`${avgScore}%` }}/>
              </div>
            </div>
          </div>
        </div>
        <div className="card history-stat-card">
          <div className="history-stat-label">Total Practices</div>
          <div className="history-stat-value">
            {total}
            <span style={{ fontSize:'1rem', color:'var(--success)', fontWeight:700 }}>↑ +12%</span>
          </div>
          <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:6 }}>Sessions in last 30 days</div>
        </div>
        <div className="milestone-card">
          <div className="milestone-label">Next Milestone</div>
          <h3>Senior Lead Simulation</h3>
          <Link to="/resume" style={{ background:'rgba(255,255,255,.2)', color:'white', border:'1px solid rgba(255,255,255,.3)', padding:'8px 18px', borderRadius:'var(--radius-full)', fontSize:12, fontWeight:600, display:'inline-block', textDecoration:'none' }}>Resume Prep</Link>
        </div>
      </div>

      {/* List */}
      <div className="section-header">
        <h3>Interview History</h3>
        <div style={{ display:'flex', gap:8 }}>
          <button style={{ width:34, height:34, borderRadius:'50%', background:'#F3F4F6', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
          </button>
        </div>
      </div>

      {loading && items.length === 0
        ? <div style={{ textAlign:'center', padding:40 }}><div className="spinner"/><p style={{ marginTop:12, fontSize:13 }}>Loading…</p></div>
        : <div className="history-list">{items.map((item, i) => <HistoryEntry key={item.id || i} item={item}/>)}</div>
      }

      {hasMore && <button className="load-more-btn" onClick={() => loadMore()}>Load More History</button>}
    </AppLayout>
  )
}
