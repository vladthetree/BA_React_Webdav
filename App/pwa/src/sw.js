const cacheName = 'site-cache-v1';
const assetsToCache = [
  './',
  './index.html',
  './manifest.json',
  './pwa-192x192.png',
  './pwa-512x512.png',
  './bundle.js',
  './audio/sampleAudio.mp3',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(assetsToCache);
    }),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
});
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request)
        .then((response) => {
          return response;
        })
        .catch(() => {
          console.log('Some error response : ', response);
          console.log(
            '#-- > Serviceworker  : No respond from server, ill take over! < --#',
          );
          const customResponse = {
            response: 'serverOff',
          };
          const headers = { 'Content-Type': 'application/json' };
          const body = JSON.stringify(customResponse);
          return new Response(body, { headers });
        });
    }),
  );
});
