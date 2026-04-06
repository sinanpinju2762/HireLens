// ============================================================
// HireLens — Claude API helpers
// For production: proxy these calls through a Supabase Edge
// Function to keep the API key server-side.
// ============================================================

const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY || ''
const MODEL   = 'claude-haiku-4-5-20251001'

async function callClaude(prompt, maxTokens = 512) {
  if (!API_KEY) return null  // demo mode fallback handled by callers

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) throw new Error(`Claude API error: ${res.status}`)
  const data = await res.json()
  const text = data.content[0].text.trim()
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Could not parse Claude response')
  return JSON.parse(match[0])
}

// ---- Interview Response Analysis ---------------------------
export async function analyzeInterviewResponse(question, answer) {
  const result = await callClaude(`You are an expert interview coach. Analyze this interview answer and provide structured feedback.

Interview Question: "${question}"
Candidate's Answer: "${answer}"

Respond ONLY with JSON:
{
  "tone_rating": "Excellent|Good|Needs Improvement",
  "tone_feedback": "1-2 sentence feedback on tone and delivery",
  "structure_rating": "Excellent|Good|Needs Improvement",
  "structure_feedback": "1-2 sentence feedback on STAR method usage",
  "impact_rating": "Excellent|Good|Needs Improvement",
  "impact_feedback": "1-2 sentence feedback on quantifiable results",
  "overall_score": <number 0-100>
}`)

  // Demo fallback
  return result ?? {
    tone_rating: 'Excellent',
    tone_feedback: 'Your delivery shows high emotional intelligence. Very professional.',
    structure_rating: 'Good',
    structure_feedback: 'The situation and task were well defined. The result was clear.',
    impact_rating: 'Needs Improvement',
    impact_feedback: 'Consider adding specific metrics or data to the outcome phase.',
    overall_score: 78,
  }
}

// ---- Resume Analysis ----------------------------------------
export async function analyzeResume(resumeText, jobTitle = '') {
  const jobContext = jobTitle ? `The candidate is targeting: ${jobTitle}.` : ''

  const result = await callClaude(`You are an expert resume coach. Analyze this resume.

${jobContext}

Resume:
${resumeText}

Respond ONLY with JSON:
{
  "score": <number 0-100>,
  "summary": "2-3 sentence overall assessment",
  "strengths": ["strength 1","strength 2","strength 3","strength 4"],
  "issues": ["issue 1","issue 2","issue 3","issue 4"],
  "suggestions": ["suggestion 1","suggestion 2","suggestion 3","suggestion 4","suggestion 5","suggestion 6"]
}`, 1024)

  return result ?? {
    score: 74,
    summary: 'Your resume demonstrates solid technical skills but could benefit from more quantifiable achievements and better formatting.',
    strengths: [
      'Strong technical skills section',
      'Relevant work experience listed',
      'Clear education section',
      'Good use of action verbs',
    ],
    issues: [
      'Missing quantifiable impact metrics',
      'No LinkedIn or portfolio link',
      'Some grammar inconsistencies',
      'Skills section could be more targeted',
    ],
    suggestions: [
      "Add specific metrics to each achievement (e.g., 'reduced load time by 40%')",
      'Include a professional summary tailored to the target role',
      'Add LinkedIn profile URL and GitHub portfolio link',
      'Remove outdated skills and add trending technologies',
      'Use consistent verb tense throughout',
      'Add keywords from the job description for ATS compatibility',
    ],
  }
}
