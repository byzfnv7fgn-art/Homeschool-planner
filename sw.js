/* Homeschool Planner — offline cache for the hosted copy (GitHub Pages).
   Strategy: serve from cache instantly, refresh the cache from the network in
   the background. A new app version is picked up on the following launch.
   This file caches ONLY the app shell — never your planner data. */
const CACHE = "hsp-app-v1";
self.addEventListener("install", e => { self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(clients.claim()); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(e.request);
    const refresh = fetch(e.request).then(res => {
      if (res && res.ok) cache.put(e.request, res.clone());
      return res;
    }).catch(() => cached);
    return cached || refresh;
  })());
});
