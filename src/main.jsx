import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// --- Service Worker registrieren (robustes Auto-Update, iOS-tauglich) ---
if ('serviceWorker' in navigator) {
  // Wenn der kontrollierende SW wechselt, genau einmal neu laden.
  let refreshing = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return
    refreshing = true
    window.location.reload()
  })

  window.addEventListener('load', () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`
    // updateViaCache:'none' => das sw.js-Skript wird NIE aus dem HTTP-Cache
    // geladen, sodass update() neue Versionen zuverlässig erkennt.
    navigator.serviceWorker
      .register(swUrl, { updateViaCache: 'none' })
      .then((registration) => {
        const checkForUpdate = () => registration.update().catch(() => {})

        // Neuen SW sofort aktivieren lassen.
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (!newWorker) return
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              newWorker.postMessage?.({ type: 'SKIP_WAITING' })
              // controllerchange (oben) löst dann den Reload aus.
            }
          })
        })

        // Update prüfen: regelmäßig + immer wenn die App wieder sichtbar wird
        // (iOS startet nach dem "Wegswipen" oft keine echte Navigation).
        checkForUpdate()
        setInterval(checkForUpdate, 30 * 1000)
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') checkForUpdate()
        })
        window.addEventListener('pageshow', checkForUpdate)
        window.addEventListener('focus', checkForUpdate)
      })
      .catch((err) => console.warn('Service Worker Registrierung fehlgeschlagen:', err))
  })
}
