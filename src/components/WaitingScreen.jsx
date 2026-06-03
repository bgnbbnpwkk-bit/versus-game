// Warten auf den zweiten Spieler. Host kann starten, wenn beide da sind.
import React from 'react'
import { PLAYERS } from '../config.js'
import VeraStage from './VeraStage.jsx'
import { pickWaitLine } from './Vera.jsx'

export default function WaitingScreen({ room, roomCode, user, isHost, onStart, onLeave, busy }) {
  const players = room.players || {}
  const bothHere = players.marc && players.melli

  return (
    <div className="screen">
      <VeraStage expression="smug" line={pickWaitLine(Number(roomCode))} size={118} compact />

      <div className="center-stack">
        <div style={{ textAlign: 'center' }}>
          <p className="subtitle">Raumcode – an den/die Partner:in weitergeben:</p>
          <div className="room-code">{roomCode}</div>
        </div>

        <div className="presence-row">
          <div className={`presence ${players.marc ? 'here' : ''}`} style={{ color: PLAYERS.marc.color }}>
            {PLAYERS.marc.emoji} {PLAYERS.marc.name}
            <div className="muted">{players.marc ? 'ist da' : 'fehlt noch…'}</div>
          </div>
          <div className={`presence ${players.melli ? 'here' : ''}`} style={{ color: PLAYERS.melli.color }}>
            {PLAYERS.melli.emoji} {PLAYERS.melli.name}
            <div className="muted">{players.melli ? 'ist da' : 'fehlt noch…'}</div>
          </div>
        </div>

        {!bothHere && (
          <div style={{ textAlign: 'center' }}>
            <div className="dots">
              <span />
              <span />
              <span />
            </div>
            <p className="muted" style={{ marginTop: 10 }}>
              Warten auf {players.marc ? PLAYERS.melli.name : PLAYERS.marc.name}…
            </p>
          </div>
        )}

        {bothHere && isHost && (
          <button className="btn btn-primary" onClick={onStart} disabled={busy}>
            {busy ? 'VERA bereitet sich vor…' : 'Spiel starten 🚀'}
          </button>
        )}

        {bothHere && !isHost && (
          <p className="muted">Beide bereit! Warte, bis {PLAYERS.marc.name} startet…</p>
        )}

        <button className="btn btn-ghost" onClick={onLeave} disabled={busy}>
          Raum verlassen
        </button>
      </div>
    </div>
  )
}
