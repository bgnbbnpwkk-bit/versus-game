// Einstellungen (Zahnrad): alles mit Setup-Charakter.
// KI-Schlüssel/Modell/Test, Solo-Test, App aktualisieren, Account.
import React, { useState } from 'react'
import {
  getGeminiKey,
  setGeminiKey,
  getGeminiModel,
  setGeminiModel,
  testGemini,
} from '../geminiApi.js'
import { APP_VERSION } from '../version.js'
import { isMuted, setMuted } from '../sound.js'

export default function SettingsModal({ onClose, onLogout, user, soloTest, onToggleSolo }) {
  const [keyInput, setKeyInput] = useState(getGeminiKey())
  const [saved, setSaved] = useState(false)
  const hasKey = !!getGeminiKey()

  const [modelInput, setModelInput] = useState(getGeminiModel())
  const [modelSaved, setModelSaved] = useState(false)

  const [testing, setTesting] = useState(false)
  const [testMsg, setTestMsg] = useState(null)

  const [muted, setMutedState] = useState(isMuted())
  const toggleMuted = () => {
    const nv = !muted
    setMuted(nv)
    setMutedState(nv)
  }

  const handleSaveKey = () => {
    setGeminiKey(keyInput)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const handleSaveModel = () => {
    setGeminiModel(modelInput)
    setModelSaved(true)
    setTimeout(() => setModelSaved(false), 1500)
  }

  const handleTest = async () => {
    setTesting(true)
    setTestMsg(null)
    const r = await testGemini()
    setTesting(false)
    setTestMsg(r)
  }

  // Erzwingt frischen Stand: SW abmelden, alle Caches löschen, frische Navigation.
  const handleForceUpdate = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations()
        await Promise.all(regs.map((r) => r.unregister()))
      }
      if (window.caches) {
        const keys = await caches.keys()
        await Promise.all(keys.map((k) => caches.delete(k)))
      }
    } catch {
      /* ignore */
    }
    const base = window.location.href.split('?')[0]
    window.location.replace(base + '?u=' + Date.now())
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Schließen">
          ×
        </button>

        <h2>Einstellungen ⚙️</h2>
        <p className="subtitle">Setup für KI, Test &amp; App.</p>

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

        <p className="subtitle" style={{ margin: '12px 0 8px' }}>
          KI-Modell (nur ändern, falls Google ein Modell abschaltet):
        </p>
        <div className="key-row">
          <input
            className="field"
            style={{ textAlign: 'left', flex: 1 }}
            type="text"
            placeholder="gemini-2.5-flash"
            value={modelInput}
            onChange={(e) => setModelInput(e.target.value)}
          />
          <button className="btn btn-ghost" style={{ width: 'auto', padding: '0 18px' }} onClick={handleSaveModel}>
            {modelSaved ? '✓' : 'Setzen'}
          </button>
        </div>

        <button className="btn btn-ghost" style={{ marginTop: 10 }} onClick={handleTest} disabled={testing}>
          {testing ? 'Teste KI…' : '🧪 KI-Verbindung testen'}
        </button>
        {testMsg && (
          <div className={`key-status ${testMsg.ok ? 'ok' : 'missing'}`} style={{ marginTop: 6 }}>
            {testMsg.ok ? '✓ ' : '⚠️ '}
            {testMsg.message}
          </div>
        )}

        <h3>Solo-Test</h3>
        <p className="subtitle" style={{ marginBottom: 10 }}>
          Allein testen: Die App simuliert den Partner automatisch (ist sofort „da"
          und antwortet zufällig), damit du den ganzen Ablauf ohne zweites Handy
          durchspielen kannst.
        </p>
        <button className={soloTest ? 'btn btn-melli' : 'btn btn-ghost'} onClick={onToggleSolo}>
          {soloTest ? '🧪 Solo-Test: AN (zum Deaktivieren tippen)' : '🧪 Solo-Test aktivieren'}
        </button>
        {soloTest && (
          <p className="config-note" style={{ marginTop: 8 }}>
            Tipp: Erstelle einen Raum – der Partner erscheint automatisch, dann
            „Spiel starten". Für echtes Spiel zu zweit bitte wieder ausschalten.
          </p>
        )}

        <h3>Ton</h3>
        <p className="subtitle" style={{ marginBottom: 10 }}>
          Soundeffekte beim Antworten, Auflösen und am Ende.
        </p>
        <button className={muted ? 'btn btn-ghost' : 'btn btn-primary'} onClick={toggleMuted}>
          {muted ? '🔇 Ton ist AUS (zum Einschalten tippen)' : '🔊 Ton ist AN (zum Stummschalten tippen)'}
        </button>

        <h3>App</h3>
        <p className="subtitle" style={{ marginBottom: 10 }}>
          Version <strong>{APP_VERSION}</strong>. Falls eine neue Version nicht
          automatisch erscheint, hier frisch laden:
        </p>
        <button className="btn btn-ghost" onClick={handleForceUpdate}>
          🔄 App aktualisieren
        </button>

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
