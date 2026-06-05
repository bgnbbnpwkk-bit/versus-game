// Modus-Wahl nach dem Login: „vs. VERA" oder „Die Jagd".
import React from 'react'
import VeraStage from './VeraStage.jsx'

const LINES = [
  'Na, worauf habt ihr heute Lust? Verlieren könnt ihr in beidem.',
  'Wählt euer Schicksal. Ich bin in jedem Fall dabei. 😈',
  'Zwei Modi, eine Gewinnerin: ich.',
]

export default function ModeSelectScreen({ user, onSelect }) {
  const line = LINES[Math.floor(Math.random() * LINES.length)]
  return (
    <div className="screen">
      <VeraStage expression="smug" line={line} size={118} compact />

      <div className="center-stack">
        <div style={{ textAlign: 'center' }}>
          <span className="player-pill" style={{ background: user.color }}>
            {user.emoji} {user.name}
          </span>
          <h1 className="title" style={{ marginTop: 12 }}>
            Welcher Modus?
          </h1>
        </div>

        <button className="mode-card mode-versus" onClick={() => onSelect('versus')}>
          <div className="mode-emoji">😈</div>
          <div className="mode-text">
            <div className="mode-name">vs. VERA</div>
            <div className="mode-desc">Marc &amp; Melli gemeinsam gegen die KI</div>
          </div>
        </button>

        <button className="mode-card mode-jagd" onClick={() => onSelect('jagd')}>
          <div className="mode-emoji">🐆</div>
          <div className="mode-text">
            <div className="mode-name">Die Jagd</div>
            <div className="mode-desc">Marc &amp; Melli gegeneinander – Kandidat vs. Jäger</div>
          </div>
        </button>
      </div>

      <div style={{ textAlign: 'center', paddingTop: 12 }}>
        <span className="team-tag">Ein Spiel von Team Melli &amp; Marc 💙🩷</span>
      </div>
    </div>
  )
}
