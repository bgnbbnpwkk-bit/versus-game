// =====================================================================
// Google Auth über Google Identity Services (GIS) – ohne Firebase SDK.
// Liefert ein ID-Token (JWT), aus dem wir die E-Mail auslesen und gegen
// die erlaubten Accounts prüfen.
// =====================================================================
import { GOOGLE_CLIENT_ID } from './config.js'

const STORAGE_KEY = 'versus_user'

export function isGoogleConfigured() {
  return GOOGLE_CLIENT_ID && !GOOGLE_CLIENT_ID.includes('PLACEHOLDER')
}

// JWT (ID-Token) dekodieren – nur der Payload, ohne Signaturprüfung.
function decodeJwt(token) {
  try {
    const payload = token.split('.')[1]
    const json = decodeURIComponent(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

// Initialisiert GIS und rendert den Google-Button in das gegebene Element.
// onCredential(email) wird mit der eingeloggten E-Mail aufgerufen.
export function renderGoogleButton(targetEl, onCredential) {
  if (!isGoogleConfigured()) return false
  const google = window.google
  if (!google || !google.accounts || !google.accounts.id) return false

  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: (response) => {
      const payload = decodeJwt(response.credential)
      onCredential(payload?.email || null)
    },
  })
  google.accounts.id.renderButton(targetEl, {
    theme: 'outline',
    size: 'large',
    type: 'standard',
    shape: 'pill',
    text: 'signin_with',
    locale: 'de',
    width: 280,
  })
  return true
}

export function saveSession(email) {
  try {
    localStorage.setItem(STORAGE_KEY, email)
  } catch {
    /* ignore */
  }
}

export function loadSession() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
  const google = window.google
  if (google?.accounts?.id) google.accounts.id.disableAutoSelect()
}
