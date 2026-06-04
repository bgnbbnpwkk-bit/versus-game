// Auflösung: VERAs Reaktion + Punkte zuerst (oben), dann die Detail-Aufschlüsselung.
import React, { useEffect } from 'react'
import { PLAYERS, QUESTIONS_PER_ROUND } from '../config.js'
import VeraStage from './VeraStage.jsx'
import { veraExpressionForPoints } from './Vera.jsx'
import Confetti from './Confetti.jsx'
import { playReveal } from '../sound.js'

function outcomeFromPoints(pts) {
  if (!pts) return 'one'
  if (pts.ki > 0) return 'fail'
  if (pts.team >= 2) return 'harmony'
  if (pts.team >= 1) return 'split'
  return 'one'
}

const LETTERS = ['A', 'B', 'C', 'D']

export default function RevealScreen({ room, user, isHost, onNext, busy }) {
  const q = room.currentQuestion
  const pts = room.lastPoints || { team: 0, ki: 0 }
  const outcome = outcomeFromPoints(pts)

  // Sound einmal beim Aufdecken (pro Frage frisch gemountet).
  useEffect(() => {
    playReveal(outcome)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!q) return null

  const marc = room.answerMarc
  const melli = room.answerMelli
  const correct = q.correctIndex
  const color = q.categoryColor || '#2563eb'
  const isLast = room.questionNumber >= QUESTIONS_PER_ROUND

  return (
    <div className="screen">
      {outcome === 'harmony' && <Confetti />}
      <div className="q-header">
        <span className="cat-badge" style={{ background: color }}>
          {q.category}
        </span>
        <span className="q-counter">
          {room.questionNumber} / {QUESTIONS_PER_ROUND}
        </span>
      </div>

      {/* VERAs Reaktion zuerst – sie steht im Mittelpunkt */}
      <VeraStage expression={veraExpressionForPoints(pts)} line={room.veraComment} size={120} compact />

      {pts.team > 0 ? (
        <div className="points-badge points-team" style={{ marginTop: 14 }}>
          +{pts.team} {pts.team === 2 ? 'Punkte – perfekte Harmonie! 🎯' : 'für das Team'}
        </div>
      ) : (
        <div className="points-badge points-ki" style={{ marginTop: 14 }}>
          +{pts.ki} Punkt für VERA 😈
        </div>
      )}

      <h2 className="q-text" style={{ marginTop: 18 }}>
        {q.text}
      </h2>

      <div className="options">
        {q.options.map((opt, i) => {
          const isCorrect = i === correct
          const cls = isCorrect ? 'correct' : marc === i || melli === i ? 'wrong' : ''
          return (
            <div key={i} className={`option ${cls}`} style={{ cursor: 'default' }}>
              <span className="letter">{LETTERS[i]}</span>
              <span className="opt-text">{opt}</span>
              <span className="marker">
                {marc === i && <span style={{ color: PLAYERS.marc.color }}>{PLAYERS.marc.emoji}</span>}{' '}
                {melli === i && <span style={{ color: PLAYERS.melli.color }}>{PLAYERS.melli.emoji}</span>}{' '}
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
