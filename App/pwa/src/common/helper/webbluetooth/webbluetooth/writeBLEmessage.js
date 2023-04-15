import { sliceArrayBuffer } from '../sliceArrayBuffer.js';

const encoder = new TextEncoder();
const writeValueBLEmessage = async (StringMessage, BluetoothCharacteristic) => {
  console.log(' WRITING MESSAGE');
  const arrayBuffer = encoder.encode(StringMessage);
  const chunks = sliceArrayBuffer(arrayBuffer);
  for (const chunk of chunks) {
    try {
      await BluetoothCharacteristic.writeValue(chunk);
      console.log('Sent chunk ', chunk);
    } catch (error) {
      console.log(`Error in writeValueBLEmessage: ${error}`);
    }
  }
  console.log(
    `Message :\n ${StringMessage}has been written.It where ${chunks.length} chunks.`,
  );
  console.log(BluetoothCharacteristic);
};

export async function writeMessage(StringMessage, BluetoothCharacteristic) {
  console.log('Starting to write message');
  console.log('MESSAGE IS:');
  console.log(StringMessage);
  console.log(BluetoothCharacteristic);
  await writeValueBLEmessage(StringMessage, BluetoothCharacteristic);
  console.log('Finished writing message');
}
