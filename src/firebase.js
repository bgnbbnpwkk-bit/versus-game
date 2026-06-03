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
async function roomUrl(roomCode, childPath = '') {
  const child = childPath ? `/${childPath}` : ''
  const token = await getIdToken()
  const auth = token ? `?auth=${token}` : ''
  return `${BASE}/versus/${roomCode}${child}.json${auth}`
}

// --- Low-level Helpers ---
async function dbGet(roomCode, childPath = '') {
  const res = await fetch(await roomUrl(roomCode, childPath), { method: 'GET' })
  if (!res.ok) throw new Error(`Firebase GET fehlgeschlagen (${res.status})`)
  return res.json()
}

async function dbPut(roomCode, data, childPath = '') {
  const res = await fetch(await roomUrl(roomCode, childPath), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Firebase PUT fehlgeschlagen (${res.status})`)
  return res.json()
}

async function dbPatch(roomCode, data, childPath = '') {
  const res = await fetch(await roomUrl(roomCode, childPath), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Firebase PATCH fehlgeschlagen (${res.status})`)
  return res.json()
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
