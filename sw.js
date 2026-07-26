// Service worker — кэширует оболочку приложения, чтобы работало офлайн.
// Версию бампай при изменении файлов, чтобы обновился кэш.
var CACHE = "ration-v1";
var SHELL = [
  ".", "index.html", "styles.css", "app.js", "config.js",
  "manifest.webmanifest", "icon.svg"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (k) { return k === CACHE ? null : caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  // Запросы к Supabase и CDN всегда идут в сеть (не кэшируем данные/аутентификацию).
  if (url.origin !== self.location.origin) return;
  // App shell — cache-first; остальное — network-first с откатом в кэш.
  e.respondWith(
    caches.match(req).then(function (hit) {
      var net = fetch(req).then(function (res) {
        if (res && res.status === 200) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
        return res;
      }).catch(function () { return hit; });
      return hit || net;
    })
  );
});
