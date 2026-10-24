const CACHE_NAME = "thunderyellow-svs-lab-v2-34";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(key => key.startsWith("thunderyellow-svs-lab-") && key !== CACHE_NAME)
      .map(key => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  const isPokemonSprite = url.origin === "https://raw.githubusercontent.com" &&
    /^\/PokeAPI\/sprites\/master\/sprites\/pokemon\/versions\/generation-iii\/firered-leafgreen\/(?:shiny\/)?[0-9]+\.png$/.test(url.pathname);
  if (isPokemonSprite) {
    event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (response.ok || response.type === "opaque") {
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone())).catch(() => {});
      }
      return response;
    })));
    return;
  }
  if (url.origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok) {
      const cloned = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
    }
    return response;
  }).catch(() => caches.match(event.request).then(cached => cached || caches.match("./index.html"))));
});
