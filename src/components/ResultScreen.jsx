// Endauswertung: Team vs. VERA, Gewinner-Animation, History, Nochmal spielen.
import React from 'react'

export default function ResultScreen({ room, isHost, onPlayAgain, onLeave, highscore, busy }) {
  const s = room.scores || { team: 0, ki: 0 }
  const history = room.roundHistory || []
  const teamWon = s.team > s.ki
  const draw = s.team === s.ki

  const emoji = draw ? '🤝' : teamWon ? '🏆' : '😈'
  const headline = draw
    ? 'Unentschieden!'
    : teamWon
    ? 'Team Melli & Marc gewinnt!'
    : 'VERA triumphiert…'

  return (
    <div className="screen">
      <div className="result-hero" style={{ marginTop: 10 }}>
        <div className="result-emoji">{emoji}</div>
        <h1 className="title">{headline}</h1>
        <div className="result-score">
          Team {s.team} · {s.ki} VERA
        </div>
        {highscore != null && (
          <p className="muted">Bester Team-Score bisher: {highscore}</p>
        )}
      </div>

      <div className="history">
        {history.map((h, i) => (
          <div className="history-row" key={i}>
            <span className="hist-cat" style={{ color: h.categoryColor }}>
              {i + 1}. {h.category}
            </span>
            <span
              className="hist-pts"
              style={{ color: h.teamPoints > 0 ? '#16a34a' : '#dc2626' }}
            >
              {h.teamPoints > 0 ? `+${h.teamPoints} Team` : `+${h.kiPoints} VERA`}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {isHost ? (
          <button className="btn btn-primary" onClick={onPlayAgain} disabled={busy}>
            {busy ? 'Neue Runde…' : 'Nochmal spielen 🔁'}
          </button>
        ) : (
          <p className="muted">Warte auf eine neue Runde…</p>
        )}
        <button className="btn btn-ghost" onClick={onLeave} disabled={busy}>
          Raum verlassen
        </button>
      </div>
    </div>
  )
}
