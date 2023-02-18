import React, { useEffect, useState, useRef } from "react";
import { writeMessage } from "../../../bluetooth/utils/writeBLEmessage.js";

export function ScannConnection({
	newVideosAmount,
	currentBLEstatus,
	handleDisplayBLEconnection,
}) {
	const [filters, setFilters] = useState([{ name: "Bangle.js 6afc" }]);
	var NORDIC_SERVICE = useRef("6e400001-b5a3-f393-e0a9-e50e24dcca9e");
	var NORDIC_TX = useRef("6e400002-b5a3-f393-e0a9-e50e24dcca9e");
	var NORDIC_RX = useRef("6e400003-b5a3-f393-e0a9-e50e24dcca9e");
	const server = useRef(null);
	const service = useRef(null);
	const rxRef = useRef(null);
	const txRef = useRef(null);
	const bluetoothDeviceRef = useRef(null);
	const latestNewVideoMessageRef = useRef("");
	const MAX_TRYS = 2;
	const MAX_DELAY = 3;
	let isConnected = false;

	let newVideoMessage = `newVideos(${newVideosAmount})\n;`;

	const handleClick2 = async () => {
		bluetoothDeviceRef.current = null;
		try {
			console.log("Requesting any Bluetooth Device...");
			bluetoothDeviceRef.current = await navigator.bluetooth.requestDevice({
				filters: filters,
			});
			bluetoothDeviceRef.current.addEventListener(
				"gattserverdisconnected",
				onDisconnected,
			);
			await connectBLE(handleDisplayBLEconnection);
		} catch (error) {
			console.log(error);
		}

		document.addEventListener("newVideo", handleNewVideo);
	};

	useEffect(() => {
		if (newVideoMessage !== "") {
			const event = new CustomEvent("newVideo", {
				detail: { videoAmount: newVideosAmount, bleStatus: currentBLEstatus },
			});
			document.dispatchEvent(event);
		}
	}, [newVideoMessage]);

	async function connectBLE(handleDisplayBLEconnection) {
		exponentialBackoff(
			MAX_TRYS,
			MAX_DELAY,
			async function toTry() {
				time("Connecting to Bluetooth Device... ");
				server.current = await bluetoothDeviceRef.current.gatt.connect();
				service.current = await server.current.getPrimaryService(
					NORDIC_SERVICE.current,
				);
				txRef.current = await service.current.getCharacteristic(
					NORDIC_TX.current,
				);
				rxRef.current = await service.current.getCharacteristic(
					NORDIC_RX.current,
				);
				rxRef.current.startNotifications();
			},
			async function success() {
				await writeMessage("connected();\n", txRef.current);
				console.log("Bluetooth Device is connected.");
				isConnected = true;
				handleDisplayBLEconnection(true);
			},
			function fail() {
				time("Failed to reconnect.");
			},
		);
	}

	const handleNewVideo = async (event) => {
		let videoAmount = event.detail.videoAmount;
		const message = `newVideos(${videoAmount});\n`;
		latestNewVideoMessageRef.current = message;
		while (!isConnected) {
			await new Promise((resolve) => setTimeout(resolve, 10000));
		}

		if (videoAmount > 0) {
			try {
				await writeMessage(latestNewVideoMessageRef.current, txRef.current);
			} catch (error) {
				console.log(`Error writing value: ${error}`);
			}
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
		console.log("Bluetooth Device disconnected");
		isConnected = false;
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
