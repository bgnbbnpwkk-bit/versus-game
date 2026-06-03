import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  resolvePlayer,
  POLL_INTERVAL_MS,
  QUESTIONS_PER_ROUND,
} from './config.js'
import { loadSession, saveSession, clearSession } from './auth.js'
import { getCategoryByName, randomCategory } from './data/categories.js'
import { generateQuestion, generateComment } from './geminiApi.js'
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

  const revealingRef = useRef(false)

  // --- Session wiederherstellen ---
  useEffect(() => {
    const email = loadSession()
    const player = resolvePlayer(email)
    if (player) setUser(player)
    try {
      const hs = localStorage.getItem(HIGHSCORE_KEY)
      if (hs != null) setHighscore(Number(hs))
    } catch {
      /* ignore */
    }
  }, [])

  // --- Auth ---
  const handleCredential = useCallback((email) => {
    const player = resolvePlayer(email)
    if (!player) {
      setAuthError('Dieser Account hat keinen Zugriff auf VERSUS.')
      return
    }
    setAuthError('')
    saveSession(player.email)
    setUser(player)
  }, [])

  const handleLogout = useCallback(() => {
    clearSession()
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
      const cat = randomCategory()
      const q = await generateQuestion(cat)
      await updateRoom(roomCode, {
        state: 'question',
        questionNumber: 1,
        currentQuestion: q,
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
        const cat = randomCategory()
        const q = await generateQuestion(cat)
        await updateRoom(roomCode, {
          state: 'question',
          questionNumber: room.questionNumber + 1,
          currentQuestion: q,
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
  const handleAnswer = useCallback(
    async (index) => {
      if (!user || !roomCode) return
      const field = user.id === 'marc' ? 'answerMarc' : 'answerMelli'
      // Optimistisches Update für sofortiges Feedback
      setRoom((prev) => (prev ? { ...prev, [field]: index } : prev))
      try {
        await submitAnswer(roomCode, user.id, index)
      } catch (err) {
        console.warn('submitAnswer-Fehler:', err)
      }
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

  // --- Render ---
  function renderContent() {
    if (!user) {
      return <LoginScreen onCredential={handleCredential} authError={authError} />
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
        return <QuestionScreen room={room} user={user} onAnswer={handleAnswer} />
      case 'reveal':
        return (
          <RevealScreen
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
          <div className="brand">VERSUS</div>
          <div className="team-tag">Team Melli &amp; Marc</div>
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
        <InfoModal onClose={() => setShowInfo(false)} onLogout={handleLogout} user={user} />
      )}
    </div>
  )
}
