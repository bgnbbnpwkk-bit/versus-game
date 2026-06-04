// =====================================================================
// Gemini API – Fragen generieren + VERA-Kommentare (REST, kein SDK)
// Model: gemini-2.5-flash-preview-05-20
// =====================================================================
import { GEMINI_MODEL } from './config.js'
import { FALLBACK_QUESTIONS, FALLBACK_COMMENTS } from './data/fallback.js'

const GEMINI_KEY_STORAGE = 'versus_gemini_key'
const GEMINI_MODEL_STORAGE = 'versus_gemini_model'

// --- Key-Verwaltung (über i-Panel eingebbar, in localStorage gespeichert) ---
export function getGeminiKey() {
  try {
    return localStorage.getItem(GEMINI_KEY_STORAGE) || ''
  } catch {
    return ''
  }
}

export function setGeminiKey(key) {
  try {
    if (key) localStorage.setItem(GEMINI_KEY_STORAGE, key.trim())
    else localStorage.removeItem(GEMINI_KEY_STORAGE)
  } catch {
    /* ignore */
  }
}

export function hasGeminiKey() {
  return !!getGeminiKey()
}

// --- Modell-Verwaltung (überschreibbar, falls Google ein Modell abschaltet) ---
export function getGeminiModel() {
  try {
    return localStorage.getItem(GEMINI_MODEL_STORAGE) || GEMINI_MODEL
  } catch {
    return GEMINI_MODEL
  }
}

export function setGeminiModel(model) {
  try {
    const m = (model || '').trim()
    if (m && m !== GEMINI_MODEL) localStorage.setItem(GEMINI_MODEL_STORAGE, m)
    else localStorage.removeItem(GEMINI_MODEL_STORAGE)
  } catch {
    /* ignore */
  }
}

function hasValidKey() {
  return hasGeminiKey()
}

async function callGemini(prompt, { temperature = 0.9, maxOutputTokens = 800 } = {}) {
  const key = getGeminiKey()
  const model = getGeminiModel()
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
  const generationConfig = { temperature, maxOutputTokens }
  // 2.5er-Modelle "denken" standardmäßig und verbrauchen damit das Token-Budget,
  // sodass häufig eine leere Antwort zurückkommt. Thinking abschalten.
  if (model.includes('2.5')) generationConfig.thinkingConfig = { thinkingBudget: 0 }
  const response = await fetch(`${endpoint}?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig,
    }),
  })
  if (!response.ok) {
    let detail = ''
    try {
      const j = await response.json()
      detail = j?.error?.message || j?.error?.status || ''
    } catch {
      /* ignore */
    }
    throw new Error(`HTTP ${response.status}${detail ? ' – ' + detail : ''}`)
  }
  const data = await response.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    const reason = data?.promptFeedback?.blockReason || data?.candidates?.[0]?.finishReason || 'leere Antwort'
    throw new Error(`Keine Antwort (${reason})`)
  }
  return text
}

// Diagnose: erzeugt eine ECHTE Testfrage (kein Fallback) und meldet das Ergebnis.
export async function testGemini() {
  if (!hasGeminiKey()) return { ok: false, message: 'Kein API-Key gesetzt.' }
  try {
    const q = await generateQuestionRaw({
      id: 'allgemeinwissen',
      name: 'Allgemeinwissen',
      color: '#6B7280',
    })
    return { ok: true, message: `Echte Frage erhalten: „${q.text.slice(0, 55)}…"` }
  } catch (e) {
    return { ok: false, message: String(e?.message || e) }
  }
}

function extractJson(text) {
  const clean = text.replace(/```json|```/g, '').trim()
  // Falls noch Text drumherum steht, das erste { ... } herausschneiden.
  const start = clean.indexOf('{')
  const end = clean.lastIndexOf('}')
  const slice = start >= 0 && end >= 0 ? clean.slice(start, end + 1) : clean
  return JSON.parse(slice)
}

// Normalisiert einen Fragetext für den Dublettenvergleich.
export function normalizeQuestion(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-zäöüß0-9]/g, '')
    .slice(0, 80)
}

// Themen-Aspekte pro Kategorie – sorgen für deutlich mehr Abwechslung.
const SUBTOPICS = {
  allgemeinwissen: ['Geografie', 'Wissenschaft', 'Sport', 'Technik', 'Natur & Tiere', 'Politik & Recht', 'Sprache & Redewendungen', 'berühmte Erfindungen', 'Wirtschaft', 'Kuriositäten & Rekorde'],
  'filme-serien': ['Filmklassiker', 'Streaming-Serien', 'Animations- & Pixar-Filme', 'Science-Fiction & Fantasy', 'Regisseure', 'berühmte Filmzitate', 'Oscars & Preise', 'Komödien', 'Horror & Thriller', 'Film-Soundtracks'],
  musik: ['Rock', 'Pop der 80er/90er', 'HipHop & Rap', 'Klassik', 'deutschsprachige Musik', 'Instrumente & Musiktheorie', 'Eurovision', 'Bands & Besetzungen', 'One-Hit-Wonder', 'aktuelle Charts'],
  'mode-design': ['Modehäuser', 'berühmte Designer', 'Stilepochen', 'Materialien & Stoffe', 'Farblehre', 'Accessoires & Schuhe', 'Streetwear', 'Haute Couture', 'Modegeschichte', 'Marken-Logos'],
  kochen: ['internationale Küche', 'Backen & Patisserie', 'Gewürze & Kräuter', 'Küchentechniken', 'Wein & Getränke', 'Zutatenkunde', 'Desserts', 'regionale Spezialitäten', 'Küchengeräte', 'Fachbegriffe'],
  geschichte: ['Antike', 'Mittelalter', 'Neuzeit', '20. Jahrhundert', 'historische Persönlichkeiten', 'Entdeckungen & Erfindungen', 'Kriege & Verträge', 'deutsche Geschichte', 'Weltreiche', 'Revolutionen'],
  astronomie: ['Planeten', 'Sterne & Sternbilder', 'Raumfahrtmissionen', 'Galaxien', 'Schwarze Löcher', 'Mond & Sonne', 'berühmte Astronomen', 'Teleskope', 'Kometen & Asteroiden', 'Kosmologie'],
  literatur: ['Weltliteratur-Klassiker', 'deutsche Literatur', 'Lyrik & Gedichte', 'Autoren-Biografien', 'berühmte Romanfiguren', 'Literaturepochen', 'moderne Bestseller', 'Märchen & Sagen', 'literarische Zitate', 'Nobelpreisträger'],
}

function pickAngle(categoryId) {
  const list = SUBTOPICS[categoryId]
  if (!list) return ''
  return list[Math.floor(Math.random() * list.length)]
}

// --- Frage generieren ---
const QUESTION_SYSTEM_PROMPT = (category, avoid, angle) => {
  let p = `Du bist VERA, eine freche und provokante Quiz-KI. Generiere EINE neue Multiple-Choice-Frage für die Kategorie ${category}.`
  if (angle) p += `\nFokus-Aspekt für Abwechslung: ${angle}.`
  p += `\nSchwierigkeitsgrad: mittel bis schwer. Sei originell und spezifisch – vermeide die allerbekanntesten 08/15-Standardfragen.`
  if (avoid && avoid.length) {
    const list = avoid.slice(-30).join(' | ')
    p += `\nWICHTIG: Stelle eine DEUTLICH ANDERE Frage als diese bereits gestellten (weder gleich noch sehr ähnlich): ${list}`
  }
  p += `\nDie vier Optionen enthalten NUR den reinen Antworttext – KEINE Präfixe wie "A)", "B.", "(C)" oder "1)".`
  p += `\nAntworte NUR mit einem JSON-Objekt: { "question": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0-3 }
Keine weiteren Erklärungen. Nur das JSON.`
  return p
}

// Entfernt versehentliche Aufzählungs-Präfixe wie "A) ", "B.", "(C) ", "1) ".
// Vorsichtig: zerstört keine echten Antworten wie "C-Dur" (kein Trenner ).:).
function stripOptionPrefix(s) {
  return String(s).replace(/^\s*\(?[A-Da-d1-4][).:]\s+/, '').trim()
}

// Echte KI-Generierung – wirft bei Fehler (KEIN Fallback). Für Diagnose & intern.
async function generateQuestionRaw(category, avoidList = []) {
  const avoidSet = new Set(avoidList.map(normalizeQuestion))
  let lastErr = null
  for (let attempt = 0; attempt < 3; attempt++) {
    const angle = pickAngle(category.id)
    const text = await callGemini(QUESTION_SYSTEM_PROMPT(category.name, avoidList, angle), {
      temperature: 1.0,
      maxOutputTokens: 800,
    })
    let parsed
    try {
      parsed = extractJson(text)
    } catch {
      lastErr = new Error('Antwort war kein gültiges JSON')
      continue
    }
    if (
      parsed &&
      typeof parsed.question === 'string' &&
      Array.isArray(parsed.options) &&
      parsed.options.length === 4 &&
      Number.isInteger(parsed.correctIndex)
    ) {
      const norm = normalizeQuestion(parsed.question)
      if (avoidSet.has(norm) && attempt < 2) continue // Dublette -> neu versuchen
      return {
        text: parsed.question,
        options: parsed.options.map((o) => stripOptionPrefix(o)),
        correctIndex: Math.max(0, Math.min(3, parsed.correctIndex)),
        category: category.name,
        categoryColor: category.color,
      }
    }
    lastErr = new Error('Unerwartetes Antwortformat')
  }
  throw lastErr || new Error('Keine gültige Frage erhalten')
}

export async function generateQuestion(category, avoidList = []) {
  if (hasValidKey()) {
    try {
      return await generateQuestionRaw(category, avoidList)
    } catch (err) {
      console.warn('generateQuestion: Gemini fehlgeschlagen, nutze Fallback.', err)
    }
  }
  return fallbackQuestion(category, new Set(avoidList.map(normalizeQuestion)))
}

function fallbackQuestion(category, avoidSet = new Set()) {
  const pool = FALLBACK_QUESTIONS[category.id] || FALLBACK_QUESTIONS.allgemeinwissen
  const fresh = pool.filter((q) => !avoidSet.has(normalizeQuestion(q.question)))
  const usePool = fresh.length ? fresh : pool
  const q = usePool[Math.floor(Math.random() * usePool.length)]
  return {
    text: q.question,
    options: [...q.options],
    correctIndex: q.correctIndex,
    category: category.name,
    categoryColor: category.color,
  }
}

// --- VERA-Kommentar generieren ---
export async function generateComment(ctx) {
  // ctx: { category(obj), marcAnswerText, melliAnswerText, marcCorrect, melliCorrect,
  //        correctAnswerText, teamPoints, outcome }
  const hint = buildCommentHint(ctx.category, ctx.marcCorrect, ctx.melliCorrect)
  if (hasValidKey()) {
    try {
      const prompt = `Du bist VERA, eine freche, provokante und leicht herablassende Quiz-KI gegen das Team Melli & Marc.
Schreibe einen sehr kurzen Kommentar (1-2 Sätze, max. 120 Zeichen) auf Deutsch.
Kategorie: ${ctx.category.name}
Marc antwortete „${ctx.marcAnswerText}" — das war ${ctx.marcCorrect ? 'RICHTIG' : 'FALSCH'}.
Melli antwortete „${ctx.melliAnswerText}" — das war ${ctx.melliCorrect ? 'RICHTIG' : 'FALSCH'}.
Die richtige Antwort war: ${ctx.correctAnswerText}.
WICHTIG: Verspotte NIEMALS jemanden, der richtig geantwortet hat. Ziehe ausschließlich die Person auf, die falsch lag. Wer richtig lag, bekommt höchstens widerwillige Anerkennung.
${hint}
Sei frech, aber unterhaltsam. Kein Markdown, keine Anführungszeichen um den Kommentar.`
      const text = await callGemini(prompt, { temperature: 1.0, maxOutputTokens: 200 })
      const clean = text.replace(/```/g, '').replace(/^["']|["']$/g, '').trim()
      if (clean) return clean
    } catch (err) {
      console.warn('generateComment: Gemini fehlgeschlagen, nutze Fallback.', err)
    }
  }
  return fallbackComment(ctx.outcome)
}

// Baut einen klaren Hinweis für VERA – wer auf den Arm genommen werden darf.
function buildCommentHint(category, marcCorrect, melliCorrect) {
  const s = category?.strength
  if (marcCorrect && melliCorrect) {
    return 'Beide lagen richtig – zeige knappe, widerwillige Anerkennung (kein Spott).'
  }
  if (!marcCorrect && !melliCorrect) {
    if (s === 'weak') return 'Beide lagen falsch – triumphiere und betone, wie wichtig Bildung/Bücher sind.'
    return 'Beide lagen falsch – triumphiere genüsslich über das ganze Team.'
  }
  const loser = marcCorrect ? 'Melli' : 'Marc'
  const winner = marcCorrect ? 'Marc' : 'Melli'
  let extra = ''
  if (!melliCorrect && s === 'melli') extra = ` Pikant: ${loser} liegt ausgerechnet in ihrer Paradedisziplin daneben – sei besonders spitz zu ihr.`
  if (!marcCorrect && s === 'marc') extra = ` Pikant: ${loser} liegt ausgerechnet in seiner Paradedisziplin daneben – sei besonders spitz zu ihm.`
  return `Nur ${loser} lag falsch, ${winner} lag richtig. Nimm ${loser} auf den Arm und lass ${winner} in Ruhe.${extra}`
}

function fallbackComment(outcome) {
  const pool = FALLBACK_COMMENTS[outcome] || FALLBACK_COMMENTS.split
  return pool[Math.floor(Math.random() * pool.length)]
}
