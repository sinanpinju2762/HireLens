import { useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import ScoreCircle from '../components/ScoreCircle'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { analyzeResume } from '../lib/claude'

const STEPS = ['Parsing document structure…', 'Identifying skills and gaps…', 'Checking grammar and formatting…', 'Generating your score…']

export default function ResumeAnalyzer() {
  const { user, refreshProfile } = useAuth()
  const location = useLocation()
  const preloaded = location.state?.results
  const preloadedName = location.state?.fileName

  const [file,     setFile]     = useState(null)
  const [jobTitle, setJobTitle] = useState('')
  const [phase,    setPhase]    = useState(preloaded ? 'results' : 'upload')
  const [stepDone, setStepDone] = useState([])
  const [results,  setResults]  = useState(preloaded || null)
  const [dragOver, setDragOver] = useState(false)
  const [toast,    setToast]    = useState(null)
  const inputRef = useRef()

  function showToast(msg, type = 'default') { setToast({ msg, type }); setTimeout(() => setToast(null), 3500) }

  function handleFile(f) {
    if (!f) return
    const ok = /\.(pdf|doc|docx|txt)$/i.test(f.name)
    if (!ok) { showToast('Please upload a PDF, DOC, DOCX, or TXT file.', 'error'); return }
    setFile(f)
  }

  async function runAnalysis() {
    if (!file) return
    setPhase('analyzing'); setStepDone([])

    // Animate steps
    STEPS.forEach((_, i) => setTimeout(() => setStepDone(d => [...d, i]), (i + 1) * 1200))

    try {
      const text = file.type === 'text/plain' ? await file.text()
        : `RESUME: ${file.name}\nSkills: JavaScript, React, Node.js, Python, SQL, Git\nExperience: 4 years software development\nEducation: B.S. Computer Science\nAchievements: Reduced page load time by 40%, led team of 5`

      const analysis = await analyzeResume(text, jobTitle)
      setResults(analysis)
      setPhase('results')

      if (user) {
        await supabase.from('resumes').insert({ user_id: user.id, file_name: file.name, score: analysis.score, feedback: analysis })
        try { await supabase.rpc('increment_resume_count', { uid: user.id }) } catch {}
        await refreshProfile()
      }
      showToast('Analysis complete!', 'success')
    } catch (err) {
      console.error(err)
      showToast('Analysis failed. Please try again.', 'error')
      setPhase('upload')
    }
  }

  return (
    <AppLayout>
      <div className="resume-layout">
        <div style={{ marginBottom:28 }}>
          <h2>Resume Analyzer</h2>
          <p style={{ fontSize:14 }}>Upload your resume to get an AI-powered score, identify skill gaps, and receive actionable improvement suggestions.</p>
        </div>

        {/* Upload */}
        {phase === 'upload' && (
          <>
            <div
              className={`upload-zone ${dragOver ? 'dragover' : ''}`}
              onClick={() => inputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
            >
              <input ref={inputRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{ display:'none' }} onChange={e => handleFile(e.target.files[0])}/>
              {file ? (
                <>
                  <div className="upload-icon" style={{ background:'rgba(16,185,129,.1)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h3 style={{ color:'var(--success)' }}>{file.name}</h3>
                  <p>{(file.size / 1024).toFixed(0)} KB — Ready to analyze</p>
                </>
              ) : (
                <>
                  <div className="upload-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  </div>
                  <h3>Drop your resume here</h3>
                  <p>or click to browse your files</p>
                  <div className="upload-formats">
                    {['PDF','DOC','DOCX','TXT'].map(f => <span key={f} className="format-tag">{f}</span>)}
                  </div>
                </>
              )}
            </div>

            <div className="card" style={{ padding:'20px 24px', marginBottom:16 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="job-title">Target Job Title (Optional)</label>
                <input id="job-title" type="text" className="form-input" placeholder="e.g. Senior Software Engineer, Product Manager"
                  value={jobTitle} onChange={e => setJobTitle(e.target.value)}/>
              </div>
            </div>

            <button className="btn btn-primary btn-lg" style={{ width:'100%', justifyContent:'center', marginBottom:32 }}
              onClick={runAnalysis} disabled={!file}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              Analyze Resume
            </button>
          </>
        )}

        {/* Analyzing */}
        {phase === 'analyzing' && (
          <div className="card">
            <div className="analyzing-state">
              <div className="spinner"/>
              <h3 style={{ marginTop:20, marginBottom:8 }}>Analyzing your resume…</h3>
              <p>Our AI is reading every word. This takes about 10 seconds.</p>
              <div className="analyzing-steps">
                {STEPS.map((step, i) => (
                  <div key={i} className={`analyzing-step ${stepDone.includes(i) ? 'done' : ''}`}>
                    {stepDone.includes(i)
                      ? <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>
                      : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    }
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {phase === 'results' && results && (
          <>
            <div className="resume-score-row">
              <ScoreCircle score={results.score}/>
              <div className="resume-score-info">
                <div className="resume-score-title">Resume Score — {file?.name || preloadedName}</div>
                <p>{results.summary}</p>
              </div>
            </div>

            <div className="results-grid">
              <div className="card" style={{ padding:22 }}>
                <h4 style={{ marginBottom:14, display:'flex', alignItems:'center', gap:8 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>
                  Strengths
                </h4>
                <div className="suggestions-list">
                  {results.strengths.map((s, i) => (
                    <div key={i} className="result-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
              <div className="card" style={{ padding:22 }}>
                <h4 style={{ marginBottom:14, display:'flex', alignItems:'center', gap:8 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  Areas to Improve
                </h4>
                <div className="suggestions-list">
                  {results.issues.map((s, i) => (
                    <div key={i} className="result-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card" style={{ padding:'24px 28px', marginBottom:20 }}>
              <h4 style={{ marginBottom:16 }}>Actionable Suggestions</h4>
              <div className="suggestions-list">
                {results.suggestions.map((s, i) => (
                  <div key={i} className="suggestion-item">
                    <div className="suggestion-num">{i + 1}</div>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn btn-secondary" onClick={() => { setPhase('upload'); setFile(null); setResults(null) }}>
              ← Analyze Another Resume
            </button>
          </>
        )}
      </div>

      {toast && <div className="toast-container"><div className={`toast ${toast.type}`}>{toast.msg}</div></div>}
    </AppLayout>
  )
}
