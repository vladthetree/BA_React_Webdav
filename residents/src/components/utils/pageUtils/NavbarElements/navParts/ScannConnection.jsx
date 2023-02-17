import { useEffect, useState } from "react";
import { addToIndexDbStore } from "../../../db/storageObjectMethodes.jsx";
import React from "react";
// import { writeValueBLEmessage } from "../../../bluetooth/utils/writeBLEmessage.js";
import { writeMessage } from "../../../bluetooth/utils/writeBLEmessage.js";
import { command } from "../../../bluetooth/utils/commands.js";
import { getObjectStorageIndex } from "../../../db/storageObjectMethodes.jsx";

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

export function ScannConnection() {

	const handleClick2 = async () => {
		bluetoothDevice = null;
		try {
			console.log("Requesting any Bluetooth Device...");
			bluetoothDevice = await navigator.bluetooth.requestDevice({
				filters: filters,
				pairing: true,
			});
			bluetoothDevice.addEventListener(
				"gattserverdisconnected",
				onDisconnected,
			);
			connect();
		} catch (error) {
			console.log("Argh! " + error);
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
		connect();
	}

	async function connect() {
		exponentialBackoff(
			3 /* max retries */,
			2 /* seconds delay */,
			async function toTry() {
				time("Connecting to Bluetooth Device... ");
				const server = await bluetoothDevice.gatt.connect();
        console.log(" GOT SERVER")
        console.log(server)
        const service = await server.getPrimaryService(NORDIC_SERVICE);

				tx = await service.getCharacteristic(NORDIC_TX);
				rx = await service.getCharacteristic(NORDIC_RX)
        await rx.startNotifications();
        tx.addEventListener('connetedButtonClick', connetedButtonClick);

       
			},
			function success() {
				console.log("> Bluetooth Device connected. Try disconnect it now.");
			},
			function fail() {
				time("Failed to reconnect.");
			},
		);
	}

	const connetedButtonClick = async () => {
		if (!tx) {
			console.log("Error: Not connected to Bluetooth device");
			return;
		}
		try {
      await writeMessage(command.connected, tx);
			console.log("Sent 'Connected' message");
		} catch (error) {
			console.log("Error writing value: " + error);
		}
	};

	return (
		<div>
			{/* <button id="search-button" onClick={handleClick1}>
				ScannConnection
			</button> */}
			<button id="search-button" onClick={handleClick2}>
				ScannConnection2
			</button>
			<button id="search-button" onClick={connetedButtonClick}>
				Connect
			</button>
		</div>
	);
}
