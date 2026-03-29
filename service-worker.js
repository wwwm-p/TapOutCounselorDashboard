/**
 * service-worker.js
 *
 * Offline-capable PWA service worker:
 * - Precache app shell + offline fallback
 * - Navigation: network-first with cached shell fallback
 * - Assets: stale-while-revalidate
 *
 * Safety: skips caching JSON/API-like requests by default.
 */

const SW_VERSION = "2026-03-29-1";

const CACHE_PREFIX = "sis-counselor";
const PRECACHE_NAME = `${CACHE_PREFIX}-precache-${SW_VERSION}`;
const RUNTIME_NAME = `${CACHE_PREFIX}-runtime-${SW_VERSION}`;

const OFFLINE_URL = "offline.html";
const APP_SHELL_URL = "index.html";

const PRECACHE_URLS = [
  OFFLINE_URL,
  APP_SHELL_URL,
  "pwa.js",
  "counselor-manifest.json",
  "icons/icon-192-counselor.png",
  "icons/icon-512-counselor.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PRECACHE_NAME);
      await cache.addAll(PRECACHE_URLS.map((url) => new Request(url, { cache: "reload" })));
    })()
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith(`${CACHE_PREFIX}-`) && key !== PRECACHE_NAME && key !== RUNTIME_NAME)
          .map((key) => caches.delete(key))
      );

      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }

      await self.clients.claim();
    })()
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

function isSameOrigin(requestUrl) {
  return new URL(requestUrl).origin === self.location.origin;
}

function looksLikeAsset(pathname) {
  const last = pathname.split("/").pop() || "";
  return last.includes(".");
}

function isJsonLike(request) {
  const accept = request.headers.get("Accept") || "";
  return accept.includes("application/json");
}

function shouldBypassCache(request, url) {
  if (request.headers.has("Authorization")) return true;
  if (url.pathname.startsWith("/api/")) return true;
  if (url.pathname.startsWith("/auth/")) return true;
  if (isJsonLike(request)) return true;
  return false;
}

function getPrecache() {
  return caches.open(PRECACHE_NAME);
}

function getRuntimeCache() {
  return caches.open(RUNTIME_NAME);
}

async function matchFromCurrentCaches(request) {
  const runtime = await getRuntimeCache();
  const runtimeMatch = await runtime.match(request);
  if (runtimeMatch) return runtimeMatch;

  const precache = await getPrecache();
  return precache.match(request);
}

async function handleNavigationRequest(event) {
  const request = event.request;
  const url = new URL(request.url);

  try {
    const preloadResponse = await event.preloadResponse;
    if (preloadResponse) return preloadResponse;

    const response = await fetch(request);

    if (response.status === 404 && !looksLikeAsset(url.pathname)) {
      const shell = await matchFromCurrentCaches(APP_SHELL_URL);
      if (shell) return shell;
    }

    if (response && response.ok) {
      const cache = await getRuntimeCache();
      cache.put(request, response.clone());
    }

    return response;
  } catch (_) {
    const cached = await matchFromCurrentCaches(request);
    if (cached) return cached;

    const shell = await matchFromCurrentCaches(APP_SHELL_URL);
    if (shell) return shell;

    const offline = await matchFromCurrentCaches(OFFLINE_URL);
    return offline || new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } });
  }
}

async function staleWhileRevalidate(event) {
  const request = event.request;
  const cached = await matchFromCurrentCaches(request);

  const fetchPromise = fetch(request)
    .then(async (response) => {
      if (response && response.ok && response.type === "basic") {
        const cache = await getRuntimeCache();
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    event.waitUntil(fetchPromise);
    return cached;
  }

  const networkResponse = await fetchPromise;
  if (networkResponse) return networkResponse;

  if (request.destination === "document") {
    const offline = await matchFromCurrentCaches(OFFLINE_URL);
    return offline || new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } });
  }

  return new Response("", { status: 504 });
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  if (!isSameOrigin(request.url)) return;

  const url = new URL(request.url);

  if (shouldBypassCache(request, url)) {
    event.respondWith(fetch(request));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(handleNavigationRequest(event));
    return;
  }

  const dest = request.destination;
  if (dest === "style" || dest === "script" || dest === "image" || dest === "font" || dest === "manifest") {
    event.respondWith(staleWhileRevalidate(event));
    return;
  }

  event.respondWith(staleWhileRevalidate(event));
});
