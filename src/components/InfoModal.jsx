// i-Button-Modal: Features, Changelog (eingebettet) + Tech Stack am Ende.
// Enthält auch das Eingabefeld für den Gemini-API-Key (localStorage).
import React, { useState } from 'react'
import { getGeminiKey, setGeminiKey } from '../geminiApi.js'

export default function InfoModal({ onClose, onLogout, user }) {
  const [keyInput, setKeyInput] = useState(getGeminiKey())
  const [saved, setSaved] = useState(false)
  const hasKey = !!getGeminiKey()

  const handleSaveKey = () => {
    setGeminiKey(keyInput)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Schließen">
          ×
        </button>

        <h2>VERSUS 🎮</h2>
        <p className="subtitle">Das Pärchen-Quiz gegen die KI.</p>

        <h3>Features</h3>
        <ul>
          <li>Kooperatives Quiz: Marc &amp; Melli gegen VERA (KI) 😈</li>
          <li>8 Kategorien mit individuellen Farben</li>
          <li>Geheime Abstimmung: beide antworten unabhängig, Auflösung erst wenn beide fertig</li>
          <li>Punkte-System mit Harmonie-Bonus (2 Punkte bei gleicher richtiger Antwort)</li>
          <li>Echtzeit-Synchronisation über Firebase (zwei Handys)</li>
          <li>KI-generierte Fragen und freche Kommentare via Gemini API</li>
          <li>Google Auth (nur Marc &amp; Melli)</li>
          <li>PWA: installierbar auf iPhone &amp; Android</li>
        </ul>

        <h3>Changelog</h3>
        <ul>
          <li className="changelog-item">v1.0.0 – Initiale Version</li>
          <li>Grundspiel mit 8 Kategorien</li>
          <li>VERA als freche KI-Gegnerin</li>
          <li>Firebase Realtime DB Multiplayer</li>
          <li>Gemini API für Fragen &amp; Kommentare</li>
          <li>Google Auth</li>
          <li>PWA Support</li>
        </ul>

        <h3>Tech Stack</h3>
        <ul>
          <li>React 18 + Vite</li>
          <li>Firebase Realtime Database (REST API)</li>
          <li>Firebase / Google Auth</li>
          <li>Gemini API (2.5 Flash)</li>
          <li>GitHub Pages via GitHub Actions</li>
          <li>PWA mit Service Worker</li>
        </ul>

        <h3>KI-Schlüssel (Gemini)</h3>
        <p className="subtitle" style={{ marginBottom: 10 }}>
          Für KI-generierte Fragen &amp; VERA-Kommentare. Der Key wird nur lokal auf
          diesem Gerät gespeichert. Ohne Key nutzt das Spiel eingebaute Fragen.
        </p>
        <div className="key-row">
          <input
            className="field"
            style={{ textAlign: 'left', flex: 1 }}
            type="password"
            placeholder="Gemini API Key einfügen…"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
          />
          <button className="btn btn-primary" style={{ width: 'auto', padding: '0 18px' }} onClick={handleSaveKey}>
            {saved ? '✓' : 'Speichern'}
          </button>
        </div>
        <div className={`key-status ${hasKey ? 'ok' : 'missing'}`}>
          {hasKey ? '✓ Key gespeichert – VERA generiert eigene Fragen.' : 'Kein Key – Fallback-Fragen aktiv.'}
        </div>

        {user && (
          <>
            <h3>Account</h3>
            <p className="subtitle" style={{ marginBottom: 12 }}>
              Eingeloggt als <strong style={{ color: user.color }}>{user.name}</strong> ({user.email})
            </p>
            <button className="btn btn-ghost" onClick={onLogout}>
              Abmelden
            </button>
          </>
        )}

        <div className="modal-footer">Ein Spiel von Team Melli &amp; Marc 💙🩷</div>
      </div>
    </div>
  )
}
