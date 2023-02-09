import React,{useEffect} from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import SyncListdir from "./components/sync/SyncListdir.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);


if (navigator.presentation) {
	console.log('The Presentation API is supported in this environment.');
  } else {
	console.log('The Presentation API is not supported in this environment.');
  }


if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker
			.register("/service-worker.js")
			.then((registration) => {
				console.log("SW registered: ", registration);
			})
			.catch((registrationError) => {
				console.log("SW registration failed: ", registrationError);
			});
	});
}

  
  // Trigger the sync event
  if ("serviceWorker" in navigator && "SyncManager" in window) {
	navigator.serviceWorker.ready.then(registration => {
	  registration.sync.register("syncMe").then(() => {
		console.log("Sync event registered");
		SyncListdir();
		
	  });
	});
  }
