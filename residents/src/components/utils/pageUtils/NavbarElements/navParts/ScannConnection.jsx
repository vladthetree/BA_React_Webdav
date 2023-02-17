import React, { useEffect } from "react";
// import { writeValueBLEmessage } from "../../../bluetooth/utils/writeBLEmessage.js";
import { writeMessage } from "../../../bluetooth/utils/writeBLEmessage.js";

const filters = [
	{
		name: "Bangle.js 6afc",
	},
];

var NORDIC_SERVICE = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
var NORDIC_TX = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
var NORDIC_RX = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
let rx;
let tx;
var bluetoothDevice;

let message = "";

export function ScannConnection({ newVideosAmount, bleStatus, displayBle }) {
	console.log(newVideosAmount);
	message = `newVideos(${newVideosAmount})\n;`;

	console.log("NEW MESSAGE WOULD HAVE BEEN");
	console.log(message);
	const handleClick2 = async () => {
		bluetoothDevice = null;
		try {
			console.log("Requesting any Bluetooth Device...");
			bluetoothDevice = await navigator.bluetooth.requestDevice({
				filters: filters,
			});
			bluetoothDevice.addEventListener(
				"gattserverdisconnected",
				onDisconnected,
			);
			await connectBLE(displayBle, bleStatus);
		} catch (error) {
			console.log(error);
		}

		document.addEventListener("newVideo", handleNewVideo);
	};

	useEffect(() => {
		if (message !== "") {
			const event = new CustomEvent("newVideo", {
				detail: { videoAmount: newVideosAmount, bleStatus: bleStatus },
			});
			document.dispatchEvent(event);
		}
	}, [message]);

	async function connectBLE(handleBleStatus) {
		exponentialBackoff(
			3 /* max retries */,
			2 /* seconds delay */,
			async function toTry() {
				time("Connecting to Bluetooth Device... ");
				const server = await bluetoothDevice.gatt.connect();
				const service = await server.getPrimaryService(NORDIC_SERVICE);

				tx = await service.getCharacteristic(NORDIC_TX);
				rx = await service.getCharacteristic(NORDIC_RX);
				rx.startNotifications();
			},
			function success() {
				handleBleStatus(true);
				console.log("> Bluetooth Device connected. Try disconnect it now.");
			},
			function fail() {
				time("Failed to reconnect.");
			},
		);
	}

	const handleNewVideo = async (event) => {
		console.log("NEW VIDEO TRIGGER");
		console.log(event);
		let videoAmount = event.detail.videoAmount;
		let blestatus = event.detail.bleStatus;
		console.log("handleNewVideo is triggered");
		if (blestatus) {
			if (!tx) {
				console.log("Error: Not connected to Bluetooth device");
				return;
			}
			const message = `newVideos(${videoAmount});\n`;
			try {
				await writeMessage(message, tx);
			} catch (error) {
				console.log(`Error writing value: ${error}`);
			}
		} else {
			console.log(" SOME ERROR ");
			console.log(bleStatus);
		}
	};

	async function exponentialBackoff(max, delay, toTry, success, fail) {
		try {
			const result = await toTry();
			success(result);
		} catch (error) {
			if (max === 0) {
				return fail();
			}
			time("Retrying in " + delay + "s... (" + max + " tries left)");
			setTimeout(function () {
				exponentialBackoff(--max, delay * 2, toTry, success, fail);
			}, delay * 1000);
		}
	}

	function time(text) {
		console.log("[" + new Date().toJSON().substr(11, 8) + "] " + text);
	}

	function onDisconnected() {
		console.log("> Bluetooth Device disconnected");
		connectBLE();
	}

	return (
		<div>
			<button id="search-button" onClick={handleClick2}>
				ScannConnection2
			</button>
		</div>
	);
}
