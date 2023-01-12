import { writeValueBLEmessage } from "../bluetooth/utils/writeBLEmessage.js";
import {
  checkForExistingStorage,
  addToIndexDbStore,
  getDeviceFromStore
} from "../db/storageObjectMethodes";
import React from 'react';

import { command } from "./utils/commands.js";

const OBJECT_STORE_USER_DATA = "userData";
const NORDIC_SERVICE = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const NORDIC_TX = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const NORDIC_RX = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

export function Bluetooth() {
  async function searchBluetoothDevice() {
    checkForExistingStorage(OBJECT_STORE_USER_DATA);
    if (navigator.bluetooth) {
      console.log("The navigator.bluetooth API is supported.");
      try {
        console.log("Requesting any Bluetooth device...");
        const device = await navigator.bluetooth.requestDevice({
          filters: [
            {
              namePrefix: "Bangle"
            },
            {
              services: [NORDIC_SERVICE]
            }
          ],
          optionalServices: [NORDIC_SERVICE]
        });

        let bluetoothDevice = {
          name: device.name,
          id: device.id
        };
        addToIndexDbStore(
          OBJECT_STORE_USER_DATA,
          "readwrite",
          "device",
          bluetoothDevice
        );

        let somedevice = await getDeviceFromStore(
          OBJECT_STORE_USER_DATA,
          "readonly",
          "device"
        );
        console.log(somedevice);
        const BluetoothRemoteGATTServer = await device.gatt.connect();
        const BluetoothRemoteGATTService = await BluetoothRemoteGATTServer.getPrimaryService(
          NORDIC_SERVICE
        );

        const BluetoothCharacteristic = await BluetoothRemoteGATTService.getCharacteristic(
          NORDIC_TX
        );
        await writeValueBLEmessage(befehle.sample1, BluetoothCharacteristic);
        device.gatt.disconnect();
      } catch (error) {
        console.log("Argh! " + error);
      }
    } else {
      console.log("The navigator.bluetooth API is not supported.");
    }
  }

  return (
    <div>
      <button onClick={() => searchBluetoothDevice()}>
        Connect Bangle Device
      </button>
    </div>
  );
}
