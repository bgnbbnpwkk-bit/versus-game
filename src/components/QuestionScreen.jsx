// Fragebildschirm: geheime Abstimmung. Eigene Antwort sichtbar, Partner-Antwort nicht.
import React from 'react'
import { PLAYERS, QUESTIONS_PER_ROUND } from '../config.js'
import VeraStage from './VeraStage.jsx'
import { pickQuestionTaunt } from './Vera.jsx'

const LETTERS = ['A', 'B', 'C', 'D']

export default function QuestionScreen({ room, user, onAnswer }) {
  const q = room.currentQuestion
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

  const myAnswer = user.id === 'marc' ? room.answerMarc : room.answerMelli
  const partnerAnswer = user.id === 'marc' ? room.answerMelli : room.answerMarc
  const partner = user.id === 'marc' ? PLAYERS.melli : PLAYERS.marc
  const hasAnswered = myAnswer !== null && myAnswer !== undefined
  const partnerAnswered = partnerAnswer !== null && partnerAnswer !== undefined

  const color = q.categoryColor || '#2563eb'

  const bothAnswered = hasAnswered && partnerAnswered

  return (
    <div className="screen">
      <VeraStage
        expression={bothAnswered ? 'think' : 'smug'}
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
          const selected = myAnswer === i
          return (
            <button
              key={i}
              className={`option ${selected ? 'selected' : ''}`}
              style={selected ? { '--accent': color } : undefined}
              disabled={hasAnswered}
              onClick={() => onAnswer(i)}
            >
              <span className="letter">{LETTERS[i]}</span>
              <span>{opt}</span>
              {selected && <span className="marker">✓ deine Wahl</span>}
            </button>
          )
        })}
      </div>

      {hasAnswered && (
        <div className="wait-indicator">
          {partnerAnswered ? (
            <>Beide bereit – wird aufgedeckt…</>
          ) : (
            <>
              <span className="dots">
                <span />
                <span />
                <span />
              </span>
              {partner.name} tippt noch…
            </>
          )}
        </div>
      )}

      {!hasAnswered && partnerAnswered && (
        <div className="wait-indicator" style={{ color: partner.color }}>
          {partner.emoji} {partner.name} hat schon geantwortet – du bist dran!
        </div>
      )}
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
