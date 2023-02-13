import { precacheAndRoute } from 'workbox-precaching';
import { StaleWhileRevalidate } from 'workbox-strategies';
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

precacheAndRoute(self.__WB_MANIFEST);

