/* eslint-disable no-restricted-globals */
import { clientsClaim } from "workbox-core";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkOnly } from "workbox-strategies";

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(({ request, url }) => {
  if (request.mode !== "navigate") {
    return false;
  }
  if (url.pathname.startsWith("/_")) {
    return false;
  }
  if (url.pathname.match(fileExtensionRegexp)) {
    return false;
  }
  return true;
}, createHandlerBoundToURL(process.env.PUBLIC_URL + "/index.html"));
registerRoute(
  ({ url }) =>
    url.href.startsWith("https://localhost:8443/remote.php/dav/files/test/"),
  new NetworkOnly(e => console.log(e))
);

self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
