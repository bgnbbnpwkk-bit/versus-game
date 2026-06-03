// Login per Google. Nur Marc & Melli erhalten Zugriff.
import React, { useEffect, useRef } from 'react'
import { renderGoogleButton, isGoogleConfigured } from '../auth.js'
import { PLAYERS } from '../config.js'

export default function LoginScreen({ onCredential, authError }) {
  const btnRef = useRef(null)

  useEffect(() => {
    // GIS lädt asynchron – ein paar Versuche, bis window.google bereit ist.
    let tries = 0
    const tryRender = () => {
      if (!btnRef.current) return
      const ok = renderGoogleButton(btnRef.current, onCredential)
      if (!ok && tries < 40) {
        tries++
        setTimeout(tryRender, 150)
      }
    }
    tryRender()
  }, [onCredential])

  const configured = isGoogleConfigured()

  return (
    <div className="screen">
      <div className="center-stack">
        <div className="login-hero">
          <div className="login-emoji">🎮</div>
          <h1 className="title">VERSUS</h1>
          <p className="subtitle">
            Team Melli &amp; Marc <strong>gegen die KI</strong>.<br />
            Bitte mit eurem Google-Account anmelden.
          </p>
        </div>

        {configured && <div className="gsi-wrap" ref={btnRef} />}

        {authError && <p className="auth-error">{authError}</p>}

        {!configured && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p className="config-note">
              Google-Login ist noch nicht konfiguriert
              (<code>GOOGLE_CLIENT_ID</code> in <code>src/config.js</code> setzen).
              Solange könnt ihr im Demo-Modus testen:
            </p>
            <button className="btn btn-primary" onClick={() => onCredential(PLAYERS.marc.email)}>
              Als Marc testen 💙
            </button>
            <button className="btn btn-melli" onClick={() => onCredential(PLAYERS.melli.email)}>
              Als Melli testen 🩷
            </button>
          </div>
        )}

        <p className="config-note">Zugriff nur für Marc &amp; Melli.</p>
      </div>
      <div style={{ textAlign: 'center', paddingTop: 16 }}>
        <span className="team-tag">Ein Spiel von Team Melli &amp; Marc 💙🩷</span>
      </div>
    </div>
  )
}
