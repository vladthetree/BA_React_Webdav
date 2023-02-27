import { precacheAndRoute } from 'workbox-precaching';
import SyncListdir from './components/sync/SyncListdir.jsx';

console.log('----------------Service worker installed.----------------');

precacheAndRoute(self.__WB_MANIFEST);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./fire-serviceworker.js')
      .then(registration => {
        console.log('Service worker registered successfully');
      })
      .catch(error => {
        console.log('Service worker registration failed:', error);
      });
  });
}

self.addEventListener('install', event => {
  console.log('Service Worker installed');

  // skip waiting and activate the Service Worker immediately
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker activated');
});

self.addEventListener('sync', event => {
  console.log('Sync event:', event.tag);

  if (event.tag === 'my-background-sync') {
    event.waitUntil(SyncListdir());
  }
});

if ('serviceWorker' in navigator && 'SyncManager' in window) {
  navigator.serviceWorker.ready
    .then(registration => {
      return registration.sync.register('my-background-sync');
    })
    .then(() => {
      console.log('Sync event registered');
    })
    .catch(error => {
      console.log('Sync event registration failed:', error);
    });
}
