import { addToIndexDbStore } from "../../db/storageObjectMethods.js";

const webSocketConnection = async (userdata, newMp4FilesArray, actions) => {
  const socket = new WebSocket(`${process.env.DEFAULT_WEBSOCKET}/ws`);
  const DATABASE_VIDEOS = `${process.env.DATABASE_VIDEOS}`;
  const OBJECT_STORE_VIDEOS = `${process.env.OBJECT_STORE_VIDEOS}`;
  try {
    socket.addEventListener('open', function (event) {
      downloadFile(0);
    });
  } catch (error) {
    console.error(error);
  }

  let chunks = [];

  const downloadFile = async (fileIndex) => {
    return new Promise((resolve, reject) => {
      const fileDownloadedEvent = new Event('newVideoInIndexDB');
      const file = newMp4FilesArray[fileIndex];
      const message = {
        type: 'newData',
        data: {
          username: userdata.nextCloudUserName,
          password: userdata.nextCloudPassword,
          targetUrl: userdata.webdavAddress,
          newFiles: [file],
        },
      };
      socket.send(JSON.stringify(message));

      socket.addEventListener('message', async function onMessage(event) {
        const newMessageObject = JSON.parse(event.data);
        if (newMessageObject.type === 'incomingNewData') {
          const newContent = newMessageObject.data;
          const uint8Array = new Uint8Array(newContent.buffer.data);
          const arrayBuffer = uint8Array.buffer;
          chunks.push({
            index: newContent.index,
            buffer: arrayBuffer,
          });
          if (newContent.index % 1000 === 0) {
            console.log('Need 5 seconds to catch up.');
            socket.send(
              JSON.stringify({
                type: 'pause',
                filename: newMessageObject.data.name,
                chunkIndex: newContent.index,
              }),
            );
            setTimeout(() => {
              console.log('Resume break..');
              socket.send(
                JSON.stringify({
                  type: 'resume',
                  filename: newMessageObject.data.name,
                }),
              );
            }, 5000);
          }
        } else if (newMessageObject.type === 'end') {
          socket.removeEventListener('message', onMessage);
          console.log(newMessageObject.data);
          const name = newMessageObject.data.name;
          const date = newMessageObject.data.date;
          const byteLength = newMessageObject.data.byteLength;
          chunks.sort((a, b) => a.index - b.index);
          console.log(' byteLength ', byteLength);
          console.log('CHUNKS', chunks);
          const concatenatedChunks = new Uint8Array(byteLength);
          let offset = 0;
          for (const chunk of chunks) {
            concatenatedChunks.set(new Uint8Array(chunk.buffer), offset);
            offset += chunk.buffer.byteLength;
          }

          await new Promise((resolve) => {
            if (name.endsWith('.mp4')) {
              addToIndexDbStore(
                DATABASE_VIDEOS,
                OBJECT_STORE_VIDEOS,
                'readwrite',
                name,
                concatenatedChunks,
                date,
              );
            }
            window.dispatchEvent(fileDownloadedEvent);
            chunks = [];
            resolve();
          });
          if (fileIndex + 1 < newMp4FilesArray.length) {
            await downloadFile(fileIndex + 1);
          }
          actions.setIsRequesting(false);
          resolve(true);
        }
      });
    });
  };

  socket.onclose = (event) => {
    console.log('WebSocket is closed now.');
  };

  socket.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
  });
};
export default webSocketConnection;
