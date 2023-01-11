import { sliceArrayBuffer } from "../utils/sliceArrayBuffer.js";
const encoder = new TextEncoder();
export async function writeValueBLEmessage(
  StringMessage,
  BluetoothCharacteristic
) {
  console.log(" WRITING MESSAGE");
  const arrayBuffer = encoder.encode(StringMessage);
  const chunks = sliceArrayBuffer(arrayBuffer);
  for (const chunk of chunks) {
    await BluetoothCharacteristic.writeValue(chunk);
  }
  console.log(
    `Message :\n${StringMessage}has been written.It where ${chunks.length} chunks.`
  );
}
