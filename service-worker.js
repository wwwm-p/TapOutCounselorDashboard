// PWA: Service worker for counselor dashboard

const CACHE_NAME = "counselor-cache-v3";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./counselor-manifest.json",
  "./icons/icon-192-counselor.png",
  "./icons/icon-512-counselor.png"
];

const OPTIONAL_ASSETS = [
  "./page1.png",
  "./page2.png",
  "./page3.png"
];

// INSTALL
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(CORE_ASSETS);

      // Optional assets (won’t break install if missing)
      await Promise.allSettled(
        OPTIONAL_ASSETS.map((asset) => cache.add(asset))
      );
    })
  );

  self.skipWaiting();
});

// ACTIVATE (clean old caches)
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

// FETCH
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // PAGE NAVIGATION → network first
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) =>
            cache.put(event.request, copy)
          );
          return response;
        })
        .catch(() =>
          caches.match(event.request).then(
            (cached) => cached || caches.match("./index.html")
          )
        )
    );
    return;
  }

  // STATIC FILES → cache first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) =>
            cache.put(event.request, copy)
          );
          return response;
        })
        .catch(() => caches.match(event.request));
    })
  );
});
