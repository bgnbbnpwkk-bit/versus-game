// Raum erstellen (Marc) oder beitreten (Melli) per 4-stelligem Code.
import React, { useState } from 'react'

export default function LobbyScreen({ user, onCreate, onJoin, busy, error }) {
  const [mode, setMode] = useState(null) // null | 'join'
  const [code, setCode] = useState('')

  const isMarc = user.id === 'marc'

  return (
    <div className="screen">
      <div className="center-stack">
        <div style={{ textAlign: 'center' }}>
          <span
            className="player-pill"
            style={{ background: user.color }}
          >
            {user.emoji} {user.name}
          </span>
          <h1 className="title" style={{ marginTop: 14 }}>
            Bereit zum Duell?
          </h1>
          <p className="subtitle">
            Ihr spielt zusammen gegen VERA. Erstellt einen Raum oder tretet einem bei.
          </p>
        </div>

        {mode !== 'join' && (
          <>
            <button
              className={isMarc ? 'btn btn-primary' : 'btn btn-melli'}
              onClick={onCreate}
              disabled={busy}
            >
              {busy ? 'Erstelle Raum…' : 'Neuen Raum erstellen'}
            </button>
            <div className="divider">oder</div>
            <button className="btn btn-ghost" onClick={() => setMode('join')} disabled={busy}>
              Raum beitreten
            </button>
          </>
        )}

        {mode === 'join' && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p className="subtitle" style={{ textAlign: 'center' }}>
              Gib den 4-stelligen Raumcode ein:
            </p>
            <input
              className="field code-input"
              inputMode="numeric"
              maxLength={4}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="0000"
              autoFocus
            />
            <button
              className={isMarc ? 'btn btn-primary' : 'btn btn-melli'}
              onClick={() => onJoin(code)}
              disabled={busy || code.length !== 4}
            >
              {busy ? 'Trete bei…' : 'Beitreten'}
            </button>
            <button className="btn btn-ghost" onClick={() => setMode(null)} disabled={busy}>
              Zurück
            </button>
          </div>
        )}

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  )
}
