const CACHE_NAME = 'schaeiner-cache-v4'; // Neue Versionsnummer
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/admin.html',
    '/admin.js',
    '/manifest.json',
    '/data.json',
    '/assets/icon.png'
];

// Cache beim Installieren
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting()) // Sofortige Aktivierung
    );
});

// Alte Caches bereinigen und Kontrolle übernehmen
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        }).then(() => self.clients.claim()) // Sofortige Kontrolle
    );
});

// Fetch-Event: Immer neue Daten vom Netzwerk holen, falls verfügbar
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return fetch(event.request).then(networkResponse => {
                    if (networkResponse && networkResponse.status === 200) {
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, networkResponse.clone());
                        });
                    }
                    return networkResponse || response;
                }).catch(() => response); // Fallback auf Cache bei Offline
            })
    );
});

// Nachricht an Clients senden, um Aktualisierung zu erzwingen
self.addEventListener('message', event => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});