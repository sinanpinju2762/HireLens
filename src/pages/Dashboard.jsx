import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import ScoreCircle from '../components/ScoreCircle'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const WEEKLY_TARGET = 32

const STATIC_ACTIVITY = [
  { company: 'Google',  role: 'Systems Architect',   date: 'Oct 24, 2024', score: 92, status: 'completed' },
  { company: 'Airbnb',  role: 'Lead UX Designer',    date: 'Oct 22, 2024', score: 78, status: 'completed' },
  { company: 'Stripe',  role: 'Software Engineer II', date: 'Oct 19, 2024', score: 84, status: 'partial'   },
]

export default function Dashboard() {
  const { profile, firstName } = useAuth()
  const [interviews, setInterviews] = useState([])

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('interviews')
        .select('id, question, score, created_at')
        .order('created_at', { ascending: false })
        .limit(5)
      if (data?.length) setInterviews(data)
    }
    load()
  }, [])

  const totalInterviews = profile?.total_interviews ?? 24
  const avgScore        = profile?.avg_score        ?? 84
  const done            = Math.min(totalInterviews, WEEKLY_TARGET)
  const pct             = Math.round((done / WEEKLY_TARGET) * 100)

  return (
    <AppLayout>
      <div className="welcome-section">
        <h2>Welcome back, {firstName} 👋</h2>
        <p>Your interview readiness is at an all-time high. Ready to sharpen your skills?</p>
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
            <h3>Mock Interview: Senior Product Designer at Figma</h3>
            <p>Practice specific behavioural and portfolio walkthrough questions tailored for top-tier design roles.</p>
            <div className="recommended-actions">
              <Link to="/practice" className="btn-white">Start Practice</Link>
              <span className="estimated-time">Estimated: 45 mins</span>
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
                <div className="progress-title">Great pace, {firstName}!</div>
                <div className="progress-pct">{pct}%</div>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${pct}%` }}/>
              </div>
              <div className="progress-meta">
                <span>Weekly Target: {WEEKLY_TARGET} Interviews</span>
                <span>{WEEKLY_TARGET - done} Remaining</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="section-header">
            <h3>Recent Activity</h3>
            <Link to="/history" className="view-all-link">View All History</Link>
          </div>
          <div className="activity-table">
            <div className="activity-table-head">
              <span>Company / Role</span>
              <span>Date</span>
              <span>Score</span>
              <span>Status</span>
              <span>Action</span>
            </div>
            {STATIC_ACTIVITY.map((row, i) => (
              <div key={i} className="activity-row">
                <div className="company-cell">
                  <div className="company-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  </div>
                  <div>
                    <div className="company-name">{row.company}</div>
                    <div className="company-role">{row.role}</div>
                  </div>
                </div>
                <span style={{ fontSize:13, color:'var(--text-secondary)' }}>{row.date}</span>
                <span className="score-cell">{row.score} <span>/100</span></span>
                <span><span className={`badge badge-${row.status}`}>{row.status}</span></span>
                <Link to="/history" className="action-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Score Card */}
        <div>
          <div className="card" style={{ position:'sticky', top: 20 }}>
            <div className="score-card-inner">
              <div className="score-card-label">Average Score</div>
              <ScoreCircle score={avgScore} />
              <p style={{ fontSize:11, color:'var(--text-muted)', textAlign:'center' }}>Based on last 10 sessions</p>
              <div className="score-improvement">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                +12% From Last Week
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
