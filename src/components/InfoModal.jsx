// i-Button-Modal: Features, Changelog (eingebettet) + Tech Stack am Ende.
// Enthält auch das Eingabefeld für den Gemini-API-Key (localStorage).
import React, { useState } from 'react'
import { getGeminiKey, setGeminiKey, getGeminiModel, setGeminiModel, testGemini } from '../geminiApi.js'

export default function InfoModal({ onClose, onLogout, user, soloTest, onToggleSolo }) {
  const [keyInput, setKeyInput] = useState(getGeminiKey())
  const [saved, setSaved] = useState(false)
  const hasKey = !!getGeminiKey()

  const [modelInput, setModelInput] = useState(getGeminiModel())
  const [modelSaved, setModelSaved] = useState(false)

  const handleSaveModel = () => {
    setGeminiModel(modelInput)
    setModelSaved(true)
    setTimeout(() => setModelSaved(false), 1500)
  }

  const [testing, setTesting] = useState(false)
  const [testMsg, setTestMsg] = useState(null)
  const handleTest = async () => {
    setTesting(true)
    setTestMsg(null)
    const r = await testGemini()
    setTesting(false)
    setTestMsg(r)
  }

  const handleSaveKey = () => {
    setGeminiKey(keyInput)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
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
    // Cache-Buster erzwingt eine echte Netzwerk-Navigation (umgeht iOS-Snapshot).
    const base = window.location.href.split('?')[0]
    window.location.replace(base + '?u=' + Date.now())
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Schließen">
          ×
        </button>

        <h2>Melli &amp; Marc vs. VERA 😈</h2>
        <p className="subtitle">Das Pärchen-Quiz gegen die KI.</p>

        <h3>Features</h3>
        <ul>
          <li>Kooperatives Quiz: Marc &amp; Melli gegen VERA (KI) 😈</li>
          <li>VERA als gezeichnete Gegnerin, die euch live gegenübersitzt</li>
          <li>8 Kategorien mit individuellen Farben</li>
          <li>Geheime Abstimmung: beide antworten unabhängig, Auflösung erst wenn beide fertig</li>
          <li>Punkte-System mit Harmonie-Bonus (2 Punkte bei gleicher richtiger Antwort)</li>
          <li>Echtzeit-Synchronisation über Firebase (zwei Handys)</li>
          <li>KI-generierte Fragen und freche Kommentare via Gemini API</li>
          <li>Google Auth (nur Marc &amp; Melli)</li>
          <li>PWA: installierbar auf iPhone &amp; Android</li>
        </ul>

        <h3>App</h3>
        <p className="subtitle" style={{ marginBottom: 10 }}>
          Version <strong>1.0.13</strong>. Falls eine neue Version nicht
          automatisch erscheint, hier frisch laden:
        </p>
        <button className="btn btn-ghost" onClick={handleForceUpdate}>
          🔄 App aktualisieren
        </button>

        <h3>Solo-Test</h3>
        <p className="subtitle" style={{ marginBottom: 10 }}>
          Allein testen: Die App simuliert den Partner automatisch (ist sofort
          „da" und antwortet zufällig), damit du den ganzen Ablauf ohne zweites
          Handy durchspielen kannst.
        </p>
        <button
          className={soloTest ? 'btn btn-melli' : 'btn btn-ghost'}
          onClick={onToggleSolo}
        >
          {soloTest ? '🧪 Solo-Test: AN (zum Deaktivieren tippen)' : '🧪 Solo-Test aktivieren'}
        </button>
        {soloTest && (
          <p className="config-note" style={{ marginTop: 8 }}>
            Tipp: Erstelle einen Raum – der Partner erscheint automatisch, dann
            „Spiel starten". Für echtes Spiel zu zweit bitte wieder ausschalten.
          </p>
        )}

        <h3>Changelog</h3>
        <ul>
          <li className="changelog-item">v1.0.13 – Echte KI-Fragen</li>
          <li>„Thinking" abgeschaltet → Modell liefert jetzt wirklich Fragen</li>
          <li>„KI testen" erzeugt eine echte Beispiel-Frage als Beweis</li>
          <li className="changelog-item">v1.0.12 – VERA sichtbar &amp; KI-Diagnose</li>
          <li>VERA wird im Spiel nicht mehr zusammengequetscht</li>
          <li>„KI testen"-Knopf zeigt die genaue Fehlermeldung</li>
          <li>In-App-Name „vs. VERA"</li>
          <li className="changelog-item">v1.0.11 – „vs. VERA"</li>
          <li>Neues App-Icon mit VERAs Gesicht (für beide gleich)</li>
          <li>App heißt jetzt „Melli &amp; Marc vs. VERA"</li>
          <li>Aktuelles KI-Modell (gemini-2.5-flash) + im i-Panel änderbar</li>
          <li>Keine Fragen-Wiederholung pro Kategorie (Fenster 20)</li>
          <li>Mehr eingebaute Reserve-Fragen; VERA im Spiel wieder sichtbar</li>
          <li className="changelog-item">v1.0.10 – Solo-Test-Modus</li>
          <li>Allein testen: App simuliert den Partner automatisch</li>
          <li className="changelog-item">v1.0.9 – Kein Versions-Rücksprung mehr</li>
          <li>Seite kommt immer frisch aus dem Netz (kein alter Cache)</li>
          <li className="changelog-item">v1.0.8 – Frischere Fragen</li>
          <li>Zufälliger Themen-Aspekt pro Frage (mehr Abwechslung)</li>
          <li>Anweisung an die KI: originell statt 08/15</li>
          <li className="changelog-item">v1.0.7 – VERAs Augen-Fix</li>
          <li>VERA hat jetzt richtige Anime-Augen (Pupillen sichtbar)</li>
          <li className="changelog-item">v1.0.6 – Süße VERA &amp; Bugfixes</li>
          <li>VERA neu: süßes Anime-Mädchen im Hasen-Hoodie, voll sichtbar</li>
          <li>Antwort erst nach „Antwort bestätigen" (kein Fehltipp mehr)</li>
          <li>Antwort-Hänger behoben (Server ist alleinige Wahrheit)</li>
          <li>„App aktualisieren" erzwingt jetzt frischen Stand</li>
          <li className="changelog-item">v1.0.5 – Spiel-Feinschliff</li>
          <li>Installierbare App-Icons (Android/iOS)</li>
          <li>Faire Kategorie-Verteilung (keine Häufung)</li>
          <li>Keine doppelten Fragen mehr (pro &amp; über Runden)</li>
          <li>Kein Layout-Sprung beim Antworten (keine Fehlantworten)</li>
          <li>VERAs Reaktion steht jetzt oben</li>
          <li className="changelog-item">v1.0.4 – VERA im Manga-Style</li>
          <li>Frecher, überheblicher „smug"-Blick als Standard</li>
          <li>Große Anime-Augen mit Glanzlichtern, spitze Frisur</li>
          <li>Manga-Reaktionen: fieses Lachen, Funkel-Augen, Anime-Träne</li>
          <li className="changelog-item">v1.0.3 – Zuverlässiges Auto-Update</li>
          <li>Update-Prüfung beim App-Wechsel (iOS-Fix)</li>
          <li>Manueller „App aktualisieren"-Button</li>
          <li className="changelog-item">v1.0.2 – VERA bekommt ein Gesicht</li>
          <li>VERA sitzt euch als gezeichnete Figur gegenüber</li>
          <li>Live-Mimik: hämisch, lauernd, schadenfroh, beeindruckt, geschlagen</li>
          <li>Sprechblasen am „Tisch" in jeder Spielphase</li>
          <li className="changelog-item">v1.0.1 – Auth &amp; Datenbank</li>
          <li>Login über Firebase Auth SDK (Google Sign-In)</li>
          <li>Gemini-API-Key im i-Panel eingebbar (localStorage)</li>
          <li>Realtime-DB-REST-Aufrufe mit Auth-Token (Fix für 401)</li>
          <li>Klartext-Fehlermeldungen bei DB-Problemen</li>
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
