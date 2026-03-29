const CACHE_NAME = 'counselor-dashboard-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/counselor-manifest.json',
  '/icons/icon-192-counselor.png',
  '/icons/icon-512-counselor.png'
  // add JS/CSS files here if you separate them
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
