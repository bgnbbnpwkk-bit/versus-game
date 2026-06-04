import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  resolvePlayer,
  POLL_INTERVAL_MS,
  QUESTIONS_PER_ROUND,
} from './config.js'
import { signInWithGoogle, signOutUser, onAuthEmail } from './firebaseAuth.js'
import { getCategoryByName, getCategoryById, buildCategoryPlan } from './data/categories.js'
import { generateQuestion, generateComment, normalizeQuestion } from './geminiApi.js'
import {
  createRoom,
  joinRoom,
  getRoom,
  updateRoom,
  submitAnswer,
} from './firebase.js'

import LoginScreen from './components/LoginScreen.jsx'
import LobbyScreen from './components/LobbyScreen.jsx'
import WaitingScreen from './components/WaitingScreen.jsx'
import QuestionScreen from './components/QuestionScreen.jsx'
import RevealScreen from './components/RevealScreen.jsx'
import ResultScreen from './components/ResultScreen.jsx'
import InfoModal from './components/InfoModal.jsx'

const HIGHSCORE_KEY = 'versus_highscore'
const RECENT_BY_CAT_KEY = 'versus_recent_by_cat'
const RECENT_PER_CAT = 20 // pro Kategorie: keine Wiederholung, bis 20 andere kamen
const SOLO_KEY = 'versus_solo'

// Zuletzt gestellte Fragen (normalisiert) je Kategorie – rundenübergreifend.
function loadRecentByCat() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_BY_CAT_KEY) || '{}') || {}
  } catch {
    return {}
  }
}
function saveRecentByCat(map) {
  try {
    localStorage.setItem(RECENT_BY_CAT_KEY, JSON.stringify(map))
  } catch {
    /* ignore */
  }
}
// Fügt eine Frage zur Kategorie-Historie hinzu (max. RECENT_PER_CAT) und speichert.
function rememberQuestion(catId, norm) {
  const map = loadRecentByCat()
  const list = (map[catId] || []).filter((x) => x !== norm)
  list.push(norm)
  map[catId] = list.slice(-RECENT_PER_CAT)
  saveRecentByCat(map)
  return map[catId]
}

// --- Punkte-Logik ---
function computeResult(marcIdx, melliIdx, correctIndex) {
  const marcCorrect = marcIdx === correctIndex
  const melliCorrect = melliIdx === correctIndex
  if (marcCorrect && melliCorrect) {
    if (marcIdx === melliIdx) return { outcome: 'harmony', teamPoints: 2, kiPoints: 0 }
    return { outcome: 'split', teamPoints: 1, kiPoints: 0 }
  }
  if (marcCorrect || melliCorrect) return { outcome: 'one', teamPoints: 0.5, kiPoints: 0 }
  return { outcome: 'fail', teamPoints: 0, kiPoints: 1 }
}

export default function App() {
  const [user, setUser] = useState(null)
  const [authError, setAuthError] = useState('')
  const [roomCode, setRoomCode] = useState(null)
  const [isHost, setIsHost] = useState(false)
  const [room, setRoom] = useState(null)
  const [busy, setBusy] = useState(false)
  const [lobbyError, setLobbyError] = useState('')
  const [showInfo, setShowInfo] = useState(false)
  const [highscore, setHighscore] = useState(null)
  const [soloTest, setSoloTest] = useState(false)

  const revealingRef = useRef(false)
  const roomRef = useRef(null)
  roomRef.current = room

  // --- Highscore & Solo-Test aus localStorage laden ---
  useEffect(() => {
    try {
      const hs = localStorage.getItem(HIGHSCORE_KEY)
      if (hs != null) setHighscore(Number(hs))
      setSoloTest(!!localStorage.getItem(SOLO_KEY))
    } catch {
      /* ignore */
    }
  }, [])

  const toggleSolo = useCallback(() => {
    setSoloTest((v) => {
      const nv = !v
      try {
        if (nv) localStorage.setItem(SOLO_KEY, '1')
        else localStorage.removeItem(SOLO_KEY)
      } catch {
        /* ignore */
      }
      return nv
    })
  }, [])

  // --- Auth-Status über Firebase Auth SDK beobachten ---
  useEffect(() => {
    const unsub = onAuthEmail((email) => {
      const player = resolvePlayer(email)
      if (email && !player) {
        // Eingeloggt, aber kein erlaubter Account → sofort abmelden.
        setAuthError('Dieser Account hat keinen Zugriff auf VERSUS.')
        setUser(null)
        signOutUser().catch(() => {})
        return
      }
      if (player) {
        setAuthError('')
        setUser(player)
      } else {
        setUser(null)
      }
    })
    return unsub
  }, [])

  // --- Login per Google (Firebase Popup) ---
  const handleSignIn = useCallback(async () => {
    setAuthError('')
    try {
      await signInWithGoogle()
    } catch (err) {
      const code = err?.code || ''
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        return // vom Nutzer abgebrochen – keine Fehlermeldung
      }
      if (code === 'auth/unauthorized-domain') {
        setAuthError('Diese Domain ist in Firebase nicht freigegeben.')
      } else {
        setAuthError('Anmeldung fehlgeschlagen. Bitte erneut versuchen.')
      }
    }
  }, [])

  const handleLogout = useCallback(() => {
    signOutUser().catch(() => {})
    setUser(null)
    setRoomCode(null)
    setRoom(null)
    setIsHost(false)
    setShowInfo(false)
  }, [])

  // --- Polling des Spielzustands ---
  useEffect(() => {
    if (!roomCode || !user) return
    let active = true
    const poll = async () => {
      try {
        const data = await getRoom(roomCode)
        if (active && data) setRoom(data)
      } catch (err) {
        console.warn('Polling-Fehler:', err)
      }
    }
    poll()
    const id = setInterval(poll, POLL_INTERVAL_MS)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [roomCode, user])

  // --- Lobby ---
  const handleCreate = useCallback(async () => {
    if (!user) return
    setBusy(true)
    setLobbyError('')
    try {
      const code = await createRoom(user.id)
      setIsHost(true)
      setRoomCode(code)
    } catch (err) {
      setLobbyError(err.message || 'Raum konnte nicht erstellt werden.')
    } finally {
      setBusy(false)
    }
  }, [user])

  const handleJoin = useCallback(
    async (code) => {
      if (!user) return
      setBusy(true)
      setLobbyError('')
      try {
        await joinRoom(code, user.id)
        setIsHost(false)
        setRoomCode(code)
      } catch (err) {
        setLobbyError(err.message || 'Beitritt fehlgeschlagen.')
      } finally {
        setBusy(false)
      }
    },
    [user]
  )

  const handleLeave = useCallback(() => {
    setRoomCode(null)
    setRoom(null)
    setIsHost(false)
  }, [])

  // --- Host: Spiel starten / neue Runde ---
  const startRound = useCallback(async () => {
    setBusy(true)
    try {
      const plan = buildCategoryPlan(QUESTIONS_PER_ROUND)
      const cat = getCategoryById(plan[0])
      const recentCat = loadRecentByCat()[cat.id] || []
      const q = await generateQuestion(cat, recentCat)
      const norm = normalizeQuestion(q.text)
      rememberQuestion(cat.id, norm)
      await updateRoom(roomCode, {
        state: 'question',
        questionNumber: 1,
        currentQuestion: q,
        categoryPlan: plan,
        usedQuestions: [norm],
        answerMarc: null,
        answerMelli: null,
        veraComment: null,
        lastPoints: null,
        scores: { team: 0, ki: 0 },
        roundHistory: [],
      })
    } catch (err) {
      console.warn('startRound-Fehler:', err)
      setLobbyError('Frage konnte nicht geladen werden.')
    } finally {
      setBusy(false)
    }
  }, [roomCode])

  // --- Host: nächste Frage / Auswertung ---
  const handleNext = useCallback(async () => {
    if (!room) return
    setBusy(true)
    try {
      if (room.questionNumber >= QUESTIONS_PER_ROUND) {
        await updateRoom(roomCode, { state: 'finished' })
      } else {
        const plan =
          room.categoryPlan && room.categoryPlan.length >= QUESTIONS_PER_ROUND
            ? room.categoryPlan
            : buildCategoryPlan(QUESTIONS_PER_ROUND)
        const nextNum = room.questionNumber + 1
        const cat = getCategoryById(plan[nextNum - 1])
        const used = room.usedQuestions || []
        const recentCat = loadRecentByCat()[cat.id] || []
        // Vermeide: alles aus dieser Kategorie (Fenster 20) + alles aus der laufenden Runde.
        const avoid = Array.from(new Set([...recentCat, ...used]))
        const q = await generateQuestion(cat, avoid)
        const norm = normalizeQuestion(q.text)
        rememberQuestion(cat.id, norm)
        await updateRoom(roomCode, {
          state: 'question',
          questionNumber: nextNum,
          currentQuestion: q,
          categoryPlan: plan,
          usedQuestions: [...used, norm],
          answerMarc: null,
          answerMelli: null,
          veraComment: null,
          lastPoints: null,
        })
      }
    } catch (err) {
      console.warn('handleNext-Fehler:', err)
    } finally {
      setBusy(false)
    }
  }, [room, roomCode])

  // --- Antwort abgeben (beide Spieler) ---
  // Bewusst KEIN optimistisches Update: der Serverwert ist die einzige Wahrheit.
  // Fehler werden geworfen, damit der QuestionScreen erneut bestätigen lassen kann.
  const handleAnswer = useCallback(
    async (index) => {
      if (!user || !roomCode) throw new Error('Nicht bereit')
      await submitAnswer(roomCode, user.id, index)
    },
    [user, roomCode]
  )

  // --- Host-Logik: Reveal auslösen, wenn beide geantwortet haben ---
  useEffect(() => {
    if (!isHost || !room || room.state !== 'question' || !room.currentQuestion) return
    const marcIdx = room.answerMarc
    const melliIdx = room.answerMelli
    if (marcIdx == null || melliIdx == null) return
    if (revealingRef.current) return

    revealingRef.current = true
    const q = room.currentQuestion
    const result = computeResult(marcIdx, melliIdx, q.correctIndex)
    ;(async () => {
      let comment = ''
      try {
        comment = await generateComment({
          category: getCategoryByName(q.category),
          marcAnswerText: q.options[marcIdx],
          melliAnswerText: q.options[melliIdx],
          marcCorrect: marcIdx === q.correctIndex,
          melliCorrect: melliIdx === q.correctIndex,
          correctAnswerText: q.options[q.correctIndex],
          teamPoints: result.teamPoints,
          outcome: result.outcome,
        })
      } catch {
        comment = 'Tja.'
      }
      const scores = {
        team: (room.scores?.team || 0) + result.teamPoints,
        ki: (room.scores?.ki || 0) + result.kiPoints,
      }
      const roundHistory = [
        ...(room.roundHistory || []),
        {
          category: q.category,
          categoryColor: q.categoryColor,
          teamPoints: result.teamPoints,
          kiPoints: result.kiPoints,
          outcome: result.outcome,
        },
      ]
      try {
        await updateRoom(roomCode, {
          state: 'reveal',
          veraComment: comment,
          lastPoints: { team: result.teamPoints, ki: result.kiPoints },
          scores,
          roundHistory,
        })
      } catch (err) {
        console.warn('reveal-Update-Fehler:', err)
      } finally {
        revealingRef.current = false
      }
    })()
  }, [isHost, room, roomCode])

  // --- Highscore speichern bei Spielende ---
  useEffect(() => {
    if (room?.state !== 'finished') return
    const team = room.scores?.team || 0
    try {
      const prev = Number(localStorage.getItem(HIGHSCORE_KEY) || 0)
      const best = Math.max(prev, team)
      localStorage.setItem(HIGHSCORE_KEY, String(best))
      setHighscore(best)
    } catch {
      /* ignore */
    }
  }, [room?.state, room?.scores?.team])

  // --- Solo-Test: simulierten Partner anwesend setzen ---
  useEffect(() => {
    if (!soloTest || !isHost || !roomCode) return
    const r = room
    if (!r || r.state !== 'waiting') return
    const partnerId = user.id === 'marc' ? 'melli' : 'marc'
    if (r.players?.[partnerId]) return
    updateRoom(roomCode, {
      players: { ...(r.players || {}), [partnerId]: true },
    }).catch(() => {})
  }, [soloTest, isHost, roomCode, user, room?.state])

  // --- Solo-Test: Partner antwortet automatisch (zufällig) ---
  useEffect(() => {
    if (!soloTest || !isHost || !roomCode || !user) return
    const r = room
    if (!r || r.state !== 'question' || !r.currentQuestion) return
    const partnerField = user.id === 'marc' ? 'answerMelli' : 'answerMarc'
    if (r[partnerField] != null) return
    // Deps nur auf state/questionNumber -> Timer wird nicht bei jedem Poll gecancelt.
    const t = setTimeout(() => {
      const cur = roomRef.current
      if (!cur || cur.state !== 'question') return
      if (cur[partnerField] != null) return
      const pid = user.id === 'marc' ? 'melli' : 'marc'
      submitAnswer(roomCode, pid, Math.floor(Math.random() * 4)).catch(() => {})
    }, 1000 + Math.random() * 800)
    return () => clearTimeout(t)
  }, [soloTest, isHost, roomCode, user, room?.state, room?.questionNumber])

  // --- Render ---
  function renderContent() {
    if (!user) {
      return <LoginScreen onSignIn={handleSignIn} authError={authError} />
    }
    if (!roomCode) {
      return (
        <LobbyScreen
          user={user}
          onCreate={handleCreate}
          onJoin={handleJoin}
          busy={busy}
          error={lobbyError}
        />
      )
    }
    if (!room) {
      return (
        <div className="screen">
          <div className="center-stack" style={{ textAlign: 'center' }}>
            <div className="spinner" />
            <p className="muted">Verbinde mit Raum {roomCode}…</p>
          </div>
        </div>
      )
    }
    switch (room.state) {
      case 'question':
        // key pro Frage -> Screen startet oben (VERA sichtbar), lokaler State frisch
        return (
          <QuestionScreen
            key={`q${room.questionNumber}`}
            room={room}
            user={user}
            onAnswer={handleAnswer}
          />
        )
      case 'reveal':
        return (
          <RevealScreen
            key={`r${room.questionNumber}`}
            room={room}
            user={user}
            isHost={isHost}
            onNext={handleNext}
            busy={busy}
          />
        )
      case 'finished':
        return (
          <ResultScreen
            room={room}
            isHost={isHost}
            onPlayAgain={startRound}
            onLeave={handleLeave}
            highscore={highscore}
            busy={busy}
          />
        )
      case 'waiting':
      default:
        return (
          <WaitingScreen
            room={room}
            roomCode={roomCode}
            user={user}
            isHost={isHost}
            onStart={startRound}
            onLeave={handleLeave}
            busy={busy}
          />
        )
    }
  }

  return (
    <div className="app">
      <div className="topbar">
        <div>
          <div className="brand">vs. VERA 😈</div>
          <div className="team-tag">Melli &amp; Marc 💙🩷</div>
        </div>
        <button
          className="icon-btn"
          onClick={() => setShowInfo(true)}
          aria-label="Info"
          title="Info"
        >
          i
        </button>
      </div>

      {renderContent()}

      {showInfo && (
        <InfoModal
          onClose={() => setShowInfo(false)}
          onLogout={handleLogout}
          user={user}
          soloTest={soloTest}
          onToggleSolo={toggleSolo}
        />
      )}
    </div>
  )
}
