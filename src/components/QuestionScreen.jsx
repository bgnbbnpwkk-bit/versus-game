// Fragebildschirm: geheime Abstimmung mit Bestätigung.
// Tippen wählt nur aus (kein Commit) -> erst "Antwort bestätigen" schreibt.
// Truth = Serverwert -> kein Festhängen, keine versehentliche Antwort.
import React, { useEffect, useState } from 'react'
import { PLAYERS, QUESTIONS_PER_ROUND } from '../config.js'
import VeraStage from './VeraStage.jsx'
import { pickQuestionTaunt } from './Vera.jsx'
import { playTap, playConfirm } from '../sound.js'

const LETTERS = ['A', 'B', 'C', 'D']

export default function QuestionScreen({ room, user, onAnswer }) {
  const q = room.currentQuestion

  const [pick, setPick] = useState(null)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState(false)
  useEffect(() => {
    setPick(null)
    setSending(false)
    setSendError(false)
  }, [room.questionNumber])

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

  const serverAnswer = user.id === 'marc' ? room.answerMarc : room.answerMelli
  const partnerAnswer = user.id === 'marc' ? room.answerMelli : room.answerMarc
  const partner = user.id === 'marc' ? PLAYERS.melli : PLAYERS.marc

  const committed = serverAnswer !== null && serverAnswer !== undefined
  const partnerCommitted = partnerAnswer !== null && partnerAnswer !== undefined
  const shown = committed ? serverAnswer : pick

  const color = q.categoryColor || '#2563eb'

  const handlePick = (i) => {
    if (committed || sending) return
    setSendError(false)
    setPick(i)
    playTap()
  }

  const handleConfirm = async () => {
    if (committed || sending || pick === null) return
    setSending(true)
    setSendError(false)
    playConfirm()
    try {
      await onAnswer(pick)
      // committed wird true, sobald der nächste Poll den Serverwert bringt.
    } catch {
      setSending(false)
      setSendError(true)
    }
  }

  // Status-Text (feste Höhe -> kein Layout-Sprung)
  let statusEl
  if (committed && partnerCommitted) {
    statusEl = <span>Beide bereit – wird aufgedeckt… ✨</span>
  } else if (committed) {
    statusEl = (
      <>
        <span className="dots">
          <span />
          <span />
          <span />
        </span>
        <span>{partner.name} tippt noch…</span>
      </>
    )
  } else if (partnerCommitted) {
    statusEl = (
      <span style={{ color: partner.color, fontWeight: 700 }}>
        {partner.emoji} {partner.name} ist fertig – jetzt du!
      </span>
    )
  } else {
    statusEl = <span className="muted" style={{ margin: 0 }}>Wählt unabhängig – dann bestätigen.</span>
  }

  return (
    <div className="screen">
      <VeraStage
        expression={committed && partnerCommitted ? 'think' : 'smug'}
        line={pickQuestionTaunt(room.questionNumber)}
        size={120}
        compact
      />

      <Scoreboard room={room} />

      <div className="q-header">
        <span className="cat-badge" style={{ background: color }}>
          {q.category}
        </span>
        <span className="q-counter">
          {room.questionNumber} / {QUESTIONS_PER_ROUND}
        </span>
      </div>

      <h2 className="q-text">{q.text}</h2>

      <div className="options">
        {q.options.map((opt, i) => {
          const selected = shown === i
          return (
            <button
              key={i}
              className={`option ${selected ? 'selected' : ''}`}
              style={selected ? { '--accent': color } : undefined}
              disabled={committed || sending}
              onClick={() => handlePick(i)}
            >
              <span className="letter">{LETTERS[i]}</span>
              <span className="opt-text">{opt}</span>
              {selected && <span className="marker">{committed ? '✓' : '•'}</span>}
            </button>
          )
        })}
      </div>

      <div className="q-status">{statusEl}</div>

      <div className="q-action">
        {committed ? (
          <div className="answer-locked">✓ Deine Antwort steht fest.</div>
        ) : (
          <button
            className="btn btn-primary"
            style={{ '--accent': color }}
            disabled={pick === null || sending}
            onClick={handleConfirm}
          >
            {sending ? 'Wird gesendet…' : sendError ? 'Erneut bestätigen' : 'Antwort bestätigen'}
          </button>
        )}
      </div>
    </div>
  )
}

function Scoreboard({ room }) {
  const s = room.scores || { team: 0, ki: 0 }
  return (
    <div className="scoreboard">
      <div className="score-box">
        <div className="label">TEAM 💙🩷</div>
        <div className="val" style={{ color: '#2563eb' }}>
          {s.team}
        </div>
      </div>
      <div className="score-vs">VS</div>
      <div className="score-box">
        <div className="label">VERA 😈</div>
        <div className="val" style={{ color: '#dc2626' }}>
          {s.ki}
        </div>
      </div>
    </div>
  )
}
