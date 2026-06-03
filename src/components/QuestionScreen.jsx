// Fragebildschirm: geheime Abstimmung. Eigene Antwort sichtbar, Partner-Antwort nicht.
// Wichtig: feste Layout-Höhen, damit sich beim Antworten NICHTS verschiebt.
import React, { useEffect, useState } from 'react'
import { PLAYERS, QUESTIONS_PER_ROUND } from '../config.js'
import VeraStage from './VeraStage.jsx'
import { pickQuestionTaunt } from './Vera.jsx'

const LETTERS = ['A', 'B', 'C', 'D']

export default function QuestionScreen({ room, user, onAnswer }) {
  const q = room.currentQuestion

  // Lokale Antwort-Sperre: einmal getippt bleibt es gewählt/gesperrt, auch wenn
  // ein Polling-Zyklus den Serverwert kurz noch nicht enthält (kein Flackern).
  const [pick, setPick] = useState(null)
  useEffect(() => {
    setPick(null)
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
  const hasServer = serverAnswer !== null && serverAnswer !== undefined
  const myAnswer = hasServer ? serverAnswer : pick
  const partnerAnswer = user.id === 'marc' ? room.answerMelli : room.answerMarc
  const partner = user.id === 'marc' ? PLAYERS.melli : PLAYERS.marc
  const hasAnswered = myAnswer !== null && myAnswer !== undefined
  const partnerAnswered = partnerAnswer !== null && partnerAnswer !== undefined

  const color = q.categoryColor || '#2563eb'

  const handlePick = (i) => {
    if (hasAnswered) return
    setPick(i)
    onAnswer(i)
  }

  return (
    <div className="screen">
      <VeraStage
        expression={hasAnswered && partnerAnswered ? 'think' : 'smug'}
        line={pickQuestionTaunt(room.questionNumber)}
        size={104}
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
          const selected = myAnswer === i
          return (
            <button
              key={i}
              className={`option ${selected ? 'selected' : ''}`}
              style={selected ? { '--accent': color } : undefined}
              disabled={hasAnswered}
              onClick={() => handlePick(i)}
            >
              <span className="letter">{LETTERS[i]}</span>
              <span className="opt-text">{opt}</span>
              {selected && <span className="marker">✓</span>}
            </button>
          )
        })}
      </div>

      {/* Feste Höhe -> kein Layout-Sprung, wenn jemand antwortet */}
      <div className="q-status">
        {hasAnswered ? (
          partnerAnswered ? (
            <span>Beide bereit – wird aufgedeckt… ✨</span>
          ) : (
            <>
              <span className="dots">
                <span />
                <span />
                <span />
              </span>
              <span>{partner.name} tippt noch…</span>
            </>
          )
        ) : partnerAnswered ? (
          <span style={{ color: partner.color, fontWeight: 700 }}>
            {partner.emoji} {partner.name} ist fertig – jetzt du!
          </span>
        ) : (
          <span className="muted" style={{ margin: 0 }}>
            Tippe deine Antwort – ihr entscheidet unabhängig.
          </span>
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
