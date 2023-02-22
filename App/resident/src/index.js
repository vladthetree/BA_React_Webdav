import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import SyncListdir from "./components/sync/SyncListdir.jsx";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


//let wakeLock = null;
// (async function () {
//   try {
//     wakeLock = await navigator.wakeLock.request();
//     wakeLock.addEventListener("release", () => {
//       console.log("Screen Wake Lock released:", wakeLock.released);
//     });
//     console.log("Screen Wake Lock released:", wakeLock.released);
//   } catch (err) {
//     console.error(`${err.name}, ${err.message}`);
//   }
//   window.setTimeout(() => {
//     wakeLock.release();
//     wakeLock = null;
//   }, 5000);
// })();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./ba-service-worker.js")
      .then((registration) => {
        console.log("SW registered: ", registration);

        registration.addEventListener("updatefound", () => {
          console.log("New service worker found.");
          const newWorker = registration.installing;
          newWorker.addEventListener("install", (event) => {});

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "activated") {
              console.log("New service sworker  activated.");
            }
          });
        });
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

// Trigger the sync event
if ("serviceWorker" in navigator && "SyncManager" in window) {
  navigator.serviceWorker.ready.then((registration) => {
    registration.sync.register("syncMe").then(() => {
      console.log("Sync event registered");
      SyncListdir();
    });
  });
}
