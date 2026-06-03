# VERSUS – Team Melli & Marc gegen die KI 🎮

Ein kooperatives Quiz-Duell als PWA: **Marc & Melli spielen gemeinsam als Team
gegen VERA**, eine freche, provokante Quiz-KI. Beide spielen auf dem eigenen
Handy, antworten pro Frage **geheim und unabhängig** – aufgedeckt wird erst,
wenn beide bestätigt haben.

**Live:** https://bgnbbnpwkk-bit.github.io/versus-game/

## Spielprinzip

- VERA stellt eine Multiple-Choice-Frage (4 Antworten) aus einer von 8 Kategorien.
- Beide tippen unabhängig – ohne die Antwort des anderen zu sehen.
- Punkte:
  - Beide richtig & **gleiche** Antwort → **2 Punkte** (perfekte Harmonie)
  - Beide richtig, verschieden → **1 Punkt**
  - Einer richtig → **0,5 Punkte**
  - Beide falsch → **1 Punkt für VERA** + frecher Kommentar
- Eine Runde = 10 Fragen. Am Ende: Team vs. VERA.

## Tech Stack

- React 18 + Vite
- Firebase Realtime Database (**nur REST API**, kein SDK) – Polling alle 800 ms
- Google Auth via **Firebase Auth SDK** (Google Sign-In, keine separate Client-ID nötig)
- Gemini API (`gemini-2.5-flash-preview-05-20`) für Fragen & Kommentare
- PWA mit Service Worker (Auto-Update)
- Deployment: GitHub Pages via GitHub Actions (Branch `main`)

## Konfiguration (nach dem Deployment)

- **Gemini-API-Key**: wird **nicht im Code** hinterlegt, sondern direkt in der App
  über das **i-Panel** eingegeben und in `localStorage` gespeichert (pro Gerät).
  Key holen: https://aistudio.google.com/app/apikey – ohne Key nutzt das Spiel
  eingebaute Fallback-Fragen.
- **Google-Login**: läuft über das Firebase Auth SDK – keine separate Client-ID
  nötig. In der **Firebase Console** muss nur einmalig die Domain
  `bgnbbnpwkk-bit.github.io` unter _Authentication → Settings → Authorized domains_
  freigegeben und _Google_ als Sign-in-Provider aktiviert sein.

Die Firebase-Konfiguration (`unser-einkaufszettel`) ist bereits in `src/config.js`
eingetragen – diese Keys sind Client-seitig und nicht geheim.

## Entwicklung

```bash
npm install
npm run dev      # lokaler Dev-Server
npm run build    # Produktions-Build nach dist/
```

## Deployment

Push auf `main` → GitHub Actions (`.github/workflows/deploy.yml`) baut und
deployed automatisch nach GitHub Pages. **GitHub Pages Source = GitHub Actions.**
Kein `gh-pages`-Branch, kein `gh-pages`-Package.

---

Ein Spiel von Team Melli & Marc 💙🩷
