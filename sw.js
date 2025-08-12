self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open('pulse-v436-full3').then(c=>c.addAll(['./','./index.html','./style.css','./script.js','./manifest.webmanifest','./icon-192.png','./icon-512.png','./clownfish.jpg','./parrotfish.jpg','./butterflyfish.jpg','./angelfish.jpg'])))});
self.addEventListener('activate',e=>self.clients.claim());
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))))
