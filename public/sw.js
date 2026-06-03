// VERSUS Service Worker – Auto-Update Strategie
// Erhöhe die Versionsnummer bei jedem Release. Da skipWaiting() + clients.claim()
// genutzt werden, aktiviert sich ein neuer Service Worker sofort und übernimmt
// alle offenen Tabs – kein manuelles Neuinstallieren nötig.
const CACHE_NAME = 'versus-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) =>
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  )
);

// Network-first: immer frische Inhalte holen (Auto-Update), Cache nur als Offline-Fallback.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  // Nur GET-Requests cachen; APIs (Firebase / Gemini / Google) nie cachen.
  if (req.method !== 'GET') return;

  e.respondWith(
    fetch(req)
      .then((res) => {
        // Erfolgreiche, gleichherkunftsfähige Antworten in den Cache legen.
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});
