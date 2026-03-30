const CACHE_NAME = "counselor-cache-v6";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/counselor-manifest.json",
  "/icons/icon-192-counselor.png",
  "/icons/icon-512-counselor.png"
];

// Install SW and cache assets
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .catch(err => console.error("Cache install failed", err))
  );
  self.skipWaiting();
});

// Activate SW & clean old caches
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // Take control immediately
});

// Fetch handler
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
