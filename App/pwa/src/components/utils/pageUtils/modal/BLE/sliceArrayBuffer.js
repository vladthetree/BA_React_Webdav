const CHUNG_SIZE = 20;
export function sliceArrayBuffer(arrayBuffer) {
  //BLE max 20byte-Rate
  const chunks = [];
  let i = 0;
  while (i < arrayBuffer.byteLength) {
    const chunk = new Uint8Array(arrayBuffer.slice(i, i + CHUNG_SIZE));
    chunks.push(chunk);
    i += CHUNG_SIZE;
  }
  return chunks;
}
