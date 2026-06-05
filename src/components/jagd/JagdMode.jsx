// =====================================================================
// „Die Jagd" – Marc & Melli gegeneinander (Kandidat:in vs. Jäger:in),
// VERA moderiert. Eigener Firebase-Pfad /jagd-rooms, host-autoritativ.
// =====================================================================
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { PLAYERS } from '../../config.js'
import { CATEGORIES, getCategoryById } from '../../data/categories.js'
import { generateQuestion, generateJagdComment, normalizeQuestion } from '../../geminiApi.js'
import {
  createJagdRoom,
  joinJagdRoom,
  getJagdRoom,
  updateJagdRoom,
  submitJagdAnswer,
} from '../../firebase.js'
import VeraStage from '../VeraStage.jsx'
import Confetti from '../Confetti.jsx'
import StepTracker from './StepTracker.jsx'
import { JAGD_FALLBACK } from '../../data/jagdComments.js'
import { playTap, playReveal, playFinish } from '../../sound.js'

const LETTERS = ['A', 'B', 'C', 'D']
const JAGD_QUESTIONS = 10
const TIMER_MS = 20000
const CAND_COLOR = '#22C55E'
const HUNT_COLOR = '#EF4444'

// Beide starten rechts (Ziel = links, Stufe 0). Kandidat:in mit Vorsprung.
const HUNTER_START = 10
const HEADSTART = 3
const CAND_START = HUNTER_START - HEADSTART // 7

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n))
const pickCat = (cats) => (cats && cats.length ? cats[Math.floor(Math.random() * cats.length)] : 'allgemeinwissen')

function veraJagdExpression(situation) {
  switch (situation) {
    case 'hunterWins':
    case 'candidateWrong':
    case 'bothWrong':
      return 'gloat'
    case 'candidateWins':
      return 'angry'
    case 'bothCorrect':
      return 'impressed'
    default:
      return 'smug'
  }
}

export default function JagdMode({ user, onExit, soloTest = false }) {
  const [roomCode, setRoomCode] = useState(null)
  const [isHost, setIsHost] = useState(false)
  const [room, setRoom] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [now, setNow] = useState(Date.now())

  // Setup-UI (vor dem Raum)
  const [setupMode, setSetupMode] = useState('menu') // menu | create | join
  const [candidate, setCandidate] = useState('marc')
  const [categories, setCategories] = useState([CATEGORIES[0].id])
  const [joinCode, setJoinCode] = useState('')

  const toggleCategory = useCallback((id) => {
    setCategories((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((x) => x !== id)
          : prev // mind. eine Kategorie bleibt aktiv
        : [...prev, id]
    )
  }, [])

  const roomRef = useRef(null)
  roomRef.current = room
  const resolvingRef = useRef(false)
  const resolvedRef = useRef(-1)
  const askedRef = useRef([])

  // --- Polling ---
  useEffect(() => {
    if (!roomCode) return
    let active = true
    const poll = async () => {
      try {
        const d = await getJagdRoom(roomCode)
        if (active && d) setRoom(d)
      } catch (e) {
        console.warn('Jagd-Polling:', e)
      }
    }
    poll()
    const id = setInterval(poll, 800)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [roomCode])

  // --- Timer-Tick ---
  useEffect(() => {
    if (room?.status !== 'playing') return
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [room?.status])

  // --- Solo-Test: simulierten Gegner anwesend setzen ---
  useEffect(() => {
    if (!soloTest || !isHost || !roomCode) return
    const r = room
    if (!r || r.status !== 'lobby') return
    const partnerId = user.id === 'marc' ? 'melli' : 'marc'
    if (r.players?.[partnerId]) return
    updateJagdRoom(roomCode, {
      players: { ...(r.players || {}), [partnerId]: true },
    }).catch(() => {})
  }, [soloTest, isHost, roomCode, user, room?.status])

  // --- Solo-Test: Gegner antwortet automatisch (zufällig, innerhalb der Zeit) ---
  useEffect(() => {
    if (!soloTest || !isHost || !roomCode || !user) return
    const r = room
    if (!r || r.status !== 'playing' || !r.currentQuestion) return
    const partnerId = user.id === 'marc' ? 'melli' : 'marc'
    if (r.answers?.[partnerId] != null) return
    const t = setTimeout(() => {
      const cur = roomRef.current
      if (!cur || cur.status !== 'playing') return
      if (cur.answers?.[partnerId] != null) return
      submitJagdAnswer(roomCode, partnerId, Math.floor(Math.random() * 4)).catch(() => {})
    }, 1500 + Math.random() * 2500)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soloTest, isHost, roomCode, user, room?.status, room?.questionIndex])

  const hunter = candidate === 'marc' ? 'melli' : 'marc'

  const handleCreate = useCallback(async () => {
    setBusy(true)
    setError('')
    try {
      const code = await createJagdRoom(user.id, {
        candidateId: candidate,
        hunterId: hunter,
        categories,
      })
      resolvedRef.current = -1
      askedRef.current = []
      setIsHost(true)
      setRoomCode(code)
    } catch (e) {
      setError(e.message || 'Raum konnte nicht erstellt werden.')
    } finally {
      setBusy(false)
    }
  }, [user, candidate, hunter, categories])

  const handleJoin = useCallback(async () => {
    setBusy(true)
    setError('')
    try {
      await joinJagdRoom(joinCode, user.id)
      setIsHost(false)
      setRoomCode(joinCode)
    } catch (e) {
      setError(e.message || 'Beitritt fehlgeschlagen.')
    } finally {
      setBusy(false)
    }
  }, [joinCode, user])

  const leaveRoom = useCallback(() => {
    setRoomCode(null)
    setRoom(null)
    setIsHost(false)
    setSetupMode('menu')
    setError('')
  }, [])

  // --- Host: Spiel starten ---
  const startGame = useCallback(async () => {
    if (!room) return
    setBusy(true)
    try {
      const cat = getCategoryById(pickCat(room.categories))
      const q = await generateQuestion(cat, askedRef.current)
      askedRef.current = [...askedRef.current, normalizeQuestion(q.text)]
      resolvedRef.current = -1
      await updateJagdRoom(roomCode, {
        status: 'playing',
        questionIndex: 0,
        currentQuestion: q,
        deadline: Date.now() + TIMER_MS,
        answers: { marc: null, melli: null },
        candidatePos: CAND_START,
        hunterPos: HUNTER_START,
        winner: null,
        veraComment: null,
        lastResult: null,
        history: [],
      })
    } catch (e) {
      setError('Frage konnte nicht geladen werden.')
    } finally {
      setBusy(false)
    }
  }, [room, roomCode])

  // --- Host: Runde auflösen ---
  const resolveRound = useCallback(
    async (r) => {
      const q = r.currentQuestion
      const a = r.answers || {}
      const candAns = a[r.candidateId]
      const huntAns = a[r.hunterId]
      const candidateCorrect = candAns === q.correctIndex
      const hunterCorrect = huntAns === q.correctIndex
      // Beide laufen nach links (Richtung Ziel = Stufe 0).
      const candPos = clamp(r.candidatePos - (candidateCorrect ? 1 : 0), 0, 10)
      const huntPos = clamp(r.hunterPos - (hunterCorrect ? 1 : 0), 0, 10)

      let winner = null
      if (candPos <= 0) winner = 'candidate' // Ziel erreicht -> entkommen
      else if (huntPos <= candPos) winner = 'hunter' // eingeholt -> gefangen

      let situation
      if (winner === 'candidate') situation = 'candidateWins'
      else if (winner === 'hunter') situation = 'hunterWins'
      else if (candidateCorrect && hunterCorrect) situation = 'bothCorrect'
      else if (!candidateCorrect && !hunterCorrect) situation = 'bothWrong'
      else if (candidateCorrect) situation = 'candidateCorrect'
      else situation = 'hunterCorrect'

      const isLast = r.questionIndex >= JAGD_QUESTIONS - 1
      if (!winner && isLast) {
        // Nicht eingeholt bis zum Ende -> Kandidat:in entkommt.
        winner = 'candidate'
        situation = 'candidateWins'
      }

      let comment = ''
      try {
        comment = await generateJagdComment(situation, {
          candidateName: PLAYERS[r.candidateId].name,
          hunterName: PLAYERS[r.hunterId].name,
        })
      } catch {
        comment = JAGD_FALLBACK[situation]?.[0] || ''
      }

      await updateJagdRoom(roomCode, {
        candidatePos: candPos,
        hunterPos: huntPos,
        status: 'reveal',
        winner: winner || null,
        veraComment: comment,
        lastResult: {
          candidateCorrect,
          hunterCorrect,
          correctIndex: q.correctIndex,
          candAns: candAns == null ? null : candAns,
          huntAns: huntAns == null ? null : huntAns,
          situation,
        },
      })
    },
    [roomCode]
  )

  // Host-Effekt: auflösen wenn beide geantwortet haben ODER Zeit abgelaufen
  useEffect(() => {
    if (!isHost || !room || room.status !== 'playing' || !room.currentQuestion) return
    if (resolvedRef.current === room.questionIndex) return
    const a = room.answers || {}
    const both = a.marc != null && a.melli != null
    const past = room.deadline && Date.now() > room.deadline
    if (!both && !past) return
    resolvedRef.current = room.questionIndex
    resolvingRef.current = true
    ;(async () => {
      try {
        await resolveRound(roomRef.current || room)
      } catch (e) {
        console.warn('resolveRound:', e)
      } finally {
        resolvingRef.current = false
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHost, room, now])

  // --- Host: nächste Frage / Auswertung ---
  const handleNext = useCallback(async () => {
    if (!room) return
    if (room.winner) {
      await updateJagdRoom(roomCode, { status: 'finished' }).catch(() => {})
      return
    }
    setBusy(true)
    try {
      const cat = getCategoryById(pickCat(room.categories))
      const q = await generateQuestion(cat, askedRef.current)
      askedRef.current = [...askedRef.current, normalizeQuestion(q.text)]
      await updateJagdRoom(roomCode, {
        status: 'playing',
        questionIndex: room.questionIndex + 1,
        currentQuestion: q,
        deadline: Date.now() + TIMER_MS,
        answers: { marc: null, melli: null },
        veraComment: null,
        lastResult: null,
      })
    } catch (e) {
      setError('Frage konnte nicht geladen werden.')
    } finally {
      setBusy(false)
    }
  }, [room, roomCode])

  const handlePlayAgain = useCallback(async () => {
    resolvedRef.current = -1
    await updateJagdRoom(roomCode, {
      status: 'lobby',
      candidatePos: CAND_START,
      hunterPos: HUNTER_START,
      questionIndex: 0,
      currentQuestion: null,
      answers: { marc: null, melli: null },
      winner: null,
      veraComment: null,
      lastResult: null,
      history: [],
    }).catch(() => {})
  }, [roomCode])

  const handleAnswer = useCallback(
    async (i) => {
      const a = roomRef.current?.answers || {}
      if (a[user.id] != null) return
      playTap()
      try {
        await submitJagdAnswer(roomCode, user.id, i)
      } catch (e) {
        console.warn('submitJagdAnswer:', e)
      }
    },
    [roomCode, user]
  )

  // ===================================================================
  // Render
  // ===================================================================
  if (!roomCode) {
    return (
      <JagdSetup
        user={user}
        setupMode={setupMode}
        setSetupMode={setSetupMode}
        candidate={candidate}
        setCandidate={setCandidate}
        categories={categories}
        toggleCategory={toggleCategory}
        joinCode={joinCode}
        setJoinCode={setJoinCode}
        onCreate={handleCreate}
        onJoin={handleJoin}
        onExit={onExit}
        busy={busy}
        error={error}
      />
    )
  }

  if (!room) {
    return (
      <div className="screen">
        <div className="center-stack" style={{ textAlign: 'center' }}>
          <div className="spinner" />
          <p className="muted">Verbinde mit Jagd-Raum {roomCode}…</p>
        </div>
      </div>
    )
  }

  if (room.status === 'lobby') {
    return (
      <JagdLobby
        room={room}
        roomCode={roomCode}
        user={user}
        isHost={isHost}
        onStart={startGame}
        onLeave={leaveRoom}
        busy={busy}
      />
    )
  }

  if (room.status === 'playing') {
    return (
      <JagdQuestion
        key={`q${room.questionIndex}`}
        room={room}
        user={user}
        now={now}
        onAnswer={handleAnswer}
      />
    )
  }

  if (room.status === 'reveal') {
    return (
      <JagdReveal
        key={`r${room.questionIndex}`}
        room={room}
        user={user}
        isHost={isHost}
        onNext={handleNext}
        busy={busy}
      />
    )
  }

  // finished
  return (
    <JagdResult
      room={room}
      user={user}
      isHost={isHost}
      onPlayAgain={handlePlayAgain}
      onExit={onExit}
    />
  )
}

// ---------------------------------------------------------------- Setup
function JagdSetup({
  user,
  setupMode,
  setSetupMode,
  candidate,
  setCandidate,
  categories,
  toggleCategory,
  joinCode,
  setJoinCode,
  onCreate,
  onJoin,
  onExit,
  busy,
  error,
}) {
  const hunter = candidate === 'marc' ? 'melli' : 'marc'
  return (
    <div className="screen">
      <VeraStage expression="smug" line="Die Jagd! Wer rennt, wer jagt? Entscheidet euch." size={112} compact />

      {setupMode === 'menu' && (
        <div className="center-stack">
          <h1 className="title" style={{ textAlign: 'center' }}>
            Die Jagd 🐆
          </h1>
          <p className="subtitle" style={{ textAlign: 'center' }}>
            Marc &amp; Melli gegeneinander: Kandidat:in flieht, Jäger:in verfolgt.
          </p>
          <button className="btn btn-primary" onClick={() => setSetupMode('create')} disabled={busy}>
            Neuen Raum erstellen
          </button>
          <div className="divider">oder</div>
          <button className="btn btn-ghost" onClick={() => setSetupMode('join')} disabled={busy}>
            Raum beitreten
          </button>
          <button className="btn btn-ghost" onClick={onExit}>
            ← Modus wechseln
          </button>
        </div>
      )}

      {setupMode === 'create' && (
        <div className="center-stack">
          <h2 className="title" style={{ textAlign: 'center', fontSize: 24 }}>
            Rollen &amp; Kategorie
          </h2>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="role-label">🏃 Kandidat:in (flieht zu Stufe 10)</div>
            <div className="role-pick">
              {['marc', 'melli'].map((id) => (
                <button
                  key={id}
                  className={`role-btn ${candidate === id ? 'active' : ''}`}
                  style={candidate === id ? { borderColor: CAND_COLOR, color: CAND_COLOR } : undefined}
                  onClick={() => setCandidate(id)}
                >
                  {PLAYERS[id].emoji} {PLAYERS[id].name}
                </button>
              ))}
            </div>
            <div className="role-label">🐆 Jäger:in (jagt von Stufe 10 herab)</div>
            <div className="muted" style={{ textAlign: 'left' }}>
              automatisch: {PLAYERS[hunter].emoji} {PLAYERS[hunter].name}
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="role-label">Kategorien (mehrere möglich)</div>
            <div className="cat-grid">
              {CATEGORIES.map((c) => {
                const on = categories.includes(c.id)
                return (
                  <button
                    key={c.id}
                    className={`cat-chip ${on ? 'active' : ''}`}
                    style={on ? { background: c.color, borderColor: c.color, color: '#fff' } : undefined}
                    onClick={() => toggleCategory(c.id)}
                  >
                    {on ? '✓ ' : ''}
                    {c.name}
                  </button>
                )
              })}
            </div>
            <div className="muted" style={{ textAlign: 'left' }}>
              {categories.length} ausgewählt – Fragen werden zufällig daraus gezogen.
            </div>
          </div>

          <button className="btn btn-primary" onClick={onCreate} disabled={busy}>
            {busy ? 'Erstelle Raum…' : 'Raum erstellen'}
          </button>
          <button className="btn btn-ghost" onClick={() => setSetupMode('menu')} disabled={busy}>
            Zurück
          </button>
          {error && <p className="error-text">{error}</p>}
        </div>
      )}

      {setupMode === 'join' && (
        <div className="center-stack">
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p className="subtitle" style={{ textAlign: 'center' }}>
              4-stelligen Jagd-Raumcode eingeben:
            </p>
            <input
              className="field code-input"
              inputMode="numeric"
              maxLength={4}
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="0000"
              autoFocus
            />
            <button className="btn btn-primary" onClick={onJoin} disabled={busy || joinCode.length !== 4}>
              {busy ? 'Trete bei…' : 'Beitreten'}
            </button>
            <button className="btn btn-ghost" onClick={() => setSetupMode('menu')} disabled={busy}>
              Zurück
            </button>
          </div>
          {error && <p className="error-text">{error}</p>}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------- Lobby
function JagdLobby({ room, roomCode, user, isHost, onStart, onLeave, busy }) {
  const players = room.players || {}
  const bothHere = players.marc && players.melli
  const catNames = (room.categories || []).map((id) => getCategoryById(id).name).join(', ')
  const line = JAGD_FALLBACK.gameStart[0]
  return (
    <div className="screen">
      <VeraStage expression="smug" line={line} size={112} compact />
      <StepTracker candidatePos={room.candidatePos} hunterPos={room.hunterPos} />
      <div className="center-stack">
        <div style={{ textAlign: 'center' }}>
          <p className="subtitle">Raumcode für den/die Partner:in:</p>
          <div className="room-code">{roomCode}</div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <RoleRow role="cand" id={room.candidateId} here={players[room.candidateId]} />
          <RoleRow role="hunt" id={room.hunterId} here={players[room.hunterId]} />
          <div className="muted" style={{ textAlign: 'center' }}>
            Kategorien: <strong>{catNames}</strong>
          </div>
        </div>

        {!bothHere && (
          <p className="muted" style={{ textAlign: 'center' }}>
            Warten auf {players.marc ? PLAYERS.melli.name : PLAYERS.marc.name}…
          </p>
        )}

        {bothHere && isHost && (
          <button className="btn btn-primary" onClick={onStart} disabled={busy}>
            {busy ? 'VERA startet die Jagd…' : 'Jagd starten 🐆'}
          </button>
        )}
        {bothHere && !isHost && (
          <p className="muted" style={{ textAlign: 'center' }}>
            Beide bereit! Warte, bis {PLAYERS[room.host].name} startet…
          </p>
        )}

        <button className="btn btn-ghost" onClick={onLeave} disabled={busy}>
          Raum verlassen
        </button>
      </div>
    </div>
  )
}

function RoleRow({ role, id, here }) {
  const p = PLAYERS[id]
  const color = role === 'cand' ? CAND_COLOR : HUNT_COLOR
  return (
    <div className="role-row" style={{ borderColor: color }}>
      <span>
        {role === 'cand' ? '🏃 Kandidat:in' : '🐆 Jäger:in'}
      </span>
      <strong style={{ color: p.color }}>
        {p.emoji} {p.name}
      </strong>
      <span className="muted">{here ? 'ist da' : 'fehlt…'}</span>
    </div>
  )
}

// ------------------------------------------------------------- Question
function JagdQuestion({ room, user, now, onAnswer }) {
  const q = room.currentQuestion
  const myAnswer = room.answers?.[user.id]
  const partnerId = user.id === 'marc' ? 'melli' : 'marc'
  const partnerAnswered = room.answers?.[partnerId] != null
  const answered = myAnswer != null
  const isCandidate = user.id === room.candidateId
  const roleColor = isCandidate ? CAND_COLOR : HUNT_COLOR

  const msLeft = Math.max(0, (room.deadline || 0) - now)
  const secLeft = Math.ceil(msLeft / 1000)
  const pct = clamp((msLeft / TIMER_MS) * 100, 0, 100)

  if (!q) {
    return (
      <div className="screen">
        <div className="center-stack" style={{ textAlign: 'center' }}>
          <div className="spinner" />
          <p className="muted">VERA stellt eine Frage…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="screen">
      <div className="jagd-hud">
        <StepTracker candidatePos={room.candidatePos} hunterPos={room.hunterPos} />

        <div className="jagd-subbar">
          <span className="role-chip" style={{ background: roleColor }}>
            {isCandidate ? '🏃 Du fliehst' : '🐆 Du jagst'}
          </span>
          <span className="q-counter">
            {room.questionIndex + 1} / {JAGD_QUESTIONS}
          </span>
        </div>

        <div className="timer">
          <div className="timer-bar" style={{ width: pct + '%', background: secLeft <= 5 ? HUNT_COLOR : '#2563eb' }} />
          <span className="timer-num">⏱ {secLeft}s</span>
        </div>
      </div>

      <div className="q-header" style={{ marginTop: 12 }}>
        <span className="cat-badge" style={{ background: q.categoryColor || '#2563eb' }}>
          {q.category}
        </span>
      </div>
      <h2 className="q-text">{q.text}</h2>

      <div className="options">
        {q.options.map((opt, i) => {
          const selected = myAnswer === i
          return (
            <button
              key={i}
              className={`option ${selected ? 'selected' : ''}`}
              style={selected ? { '--accent': roleColor } : undefined}
              disabled={answered}
              onClick={() => onAnswer(i)}
            >
              <span className="letter">{LETTERS[i]}</span>
              <span className="opt-text">{opt}</span>
              {selected && <span className="marker">✓</span>}
            </button>
          )
        })}
      </div>

      <div className="q-status">
        {answered ? (
          partnerAnswered ? (
            <span>Beide bereit – wird aufgedeckt… ✨</span>
          ) : (
            <span>Antwort steht – Partner wählt noch…</span>
          )
        ) : (
          <span className="muted" style={{ margin: 0 }}>
            Tippe schnell – die Uhr läuft!
          </span>
        )}
      </div>
    </div>
  )
}

// --------------------------------------------------------------- Reveal
function JagdReveal({ room, user, isHost, onNext, busy }) {
  const q = room.currentQuestion
  const lr = room.lastResult || {}
  const correct = lr.correctIndex
  const situation = lr.situation || 'bothCorrect'

  useEffect(() => {
    playReveal(lr.candidateCorrect ? 'split' : 'fail')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!q) return null
  const cand = PLAYERS[room.candidateId]
  const hunt = PLAYERS[room.hunterId]

  return (
    <div className="screen">
      <StepTracker candidatePos={room.candidatePos} hunterPos={room.hunterPos} />

      <VeraStage
        expression={veraJagdExpression(situation)}
        line={room.veraComment}
        size={116}
        compact
      />

      <div className="answers-grid" style={{ marginTop: 14 }}>
        <div className="answer-card" style={{ borderColor: CAND_COLOR }}>
          <div className="who" style={{ color: CAND_COLOR }}>
            🏃 {cand.name}
          </div>
          <div className="pick">
            {lr.candAns != null ? `${LETTERS[lr.candAns]} ${lr.candidateCorrect ? '✅' : '❌'}` : '⏳'}
            {lr.candidateCorrect ? '  +1' : ''}
          </div>
        </div>
        <div className="answer-card" style={{ borderColor: HUNT_COLOR }}>
          <div className="who" style={{ color: HUNT_COLOR }}>
            🐆 {hunt.name}
          </div>
          <div className="pick">
            {lr.huntAns != null ? `${LETTERS[lr.huntAns]} ${lr.hunterCorrect ? '✅' : '❌'}` : '⏳'}
            {lr.hunterCorrect ? '  +1' : ''}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="muted">Richtige Antwort:</div>
        <div style={{ fontWeight: 700, marginTop: 4 }}>
          {LETTERS[correct]} — {q.options[correct]}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        {isHost ? (
          <button className="btn btn-primary" onClick={onNext} disabled={busy}>
            {busy ? 'Lädt…' : room.winner ? 'Zur Auswertung 🏁' : 'Weiter ➡'}
          </button>
        ) : (
          <p className="muted" style={{ textAlign: 'center' }}>
            Warte, bis {PLAYERS[room.host].name} weitermacht…
          </p>
        )}
      </div>
    </div>
  )
}

// --------------------------------------------------------------- Result
function JagdResult({ room, user, isHost, onPlayAgain, onExit }) {
  const winnerRole = room.winner // 'candidate' | 'hunter'
  const winnerId = winnerRole === 'candidate' ? room.candidateId : room.hunterId
  const winner = PLAYERS[winnerId]
  const userWon = user.id === winnerId

  useEffect(() => {
    playFinish(userWon)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="screen">
      {userWon && <Confetti count={40} />}
      <StepTracker candidatePos={room.candidatePos} hunterPos={room.hunterPos} />

      <VeraStage
        expression={winnerRole === 'hunter' ? 'gloat' : 'angry'}
        line={room.veraComment}
        size={118}
        compact
      />

      <div className="result-hero" style={{ marginTop: 12 }}>
        <div className="result-emoji">{winnerRole === 'candidate' ? '🏃🏆' : '🐆🏆'}</div>
        <h1 className="title">
          {winner.emoji} {winner.name} gewinnt!
        </h1>
        <p className="subtitle">
          {winnerRole === 'candidate'
            ? 'Die Flucht ist geglückt – entkommen!'
            : 'Die Jagd war erfolgreich – gefangen!'}
        </p>
      </div>

      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {isHost ? (
          <button className="btn btn-primary" onClick={onPlayAgain}>
            Nochmal jagen 🔁
          </button>
        ) : (
          <p className="muted" style={{ textAlign: 'center' }}>Warte auf eine neue Jagd…</p>
        )}
        <button className="btn btn-ghost" onClick={onExit}>
          ← Modus wechseln
        </button>
      </div>
    </div>
  )
}
