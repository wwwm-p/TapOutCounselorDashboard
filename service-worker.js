const CACHE_NAME = "counselor-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/counselor-manifest.json",
  "/icons/icon-192-counselor.png",
  "/icons/icon-512-counselor.png"
];

self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS_TO_CACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", e=>{
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key!==CACHE_NAME? caches.delete(key):null))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e=>{
  e.respondWith(caches.match(e.request).then(res=>res || fetch(e.request)));
});
