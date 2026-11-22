/* Service Worker بسيط لبوابة متطوعي مصر الخير: بيخلّي البوابة تتثبت كتطبيق،
   ولو النت قطع بيفتح آخر نسخة من الصفحة الرئيسية. مفيش أي بيانات متطوعين بتتخزن هنا
   (طلبات جوجل وبيانات الدخول مش بتعدّي عليه). */
var CACHE = 'mek-shell-v1';
var SHELL = ['/', '/css/style.css', '/js/main.js', '/data/site-config.js', '/assets/mek-logo.jpg', '/assets/icon-192.webp'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).catch(function () {}).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || r.mode !== 'navigate' || new URL(r.url).origin !== self.location.origin) return;
  e.respondWith(fetch(r).then(function (res) {
    if (res.ok && new URL(r.url).pathname === '/') { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put('/', copy); }); }
    return res;
  }).catch(function () { return caches.match('/').then(function (m) { return m || Response.error(); }); }));
});