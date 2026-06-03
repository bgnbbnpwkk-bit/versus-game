// Auflösung: beide Antworten aufgedeckt, richtige grün/falsche rot, Punkte + VERA-Kommentar.
import React from 'react'
import { PLAYERS, QUESTIONS_PER_ROUND } from '../config.js'
import VeraStage from './VeraStage.jsx'
import { veraExpressionForPoints } from './Vera.jsx'

const LETTERS = ['A', 'B', 'C', 'D']

export default function RevealScreen({ room, user, isHost, onNext, busy }) {
  const q = room.currentQuestion
  if (!q) return null

  const marc = room.answerMarc
  const melli = room.answerMelli
  const correct = q.correctIndex
  const pts = room.lastPoints || { team: 0, ki: 0 }
  const color = q.categoryColor || '#2563eb'
  const isLast = room.questionNumber >= QUESTIONS_PER_ROUND

  return (
    <div className="screen">
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
          const isCorrect = i === correct
          const cls = isCorrect ? 'correct' : marc === i || melli === i ? 'wrong' : ''
          return (
            <div key={i} className={`option ${cls}`} style={{ cursor: 'default' }}>
              <span className="letter">{LETTERS[i]}</span>
              <span>{opt}</span>
              <span className="marker">
                {marc === i && (
                  <span style={{ color: PLAYERS.marc.color }}>{PLAYERS.marc.emoji}</span>
                )}{' '}
                {melli === i && (
                  <span style={{ color: PLAYERS.melli.color }}>{PLAYERS.melli.emoji}</span>
                )}{' '}
                {isCorrect && '✓'}
              </span>
            </div>
          )
        })}
      </div>

      <div className="answers-grid">
        <div className="answer-card" style={{ borderColor: PLAYERS.marc.color }}>
          <div className="who" style={{ color: PLAYERS.marc.color }}>
            {PLAYERS.marc.emoji} Marc
          </div>
          <div className="pick">
            {marc != null ? `${LETTERS[marc]} ${marc === correct ? '✅' : '❌'}` : '–'}
          </div>
        </div>
        <div className="answer-card" style={{ borderColor: PLAYERS.melli.color }}>
          <div className="who" style={{ color: PLAYERS.melli.color }}>
            {PLAYERS.melli.emoji} Melli
          </div>
          <div className="pick">
            {melli != null ? `${LETTERS[melli]} ${melli === correct ? '✅' : '❌'}` : '–'}
          </div>
        </div>
      </div>

      {pts.team > 0 ? (
        <div className="points-badge points-team">
          +{pts.team} {pts.team === 2 ? 'Punkte – perfekte Harmonie! 🎯' : 'für das Team'}
        </div>
      ) : (
        <div className="points-badge points-ki">+{pts.ki} Punkt für VERA 😈</div>
      )}

      <div style={{ marginTop: 16 }}>
        <VeraStage
          expression={veraExpressionForPoints(pts)}
          line={room.veraComment}
          size={130}
        />
      </div>

      <div style={{ marginTop: 18 }}>
        {isHost ? (
          <button className="btn btn-primary" onClick={onNext} disabled={busy}>
            {busy ? 'Lädt…' : isLast ? 'Auswertung anzeigen 🏁' : 'Weiter ➡'}
          </button>
        ) : (
          <p className="muted">Warte, bis {PLAYERS.marc.name} weitermacht…</p>
        )}
      </div>
    </div>
  )
}
