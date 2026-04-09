// ============================================================
// HireLens — Gemini API helpers
// ============================================================

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const MODEL   = 'gemini-2.0-flash'
const IS_DEMO = !API_KEY || API_KEY.includes('your-key') || API_KEY.length < 20

async function callGemini(prompt, maxTokens = 512) {
  if (IS_DEMO) return null  // demo mode fallback handled by callers

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: maxTokens },
      }),
    }
  )

  if (res.status === 429) {
    // Rate limited — return null so callers use demo fallback
    return null
  }

  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`)
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
  if (!text) throw new Error('Empty response from Gemini')
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Could not parse Gemini response')
  return JSON.parse(match[0])
}

// ---- Interview Response Analysis ---------------------------
export async function analyzeInterviewResponse(question, answer) {
  const result = await callGemini(`You are an expert interview coach. Analyze this interview answer and provide structured feedback.

Interview Question: "${question}"
Candidate's Answer: "${answer}"

Respond ONLY with JSON (no extra text):
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

  const result = await callGemini(`You are an expert resume coach. Analyze this resume.

${jobContext}

Resume:
${resumeText}

Respond ONLY with JSON (no extra text):
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
