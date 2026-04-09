import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import ScoreCircle from '../components/ScoreCircle'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const WEEKLY_TARGET = 10

function scoreClass(s) { return s >= 85 ? 'badge-excellent' : s >= 65 ? 'badge-good' : 'badge-improve' }
function scoreLabel(s) { return s >= 85 ? 'Excellent' : s >= 65 ? 'Good' : 'Needs Work' }

export default function Dashboard() {
  const { user, profile, firstName } = useAuth()
  const [interviews, setInterviews] = useState([])
  const [loading,    setLoading]    = useState(true)

  const [allScores, setAllScores] = useState([])

  useEffect(() => {
    if (!user) return
    // Fetch recent 5 for display
    supabase
      .from('interviews')
      .select('id, question, category, score, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => { setInterviews(data || []); setLoading(false) })
    // Fetch all scores for accurate average
    supabase
      .from('interviews')
      .select('score')
      .eq('user_id', user.id)
      .then(({ data }) => { if (data?.length) setAllScores(data) })
  }, [user])

  const totalInterviews = allScores.length || profile?.total_interviews || 0
  const avgScore = allScores.length
    ? Math.round(allScores.reduce((sum, r) => sum + (r.score || 0), 0) / allScores.length)
    : profile?.avg_score ?? 0
  const done            = Math.min(totalInterviews, WEEKLY_TARGET)
  const pct             = WEEKLY_TARGET > 0 ? Math.round((done / WEEKLY_TARGET) * 100) : 0

  return (
    <AppLayout>
      <div className="welcome-section">
        <h2>Welcome back, {firstName} 👋</h2>
        <p>Your interview readiness is improving. Ready to sharpen your skills today?</p>
      </div>

      <div className="dashboard-grid">
        {/* Left Column */}
        <div>
          {/* Recommended Card */}
          <div className="recommended-card">
            <div className="recommended-label">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="white"><circle cx="5" cy="5" r="5"/></svg>
              Recommended for You
            </div>
            <h3>Mock Interview: Behavioral & Leadership Questions</h3>
            <p>Practice specific behavioural questions using the STAR method to boost your confidence and score.</p>
            <div className="recommended-actions">
              <Link to="/practice" className="btn-white">Start Practice</Link>
              <span className="estimated-time">Estimated: 20 mins</span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="stats-row">
            <div className="card">
              <div className="stat-card-main">
                <div className="stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <div>
                  <div className="stat-number">{totalInterviews}</div>
                  <div className="stat-label">Interviews Practiced</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="progress-label-sm">Weekly Progress</div>
              <div className="progress-header">
                <div className="progress-title">{pct >= 100 ? 'Target reached!' : `Great pace, ${firstName}!`}</div>
                <div className="progress-pct">{pct}%</div>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${Math.min(pct, 100)}%` }}/>
              </div>
              <div className="progress-meta">
                <span>Weekly Target: {WEEKLY_TARGET} Interviews</span>
                <span>{Math.max(WEEKLY_TARGET - done, 0)} Remaining</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="section-header">
            <h3>Recent Activity</h3>
            <Link to="/history" className="view-all-link">View All History</Link>
          </div>

          {loading ? (
            <div style={{ textAlign:'center', padding:32 }}><div className="spinner"/></div>
          ) : interviews.length === 0 ? (
            <div className="card" style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40" strokeLinecap="round" strokeLinejoin="round" style={{ margin:'0 auto 12px', display:'block', opacity:.4 }}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              <p style={{ marginBottom:12 }}>No interviews yet. Start your first practice!</p>
              <Link to="/practice" className="btn btn-primary btn-sm">Start Practice →</Link>
            </div>
          ) : (
            <div className="activity-table">
              <div className="activity-table-head">
                <span>Question</span>
                <span>Category</span>
                <span>Score</span>
                <span>Rating</span>
                <span>Action</span>
              </div>
              {interviews.map((row) => (
                <div key={row.id} className="activity-row">
                  <div className="company-cell">
                    <div className="company-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    </div>
                    <div>
                      <div className="company-name" style={{ fontSize:12, maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{row.question}</div>
                      <div className="company-role">{new Date(row.created_at).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}</div>
                    </div>
                  </div>
                  <span style={{ fontSize:12, color:'var(--text-secondary)' }}>{row.category || 'Behavioral'}</span>
                  <span className="score-cell">{row.score} <span>/100</span></span>
                  <span><span className={`badge ${scoreClass(row.score)}`}>{scoreLabel(row.score)}</span></span>
                  <Link to="/history" className="action-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Score Card */}
        <div>
          <div className="card" style={{ position:'sticky', top: 20 }}>
            <div className="score-card-inner">
              <div className="score-card-label">Average Score</div>
              <ScoreCircle score={avgScore} />
              <p style={{ fontSize:11, color:'var(--text-muted)', textAlign:'center' }}>Based on your {totalInterviews} session{totalInterviews !== 1 ? 's' : ''}</p>
              {totalInterviews === 0 ? (
                <div style={{ textAlign:'center', marginTop:12 }}>
                  <Link to="/practice" className="btn btn-primary btn-sm" style={{ fontSize:12 }}>Start First Interview</Link>
                </div>
              ) : (
                <div className="score-improvement">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                  Keep practicing to improve!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
