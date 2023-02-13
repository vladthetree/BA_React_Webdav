import { precacheAndRoute } from 'workbox-precaching';
import { StaleWhileRevalidate } from 'workbox-strategies';
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

precacheAndRoute(self.__WB_MANIFEST);


const networkFirst = new StaleWhileRevalidate({
    cacheName: 'listContent-cache',
});

workbox.routing.registerRoute(
  /http:\/\/localhost:8080\/proxy\/listContent/,
  networkFirst
);
