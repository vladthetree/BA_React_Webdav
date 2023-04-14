import { Buffer } from 'buffer';
import { addToIndexDbStore } from '../model/db/storageObjectMethods.js';

const DATABASE_VIDEOS = `${process.env.DATABASE_VIDEOS}`;
const OBJECT_STORE_VIDEOS = `${process.env.OBJECT_STORE_VIDEOS}`;

const webSocketConection = async (userdata, newMp4FilesArray, actions) => {
  const socket = new WebSocket(`${process.env.DEFAULT_WEBSOCKET}/ws`);
  try {
    const message = {
      type: 'newData',
      data: {
        username: userdata.nextCloudUserName,
        password: userdata.nextCloudPassword,
        targetUrl: userdata.webdavAddress,
        newFiles: newMp4FilesArray,
      },
    };
    socket.addEventListener('open', function (event) {
      socket.send(JSON.stringify(message));
    });
  } catch (error) {
    console.error(error);
  }

  let chunks = [];

  socket.addEventListener('message', async function (event) {
    const fileDownloadedEvent = new Event('newVideoInIndexDB');
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
      const name = newMessageObject.data.name;
      const date = newMessageObject.data.date;
      chunks.sort((a, b) => a.index - b.index);
      const concatenatedChunks = new Uint8Array(
        newMessageObject.data.total * 65536,
      );
      let offset = 0;
      for (const chunk of chunks) {
        concatenatedChunks.set(new Uint8Array(chunk.buffer), offset);
        offset += chunk.buffer.byteLength;
      }
      console.log(concatenatedChunks);

      chunks = [];
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
        resolve();
      });
    }
  });

  socket.onclose = (event) => {
    actions.setIsRequesting(false);
  };

  socket.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
    actions.setIsRequesting(false);
  });
};

export default webSocketConection;
