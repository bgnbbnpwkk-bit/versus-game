// =====================================================================
// Google Auth über das Firebase Auth SDK (Google Sign-In).
// Firebase verwaltet die OAuth-Konfiguration intern – keine separate
// Google Client-ID nötig. Das Realtime-DB-Zugriff bleibt weiterhin REST.
// =====================================================================
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signOut,
} from 'firebase/auth'
import { FIREBASE } from './config.js'

const app = initializeApp({
  apiKey: FIREBASE.apiKey,
  authDomain: FIREBASE.authDomain,
  databaseURL: FIREBASE.databaseURL,
  projectId: FIREBASE.projectId,
})

const auth = getAuth(app)
auth.useDeviceLanguage()

const provider = new GoogleAuthProvider()
// Immer den Account-Auswahl-Dialog zeigen (praktisch beim Wechsel Marc/Melli).
provider.setCustomParameters({ prompt: 'select_account' })

// Session bleibt auf dem Gerät erhalten.
setPersistence(auth, browserLocalPersistence).catch(() => {})

export function signInWithGoogle() {
  return signInWithPopup(auth, provider)
}

export function signOutUser() {
  return signOut(auth)
}

// Ruft callback(email) bei jeder Auth-Änderung auf (email = null wenn ausgeloggt).
export function onAuthEmail(callback) {
  return onAuthStateChanged(auth, (u) => callback(u ? u.email : null))
}

// Liefert das aktuelle Firebase-ID-Token (für authentifizierte Realtime-DB-
// REST-Aufrufe via ?auth=<token>). Wird bei Bedarf automatisch erneuert.
export async function getIdToken() {
  const u = auth.currentUser
  if (!u) return null
  try {
    return await u.getIdToken()
  } catch {
    return null
  }
}
