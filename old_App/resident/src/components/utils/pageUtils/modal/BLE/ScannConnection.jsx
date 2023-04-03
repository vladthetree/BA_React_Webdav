import React, { useEffect, useState, useRef } from 'react';
import { writeMessage } from './writeBLEmessage.js';

export function ScannConnection({ videoamount, currentBLEstatus, handleDisplayBLEconnection }) {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isWebBluetoothSupported, setIsWebBluetoothSupported] = useState(true);

  var NORDIC_SERVICE = useRef('6e400001-b5a3-f393-e0a9-e50e24dcca9e');
  var NORDIC_TX = useRef('6e400002-b5a3-f393-e0a9-e50e24dcca9e');
  var NORDIC_RX = useRef('6e400003-b5a3-f393-e0a9-e50e24dcca9e');
  const [filters, setFilters] = useState([
    { namePrefix: 'Puck.js' },
    { namePrefix: 'Bangle' },
    { services: [NORDIC_SERVICE.current] },
  ]);
  const server = useRef(null);
  const service = useRef(null);
  const rxRef = useRef(null);
  const txRef = useRef(null);
  const bluetoothDeviceRef = useRef(null);
  const latestNewVideoMessageRef = useRef('');
  const MAX_TRYS = 2;
  const MAX_DELAY = 3;
  let isConnected = false;

  let newVideoMessage = `newVideos(${videoamount})\n;`;
  const handleClick2 = async () => {
    bluetoothDeviceRef.current = null;
    try {
      console.log('Requesting any Bluetooth Device...');
      if (!navigator.bluetooth) {
        setIsWebBluetoothSupported(false);
        return;
      }
      if (!permissionGranted) {
        await navigator.bluetooth.requestDevice({
          filters: filters,
          optionalServices: [NORDIC_SERVICE.current],
        });
        setPermissionGranted(true);
      }
      bluetoothDeviceRef.current = await navigator.bluetooth.requestDevice({
        filters: filters,
        optionalServices: [NORDIC_SERVICE.current],
      });
      bluetoothDeviceRef.current.addEventListener('gattserverdisconnected', onDisconnected);
      await connectBLE(handleDisplayBLEconnection);
    } catch (error) {
      console.log(error);
    }

    document.addEventListener('newVideo', handleNewVideo);
  };

  useEffect(() => {
    if (newVideoMessage !== '') {
      const event = new CustomEvent('newVideo', {
        detail: { videoAmount: videoamount, bleStatus: currentBLEstatus },
      });
      document.dispatchEvent(event);
    }
  }, [newVideoMessage]);

  async function connectBLE(handleDisplayBLEconnection) {
    exponentialBackoff(
      MAX_TRYS,
      MAX_DELAY,
      async function toTry() {
        time('Connecting to Bluetooth Device... ');
        server.current = await bluetoothDeviceRef.current.gatt.connect();
        service.current = await server.current.getPrimaryService(NORDIC_SERVICE.current);
        txRef.current = await service.current.getCharacteristic(NORDIC_TX.current);
        rxRef.current = await service.current.getCharacteristic(NORDIC_RX.current);
        txRef.current.addEventListener('characteristicvaluechanged', onRxChanged);

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

  const onRxChanged = event => {
    // Get the received data
    const decoder = new TextDecoder();
    const message = decoder.decode(event.target.value);
    console.log('Received message: ', message);

    // Stop listening for new data
    rxRef.current.stopNotifications();
    rxRef.current.removeEventListener('characteristicvaluechanged', onRxChanged);
  };

  const handleNewVideo = async event => {
    let videoAmount = event.detail.videoAmount;
    const message = `newVideos(${videoAmount});\n`;
    latestNewVideoMessageRef.current = message;
    while (!isConnected) {
      await new Promise(resolve => setTimeout(resolve, 10000));
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
      time('Retrying in ' + delay + 's... (' + max + ' tries left)');
      setTimeout(function () {
        exponentialBackoff(--max, delay * 2, toTry, success, fail);
      }, delay * 1000);
    }
  }

  function time(text) {
    console.log('[' + new Date().toJSON().substr(11, 8) + '] ' + text);
  }

  function onDisconnected() {
    console.log('Bluetooth Device disconnected');
    isConnected = false;
    connectBLE();
  }

  const handleSendMessage = async () => {
    await writeMessage('sendMessage();\n', txRef.current);
  };

  return (
    <div>
      <button id="search-button" onClick={handleClick2}>
        ScannConnection2
      </button>
    </div>
  );
}
