const OBJECT_STORE_USER_DATA = "userData";
const NORDIC_SERVICE = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const NORDIC_TX = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const NORDIC_RX = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

async function BluetoothConnect() {
  checkForExistingStorage(OBJECT_STORE_USER_DATA);
  if (navigator.bluetooth) {
    console.log("The navigator.bluetooth API is supported.");
    try {
      console.log("Requesting any Bluetooth device...");
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: "Bangle" }, { services: [NORDIC_SERVICE] }],
        optionalServices: [NORDIC_SERVICE]
      });

      addToIndexDbStore(
        OBJECT_STORE_USER_DATA,
        "readwrite",
        device.name,
        device.fileContext
      );
      return device;
    } catch (error) {
      console.log("Argh! " + error);
    }
  }
}
export { BluetoothConnect };
