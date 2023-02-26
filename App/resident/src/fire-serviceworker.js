import { precacheAndRoute } from 'workbox-precaching';
import { StaleWhileRevalidate } from 'workbox-strategies';
//importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
import { createClient } from 'webdav';

console.log('----------------Service worker installed.----------------');

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', event => {
  console.log('Service Worker installed');

  // skip waiting and activate the Service Worker immediately
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker activated');
});

// self.addEventListener('fetch', event => {
//   console.log('Fetch event:', event.request.url);

//   event.respondWith(
//     fetch(event.request)
//       .then(response => {
//         console.log('Fetch succeeded:', event.request.url);
//         return response;
//       })
//       .catch(() => {
//         console.log('Fetch failed, trying cache:', event.request.url);
//         return caches.match(event.request);
//       }),
//   );
// });

self.addEventListener('sync', event => {
  console.log('Sync event:', event.tag);

  if (event.tag === 'my-background-sync') {
    event.waitUntil(
      // do some background synchronization
      console.log('Performing background sync'),
    );
  }
});
