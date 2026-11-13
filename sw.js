/* PRO-DATE — cache hors ligne (aucune donnée personnelle dans ce cache). */
const CACHE_NAME = 'echeances-pro-v1.3.0';
const APP_ASSETS = [
  './','index.html','styles.css','app.js','manifest.webmanifest',
  'icon-192.png','icon-512.png','apple-touch-icon.png',
  'logo-gendarmerie.png','logo-police.png','logo-dgac.png','hero.jpg'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok) { const cloned = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned)); }
    return response;
  }).catch(() => caches.match(event.request).then(cached => cached || (event.request.mode === 'navigate' ? caches.match('./') : Response.error()))));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(self.clients.matchAll({type:'window', includeUncontrolled:true}).then(clients => clients.length ? clients[0].focus() : self.clients.openWindow('./')));
});
