// AbleOS Africa Offline Core Service Worker
// Version: 1.2
// Purpose: Provide comprehensive offline resilience, high-speed static loading, and smart API fallback for low-connectivity regions.

const CACHE_NAME = "ableos-core-v2";
const OFFLINE_URL = "/offline.html";

// Static asset shell representing critical shell layout
const STANDBY_ASSETS = [
  "/",
  "/index.html",
  OFFLINE_URL
];

// Install Event: pre-cache the absolute core shell infrastructure
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Shell Cache Opened successfully.");
      return cache.addAll(STANDBY_ASSETS);
    })
  );
});

// Activate Event: clear old cache profiles to maintain system integrity
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((allKeys) => {
      return Promise.all(
        allKeys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Flushing stale cache legacy:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Interceptor: intelligently route requests under network strain and offline periods
self.addEventListener("fetch", (event) => {
  const reqUrl = new URL(event.request.url);

  // Skip caching non-GET requests (or handle them with custom offline registers if necessary)
  if (event.request.method !== "GET") {
    return;
  }

  // Handle local AI/API route requests with a graceful Network-First, Cache-Fallback policy
  if (reqUrl.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If successful, clone and put in a specialized API cache
          if (response.status === 200) {
            const resClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, resClone);
            });
          }
          return response;
        })
        .catch(() => {
          console.log("[Service Worker] Connectivity lapse. Matching cached fallback for API API:", reqUrl.pathname);
          // Return cached API response if available, or generate a structured JSON error response
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return new Response(
              JSON.stringify({
                success: false,
                offline: true,
                message: "AOS Africa Offline Protection: System running under offline/low-connectivity conditions.",
                timestamp: new Date().toISOString()
              }),
              {
                headers: { "Content-Type": "application/json" }
              }
            );
          });
        })
    );
    return;
  }

  // Standard Website UI Assets (JavaScript, Stylesheets, HTML pages, Fonts, Lucide icons)
  // Serve from Cache-First, then Network, updating cache dynamically for unmatched assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached hit instantly, while background-updating cache to stay fresh
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          })
          .catch(() => {
            /* Keep serving the cached version */
          });
        return cachedResponse;
      }

      // No match in cache, fetch from network and add to cache
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // Both cache and network failed. If requesting document, load fallback page
          if (event.request.headers.get("accept")?.includes("text/html")) {
            return caches.match(OFFLINE_URL);
          }
          return new Response("Offline Resource Unavailable", { status: 503, statusText: "Offline" });
        });
    })
  );
});
