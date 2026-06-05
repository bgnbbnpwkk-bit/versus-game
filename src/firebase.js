// =====================================================================
// Firebase Realtime Database – NUR REST API (kein Firebase SDK!)
// Synchronisation des Spielzustands zwischen zwei Handys.
// Pfad-Schema: /versus/{roomCode}
// =====================================================================
import { FIREBASE } from './config.js'
import { getIdToken } from './firebaseAuth.js'

const BASE = FIREBASE.databaseURL.replace(/\/$/, '')

// Hängt das Firebase-ID-Token an, damit geschützte DB-Regeln (auth != null)
// die REST-Aufrufe akzeptieren.
async function explainError(method, res, hadToken) {
  let detail = ''
  try {
    const body = await res.json()
    if (body && body.error) detail = body.error
  } catch {
    /* ignore */
  }
  const tokenInfo = hadToken ? '' : ' [kein Auth-Token!]'
  // Klartext-Hinweis bei Berechtigungsproblemen.
  if (res.status === 401 || res.status === 403) {
    return `Firebase ${method} verweigert (${res.status}${tokenInfo}): ${
      detail || 'Permission denied'
    } – bitte DB-Regeln für /versus prüfen.`
  }
  return `Firebase ${method} fehlgeschlagen (${res.status}${tokenInfo})${
    detail ? ': ' + detail : ''
  }`
}

async function dbRequest(method, roomCode, { data, childPath = '', root = 'versus' } = {}) {
  const token = await getIdToken()
  const child = childPath ? `/${childPath}` : ''
  const authQ = token ? `?auth=${token}` : ''
  const url = `${BASE}/${root}/${roomCode}${child}.json${authQ}`
  const opts = { method }
  if (data !== undefined) {
    opts.headers = { 'Content-Type': 'application/json' }
    opts.body = JSON.stringify(data)
  }
  const res = await fetch(url, opts)
  if (!res.ok) throw new Error(await explainError(method, res, !!token))
  return res.json()
}

// --- Low-level Helpers ---
async function dbGet(roomCode, childPath = '', root = 'versus') {
  return dbRequest('GET', roomCode, { childPath, root })
}

async function dbPut(roomCode, data, childPath = '', root = 'versus') {
  return dbRequest('PUT', roomCode, { data, childPath, root })
}

async function dbPatch(roomCode, data, childPath = '', root = 'versus') {
  return dbRequest('PATCH', roomCode, { data, childPath, root })
}

// --- Raumcode-Generierung (4-stellig) ---
function generateRoomCode() {
  return String(Math.floor(1000 + Math.random() * 9000))
}

function freshRoomState(hostId) {
  return {
    state: 'waiting', // waiting | ready | question | reveal | finished
    host: hostId,
    players: { marc: false, melli: false },
    currentQuestion: null,
    questionNumber: 0,
    answerMarc: null,
    answerMelli: null,
    veraComment: null,
    lastPoints: null, // { team, ki } für die letzte Runde
    scores: { team: 0, ki: 0 },
    roundHistory: [],
    createdAt: Date.now(),
  }
}

// --- High-level API ---

// Erstellt einen neuen Raum und markiert den Ersteller als anwesend.
export async function createRoom(playerId) {
  // Bis zu 5 Versuche einen freien Code zu finden.
  for (let i = 0; i < 5; i++) {
    const code = generateRoomCode()
    const existing = await dbGet(code)
    if (existing == null) {
      const state = freshRoomState(playerId)
      state.players[playerId] = true
      await dbPut(code, state)
      return code
    }
  }
  throw new Error('Konnte keinen freien Raumcode erzeugen. Bitte erneut versuchen.')
}

// Tritt einem bestehenden Raum bei.
export async function joinRoom(roomCode, playerId) {
  const existing = await dbGet(roomCode)
  if (existing == null) {
    throw new Error('Diesen Raum gibt es nicht. Code prüfen!')
  }
  await dbPatch(roomCode, { [playerId]: true }, 'players')
  return existing
}

export async function getRoom(roomCode) {
  return dbGet(roomCode)
}

// Aktualisiert beliebige Felder im Raum.
export async function updateRoom(roomCode, patch) {
  return dbPatch(roomCode, patch)
}

// Schreibt die Antwort eines Spielers.
export async function submitAnswer(roomCode, playerId, answerIndex) {
  const field = playerId === 'marc' ? 'answerMarc' : 'answerMelli'
  return dbPatch(roomCode, { [field]: answerIndex })
}

export { generateRoomCode }

// =====================================================================
// „Die Jagd" – getrennter Pfad /jagd-rooms/{roomCode}
// =====================================================================
const JAGD = 'jagd-rooms'

function freshJagdRoom(hostId, { candidateId, hunterId, category }) {
  return {
    mode: 'jagd',
    host: hostId,
    candidateId,
    hunterId,
    candidatePos: 0,
    hunterPos: 10,
    players: { marc: false, melli: false },
    status: 'lobby', // lobby | playing | reveal | finished
    category: category || null, // Kategorie-Id
    currentQuestion: null,
    questionIndex: 0,
    deadline: null,
    answers: { marc: null, melli: null },
    veraComment: null,
    lastResult: null,
    winner: null,
    history: [],
    createdAt: Date.now(),
  }
}

export async function createJagdRoom(hostId, roles) {
  for (let i = 0; i < 5; i++) {
    const code = generateRoomCode()
    const existing = await dbGet(code, '', JAGD)
    if (existing == null) {
      const state = freshJagdRoom(hostId, roles)
      state.players[hostId] = true
      await dbPut(code, state, '', JAGD)
      return code
    }
  }
  throw new Error('Konnte keinen freien Raumcode erzeugen. Bitte erneut versuchen.')
}

export async function joinJagdRoom(roomCode, playerId) {
  const existing = await dbGet(roomCode, '', JAGD)
  if (existing == null) throw new Error('Diesen Jagd-Raum gibt es nicht. Code prüfen!')
  if (existing.mode !== 'jagd') throw new Error('Das ist kein Jagd-Raum.')
  await dbPatch(roomCode, { [playerId]: true }, 'players', JAGD)
  return existing
}

export async function getJagdRoom(roomCode) {
  return dbGet(roomCode, '', JAGD)
}

export async function updateJagdRoom(roomCode, patch) {
  return dbPatch(roomCode, patch, '', JAGD)
}

export async function submitJagdAnswer(roomCode, playerId, answerIndex) {
  return dbPatch(roomCode, { [playerId]: answerIndex }, 'answers', JAGD)
}
