import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import SyncListdir from "./components/sync/SyncListdir.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./ba-service-worker.js")
      .then((registration) => {
        console.log("SW registered: ", registration);

        registration.addEventListener("updatefound", () => {
          console.log("New service worker found.");
          const newWorker = registration.installing;
          newWorker.addEventListener("install", (event) => {
          });
          newWorker.skipWaiting();
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
