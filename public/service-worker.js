const CACHE_NAME = "counselor-cache-v7";
const ASSETS_TO_CACHE = [
  "/",                        // root HTML
  "/index.html",
  "/style.css",
  "/pwa.js",
  "/script.js",
  "/service-worker.js",
  "/counselor-manifest.json",
  "/icons/icon-192-counselor.png",
  "/icons/icon-512-counselor.png"
];

// Install SW and cache assets
self.addEventListener("install", event => {
  console.log("[SW] Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("[SW] Caching assets...");
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch(err => console.error("[SW] Cache install failed", err))
  );
  self.skipWaiting();
});

// Activate SW & clean old caches
self.addEventListener("activate", event => {
  console.log("[SW] Activating...");
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch handler (cache-first)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
