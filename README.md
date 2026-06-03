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
- Google Auth via Google Identity Services (kein Firebase SDK)
- Gemini API (`gemini-2.5-flash-preview-05-20`) für Fragen & Kommentare
- PWA mit Service Worker (Auto-Update)
- Deployment: GitHub Pages via GitHub Actions (Branch `main`)

## Konfiguration (nach dem Deployment)

In `src/config.js` die beiden Platzhalter ersetzen:

| Konstante          | Wofür                       | Woher                                                                                                   |
| ------------------ | --------------------------- | ------------------------------------------------------------------------------------------------------- |
| `GEMINI_API_KEY`   | KI-Fragen & VERA-Kommentare | https://aistudio.google.com/app/apikey                                                                  |
| `GOOGLE_CLIENT_ID` | Google-Login (nur Marc & Melli) | Google Cloud Console → OAuth-Client (Web). Autorisierte JS-Herkunft: `https://bgnbbnpwkk-bit.github.io` |

> Solange `GOOGLE_CLIENT_ID` ein Platzhalter ist, bietet der Login-Screen einen
> **Demo-Login** (Als Marc / Als Melli testen), damit die App sofort spielbar
> ist. Ohne gültigen `GEMINI_API_KEY` werden eingebaute Fallback-Fragen genutzt.

Die Firebase-Konfiguration (`unser-einkaufszettel`) ist bereits eingetragen –
diese Keys sind Client-seitig und nicht geheim.

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
