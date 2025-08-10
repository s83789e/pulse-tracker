self.addEventListener('install', e=>{
  self.skipWaiting();
  e.waitUntil(caches.open('pulse-cache-v4').then(cache=> cache.addAll([
    './','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'
  ])));
});
self.addEventListener('activate', e=> self.clients.claim());
self.addEventListener('fetch', e=>{
  e.respondWith(caches.match(e.request).then(res=> res || fetch(e.request)));
});