import React, { useEffect, useState, useRef } from 'react';
import { writeMessage } from './../utils/webbluetooth/writeBLEmessage.js';

export default function BluetoothConnection({
  newVideos,
  currentBLEstatus,
  handleDisplayBLEconnection,
}) {
  const NORDIC_SERVICE = `${process.env.NORDIC_SERVICE}`;
  const NORDIC_TX = `${process.env.TX}`;
  const NORDIC_RX = `${process.env.RX}`;
  const MAX_TRYS = 2;
  const MAX_DELAY = 3;
  const [isWebBluetoothSupported, setIsWebBluetoothSupported] = useState(true);
  const [filterArray, setFilterArray] = useState([
    { namePrefix: 'Puck.js' },
    { namePrefix: 'Bangle' },
    { services: [NORDIC_SERVICE] },
  ]);

  const server = useRef(null);
  const service = useRef(null);
  const rxRef = useRef(null);
  const txRef = useRef(null);
  const bluetoothDeviceRef = useRef(null);
  let isConnected = false;

  const handleClick = async () => {
    bluetoothDeviceRef.current = null;
    try {
      console.log('Requesting any Bluetooth Device...');
      if (!navigator.bluetooth) {
        setIsWebBluetoothSupported(false);
        return;
      }
      console.log(filterArray);
      console.log(NORDIC_SERVICE);
      bluetoothDeviceRef.current = await navigator.bluetooth.requestDevice({
        filters: filterArray,
        optionalServices: [NORDIC_SERVICE],
      });
      bluetoothDeviceRef.current.addEventListener(
        'gattserverdisconnected',
        onDisconnected,
      );
      await connectBLE(handleDisplayBLEconnection);
    } catch (error) {
      console.log(error);
    }

    document.addEventListener('newVideo', handleNewVideo);
  };

  useEffect(() => {
    if (newVideos.length > 0) {
      const event = new CustomEvent('newVideo', {
        detail: { bleStatus: currentBLEstatus },
      });
      document.dispatchEvent(event);
    }
  }, [newVideos]);

  async function connectBLE(handleDisplayBLEconnection) {
    exponentialBackoff(
      MAX_TRYS,
      MAX_DELAY,
      async function toTry() {
        time('Connecting to Bluetooth Device... ');
        server.current = await bluetoothDeviceRef.current.gatt.connect();
        service.current = await server.current.getPrimaryService(
          NORDIC_SERVICE,
        );
        txRef.current = await service.current.getCharacteristic(NORDIC_TX);
        rxRef.current = await service.current.getCharacteristic(NORDIC_RX);

        rxRef.current.startNotifications();
      },
      async function success() {
        await writeMessage('connected();\n', txRef.current);
        console.log('Bluetooth Device is connected.');
        isConnected = true;
        handleDisplayBLEconnection(true);
      },
      function fail() {
        time('Failed to reconnect.');
      },
    );
  }

  const handleNewVideo = async () => {
    const message = 'newVideos();\n';
    while (!isConnected) {
      await new Promise((resolve) => setTimeout(resolve, 20000));
    }
    try {
      await writeMessage(message, txRef.current);
    } catch (error) {
      console.log(`Error writing value: ${error}`);
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
      time(`Retrying in ${delay}s... (${max} tries left)`);
      setTimeout(function () {
        exponentialBackoff(--max, delay * 2, toTry, success, fail);
      }, delay * 1000);
    }
  }

  function time(text) {
    console.log(`[${new Date().toJSON().substr(11, 8)}] ${text}`);
  }

  function onDisconnected() {
    console.log('Bluetooth Device disconnected');
    isConnected = false;
    connectBLE();
  }

  return (
    <div>
      <button id="search-button" onClick={handleClick}>
        Web Bluetooth
      </button>
    </div>
  );
}
