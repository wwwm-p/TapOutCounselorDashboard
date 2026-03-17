// PWA: Service worker for Counselor Dashboard
const CACHE_NAME = "counselor-dashboard-v1";
const ASSETS_TO_CACHE = [
  "/",                 // root
  "/index.html",       // main HTML
  "/style.css",        // add your CSS file if separate
  "/manifest.json",    // manifest
  "/service-worker.js" // service worker itself
];

// Install event – cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate event – remove old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch event – cache-first for static assets, network-first for API calls
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const isApi = request.url.includes("/api/");

  if (isApi) {
    // Network-first for API calls (mocked or real backend)
    event.respondWith(
      fetch(request)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, resClone));
          return res;
        })
        .catch(() => caches.match(request))
    );
  } else {
    // Cache-first for everything else
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
  }
});
