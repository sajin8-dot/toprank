const CACHE_NAME = 'toprank-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icon.svg'
];

// Install Service Worker and cache core files
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch assets
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Clone response and cache it
        const resClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          // Cache only HTTP(S) requests
          if (e.request.url.startsWith('http')) {
            cache.put(e.request, resClone);
          }
        });
        return response;
      })
      .catch(() => {
        // If network fails, serve from cache
        return caches.match(e.request);
      })
  );
});
