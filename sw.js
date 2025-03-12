const CACHE_NAME = 'schaeiner-cache-v6'; // Neue Versionsnummer
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/admin.html',
    '/admin.js',
    '/assets/icon.png'
];

// Cache beim Installieren (data.json wird nicht gecacht)
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

// Fetch-Event: data.json immer vom Netzwerk holen
self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);

    // data.json immer vom Netzwerk holen, nicht cachen
    if (requestUrl.pathname.endsWith('data.json')) {
        event.respondWith(
            fetch(event.request)
                .catch(() => caches.match(event.request)) // Fallback auf Cache bei Offline
        );
        return;
    }

    // Für alle anderen Ressourcen: Netzwerk zuerst, dann Cache
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

// Nachricht vom Client empfangen
self.addEventListener('message', event => {
    if (event.data.type === 'CHECK_UPDATE') {
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({ type: 'UPDATE_AVAILABLE' });
            });
        });
    }
});