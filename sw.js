// Service worker — кэширует оболочку приложения, чтобы работало офлайн.
// Стратегия: СНАЧАЛА СЕТЬ, кэш — запасной вариант для офлайна. Так правки в
// config.js/app.js/styles.css подхватываются сразу при онлайне, а не залипают.
// Версию бампай при изменении файлов, чтобы гарантированно сбросить старый кэш.
var CACHE = "ration-v7";
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
  // Network-first: свежая версия важнее; кэш — откат для офлайна.
  e.respondWith(
    fetch(req).then(function (res) {
      if (res && res.status === 200) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
      return res;
    }).catch(function () {
      return caches.match(req).then(function (hit) { return hit || caches.match("index.html"); });
    })
  );
});
