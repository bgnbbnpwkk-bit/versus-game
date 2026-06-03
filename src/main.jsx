import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// --- Service Worker registrieren (Auto-Update) ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        // Bei gefundenem Update den neuen SW sofort übernehmen lassen.
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (!newWorker) return
          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              // Ein neuer SW ist bereit – Seite neu laden, um Auto-Update zu vollziehen.
              window.location.reload()
            }
          })
        })
        // Regelmäßig nach Updates suchen.
        setInterval(() => registration.update(), 60 * 1000)
      })
      .catch((err) => console.warn('Service Worker Registrierung fehlgeschlagen:', err))

    // Wenn der kontrollierende SW wechselt, einmalig neu laden.
    let refreshing = false
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return
      refreshing = true
      window.location.reload()
    })
  })
}
