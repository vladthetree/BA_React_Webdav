import { useEffect, useState } from "react";
import { addToIndexDbStore } from "../../../db/storageObjectMethodes";

const filters = [
  {
    name: "Bangle.js 6afc"
  }
];
const OBJECT_STORE_USERDATA = "userData";
const OBJECT_STORE_USERDATA_OBJECTSTORAGE = "customer";
const NORDIC_SERVICE = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const NORDIC_TX = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const NORDIC_RX = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
let device;
let rx;
let tx;
let connectionLost = false;
let counter = 0;

export function ScannConnection() {
  const [BLEserver, setBLEserver] = useState([]);
  const [Device, setDevice] = useState([]);
  const handleClick = async () => {
    console.log("Searching for device...");
    try {
      device = await navigator.bluetooth.requestDevice({
        filters: filters,
        optionalServices: [NORDIC_SERVICE]
      });
      console.log("Connected to device:", device);
      addToIndexDbStore(
        OBJECT_STORE_USERDATA,
        OBJECT_STORE_USERDATA_OBJECTSTORAGE,
        "readwrite",
        "device",
        {
          name: device.name,
          id: device.id
        }
      );
      device.addEventListener("gattserverdisconnected", reconnectToDevice);
      const BluetoothRemoteGATTServer = await device.gatt.connect();
      const service = await BluetoothRemoteGATTServer.getPrimaryService(
        NORDIC_SERVICE
      );
      tx = await service.getCharacteristic(NORDIC_TX);
      rx = await service.getCharacteristic(NORDIC_RX);
    } catch (error) {
      console.log("ERROR " + error);
    }
  };

  async function reconnectToDevice() {
    console.log("Connection Lost");

    while (!device.gatt.conntected) {
      try {
        device.gatt.connect();
      } catch (error) {
        console.log("ERROR : " + error);
      }
    }
  }

  return (
    <div>
      <button id="search-button" onClick={handleClick}>
        ScannConnection{" "}
      </button>{" "}
    </div>
  );
}
