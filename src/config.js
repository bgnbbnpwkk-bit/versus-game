// =====================================================================
// VERSUS – Zentrale Konfiguration
// =====================================================================

// --- Firebase Realtime Database (NUR REST API, kein SDK) ---
export const FIREBASE = {
  apiKey: 'AIzaSyBZbh9UjXGbTTPIO_jewU41sTKYe4pHvNY',
  authDomain: 'unser-einkaufszettel.firebaseapp.com',
  projectId: 'unser-einkaufszettel',
  databaseURL:
    'https://unser-einkaufszettel-default-rtdb.europe-west1.firebasedatabase.app',
}

// --- Gemini API (Fragen + VERA-Kommentare) ---
// HINWEIS: Diesen Platzhalter nach dem Deployment durch den echten Key ersetzen.
export const GEMINI_API_KEY = '[GEMINI_API_KEY_PLACEHOLDER]'
export const GEMINI_MODEL = 'gemini-2.5-flash-preview-05-20'

// --- Google Auth (Google Identity Services, ohne Firebase SDK) ---
// Google OAuth Client-ID aus der Google Cloud Console (Web-Anwendung).
// Autorisierte JavaScript-Herkunft: https://bgnbbnpwkk-bit.github.io
// HINWEIS: Platzhalter nach dem Deployment ersetzen.
export const GOOGLE_CLIENT_ID = '[GOOGLE_CLIENT_ID_PLACEHOLDER]'

// --- Spieler-Identitäten (per E-Mail) ---
export const PLAYERS = {
  marc: {
    id: 'marc',
    email: 'marc.saenger1975@gmail.com',
    name: 'Marc',
    color: '#2563EB', // Blau
    emoji: '💙',
  },
  melli: {
    id: 'melli',
    email: 'melaniechabane1975@gmail.com',
    name: 'Melli',
    color: '#EC4899', // Pink
    emoji: '🩷',
  },
}

// Erlaubte E-Mail-Adressen → Spielerprofil
export const ALLOWED_EMAILS = {
  [PLAYERS.marc.email]: PLAYERS.marc,
  [PLAYERS.melli.email]: PLAYERS.melli,
}

export function resolvePlayer(email) {
  if (!email) return null
  return ALLOWED_EMAILS[email.toLowerCase().trim()] || null
}

export const QUESTIONS_PER_ROUND = 10
export const POLL_INTERVAL_MS = 800
