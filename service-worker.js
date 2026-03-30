const CACHE_NAME = "counselor-cache-v3";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./counselor-manifest.json",
  "./icons/icon-192-counselor.png",
  "./icons/icon-512-counselor.png"
];

// Install SW & cache files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(
        ASSETS_TO_CACHE.map(url =>
          cache.add(url).catch(err => {
            console.warn("Cache failed for:", url, err);
          })
        )
      )
    )
  );
  self.skipWaiting();
});

// Activate SW & clean old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch handler - cache first, then network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
