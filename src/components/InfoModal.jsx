// i-Button-Modal: rein informativ – Features, Changelog, Tech Stack.
// Alles mit Setup-Charakter liegt jetzt im Zahnrad (SettingsModal).
import React from 'react'
import { APP_VERSION } from '../version.js'

export default function InfoModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Schließen">
          ×
        </button>

        <h2>Melli &amp; Marc vs. VERA 😈</h2>
        <p className="subtitle">
          Das Pärchen-Quiz gegen die KI. · Version {APP_VERSION}
        </p>

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

        <h3>Changelog</h3>
        <ul>
          <li className="changelog-item">v1.2.1 – Animationen sichtbar</li>
          <li>Konfetti überlagert jetzt den ganzen Bildschirm (Portal)</li>
          <li>Richtige Antwort pulst dauerhaft – sichtbar beim Hinscrollen</li>
          <li className="changelog-item">v1.2.0 – Sound &amp; Animationen</li>
          <li>Soundeffekte (Tippen, Auflösen, Sieg/Niederlage) – im ⚙️ stummschaltbar</li>
          <li>Konfetti bei perfekter Harmonie &amp; Team-Sieg</li>
          <li>Richtige Antwort pulst, falsche wackelt</li>
          <li className="changelog-item">v1.1.0 – Aufgeräumt</li>
          <li>Saubere Versionierung (SemVer) ab dieser Version</li>
          <li>Einstellungen ins neue Zahnrad ⚙️ ausgelagert (i bleibt rein informativ)</li>
          <li>VERA verspottet nur noch, wer wirklich falsch lag</li>
          <li>Echte, abwechslungsreiche KI-Fragen (Thinking-Fix)</li>
          <li className="changelog-item">1.0er-Reihe – Aufbau &amp; Feinschliff</li>
          <li>Süße VERA im Hasen-Hoodie mit Live-Mimik &amp; Sprechblasen</li>
          <li>„Antwort bestätigen"-Flow (keine Fehltipps/Hänger)</li>
          <li>Faire Kategorien, keine Fragen-Wiederholung (Fenster 20)</li>
          <li>Solo-Test-Modus, App-Icon mit VERA, „vs. VERA"-Name</li>
          <li>Zuverlässige Updates (kein Versions-Rücksprung)</li>
          <li>Firebase-Multiplayer, Google-Login, PWA-Installation</li>
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

        <div className="modal-footer">Ein Spiel von Team Melli &amp; Marc 💙🩷</div>
      </div>
    </div>
  )
}
