// =====================================================================
// Gemini API – Fragen generieren + VERA-Kommentare (REST, kein SDK)
// Model: gemini-2.5-flash-preview-05-20
// =====================================================================
import { GEMINI_API_KEY, GEMINI_MODEL } from './config.js'
import { categoryHint } from './data/categories.js'
import { FALLBACK_QUESTIONS, FALLBACK_COMMENTS } from './data/fallback.js'

const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

function hasValidKey() {
  return GEMINI_API_KEY && !GEMINI_API_KEY.includes('PLACEHOLDER')
}

async function callGemini(prompt, { temperature = 0.9, maxOutputTokens = 500 } = {}) {
  const response = await fetch(`${ENDPOINT}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature, maxOutputTokens },
    }),
  })
  if (!response.ok) throw new Error(`Gemini API Fehler (${response.status})`)
  const data = await response.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Gemini lieferte keine Antwort.')
  return text
}

function extractJson(text) {
  const clean = text.replace(/```json|```/g, '').trim()
  // Falls noch Text drumherum steht, das erste { ... } herausschneiden.
  const start = clean.indexOf('{')
  const end = clean.lastIndexOf('}')
  const slice = start >= 0 && end >= 0 ? clean.slice(start, end + 1) : clean
  return JSON.parse(slice)
}

// --- Frage generieren ---
const QUESTION_SYSTEM_PROMPT = (category) =>
  `Du bist VERA, eine freche und provokante Quiz-KI. Generiere eine Multiple-Choice-Frage für die Kategorie ${category}.
Schwierigkeitsgrad: mittel bis schwer.
Antworte NUR mit einem JSON-Objekt: { "question": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0-3 }
Keine weiteren Erklärungen. Nur das JSON.`

export async function generateQuestion(category) {
  if (hasValidKey()) {
    try {
      const text = await callGemini(QUESTION_SYSTEM_PROMPT(category.name), {
        temperature: 0.95,
        maxOutputTokens: 500,
      })
      const parsed = extractJson(text)
      if (
        parsed &&
        typeof parsed.question === 'string' &&
        Array.isArray(parsed.options) &&
        parsed.options.length === 4 &&
        Number.isInteger(parsed.correctIndex)
      ) {
        return {
          text: parsed.question,
          options: parsed.options.map(String),
          correctIndex: Math.max(0, Math.min(3, parsed.correctIndex)),
          category: category.name,
          categoryColor: category.color,
        }
      }
    } catch (err) {
      console.warn('generateQuestion: Gemini fehlgeschlagen, nutze Fallback.', err)
    }
  }
  // Fallback (z. B. wenn kein API-Key gesetzt ist oder die API zickt)
  return fallbackQuestion(category)
}

function fallbackQuestion(category) {
  const pool = FALLBACK_QUESTIONS[category.id] || FALLBACK_QUESTIONS.allgemeinwissen
  const q = pool[Math.floor(Math.random() * pool.length)]
  return {
    text: q.question,
    options: [...q.options],
    correctIndex: q.correctIndex,
    category: category.name,
    categoryColor: category.color,
  }
}

// --- VERA-Kommentar generieren ---
function commentPrompt({ category, marcAnswer, melliAnswer, correctAnswer, points, hint }) {
  return `Du bist VERA, eine freche, provokante und leicht herablassende Quiz-KI gegen das Team Melli & Marc.
Schreibe einen sehr kurzen Kommentar (1-2 Sätze, max. 100 Zeichen) auf Deutsch.
Kontext: Kategorie=${category}, Marc antwortete=${marcAnswer}, Melli antwortete=${melliAnswer},
Richtige Antwort=${correctAnswer}, Punkte diese Runde=${points}.
${hint}
Sei frech aber unterhaltsam. Kein Markdown.`
}

export async function generateComment(ctx) {
  // ctx: { category(obj), marcAnswerText, melliAnswerText, correctAnswerText, teamPoints, outcome }
  const hint = categoryHint(ctx.category)
  if (hasValidKey()) {
    try {
      const text = await callGemini(
        commentPrompt({
          category: ctx.category.name,
          marcAnswer: ctx.marcAnswerText,
          melliAnswer: ctx.melliAnswerText,
          correctAnswer: ctx.correctAnswerText,
          points: ctx.teamPoints,
          hint,
        }),
        { temperature: 1.0, maxOutputTokens: 120 }
      )
      const clean = text.replace(/```/g, '').replace(/^["']|["']$/g, '').trim()
      if (clean) return clean
    } catch (err) {
      console.warn('generateComment: Gemini fehlgeschlagen, nutze Fallback.', err)
    }
  }
  return fallbackComment(ctx.outcome)
}

function fallbackComment(outcome) {
  const pool = FALLBACK_COMMENTS[outcome] || FALLBACK_COMMENTS.split
  return pool[Math.floor(Math.random() * pool.length)]
}
