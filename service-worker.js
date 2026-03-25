const CACHE_NAME = 'counselor-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/counselor-manifest.json',
  '/service-worker.js',
  '/icons/icon-192-counselor.png',
  '/icons/icon-512-counselor.png'
];

self.addEventListener('install', (event) => {
  console.log('[SW] Installing and caching assets...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).catch(() => {
      if (event.request.mode === 'navigate') return caches.match('/index.html');
    }))
  );
});
