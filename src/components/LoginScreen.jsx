// Login per Google (Firebase Auth SDK). Nur Marc & Melli erhalten Zugriff.
import React from 'react'

export default function LoginScreen({ onSignIn, authError }) {
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

        <button className="btn btn-primary google-btn" onClick={onSignIn}>
          <span className="g-logo" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.5 29.4 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.7 15.1 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.5 29.4 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 43.5c5.3 0 10.1-2 13.7-5.3l-6.3-5.3c-2 1.5-4.6 2.4-7.4 2.4-5.2 0-9.6-3.3-11.2-7.9l-6.6 5.1C9.6 39 16.2 43.5 24 43.5z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4 5.6l6.3 5.3c-.4.4 6.9-5 6.9-14.9 0-1.2-.1-2.3-.4-3.5z"
              />
            </svg>
          </span>
          Mit Google anmelden
        </button>

        {authError && <p className="auth-error">{authError}</p>}

        <p className="config-note">Zugriff nur für Marc &amp; Melli.</p>
      </div>
      <div style={{ textAlign: 'center', paddingTop: 16 }}>
        <span className="team-tag">Ein Spiel von Team Melli &amp; Marc 💙🩷</span>
      </div>
    </div>
  )
}
