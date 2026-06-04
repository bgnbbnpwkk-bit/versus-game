// VERSUS Service Worker – Auto-Update, ohne je eine alte Version zu servieren.
//
// Wichtig: Die HTML-Seite wird NIE aus dem Cache geliefert (nur Netzwerk),
// damit nach dem "Wegswipen" niemals eine ältere Version geladen wird.
// Da die App ohnehin Netzwerk braucht (Firebase + Gemini), ist Offline-
// Caching der Seite überflüssig. Nur hash-benannte, unveränderliche Assets
// (JS/CSS/Icons/Fonts) werden gecacht – die können nie "veralten".
const CACHE_NAME = 'versus-v1.1.0';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) =>
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
);

self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // HTML / Navigationen: immer frisch aus dem Netz (kein Cache-Fallback).
  if (req.mode === 'navigate' || req.destination === 'document') {
    e.respondWith(fetch(req));
    return;
  }

  const url = new URL(req.url);
  // Nur gleich-Herkunft-Assets cachen (nicht Firebase/Gemini/Google).
  if (url.origin !== self.location.origin) return;

  // Unveränderliche Assets: cache-first, sonst Netzwerk (und cachen).
  e.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res && res.status === 200) cache.put(req, res.clone());
            return res;
          })
      )
    )
  );
});
