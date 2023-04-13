import { Buffer } from 'buffer';
import { addToIndexDbStore } from '../model/db/storageObjectMethods.js';

const DATABASE_VIDEOS = `${process.env.DATABASE_VIDEOS}`;
const OBJECT_STORE_VIDEOS = `${process.env.OBJECT_STORE_VIDEOS}`;

const webSocketConnection = async (userdata, newMp4FilesArray, actions) => {
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

  socket.addEventListener('message', async function (event) {
    const fileDownloadedEvent = new Event('newVideoInIndexDB');
    const newMessageObject = JSON.parse(event.data);
    if (newMessageObject.type === 'incomingNewData') {
      const newContent = newMessageObject.data[0];
      await new Promise((resolve) => {
        const buffer = Buffer.from(newContent.buffer);
        if (newContent.name.endsWith('.json')) {
          const decoder = new TextDecoder('utf-8');
          const jsonString = decoder.decode(buffer);
          const jsonObject = JSON.parse(jsonString);
          addToIndexDbStore(
            DATABASE_VIDEOS,
            OBJECT_STORE_VIDEOS,
            'readwrite',
            newContent.name,
            jsonObject,
            newContent.date,
          );
        } else if (newContent.name.endsWith('.mp4')) {
          addToIndexDbStore(
            DATABASE_VIDEOS,
            OBJECT_STORE_VIDEOS,
            'readwrite',
            newContent.name,
            buffer,
            newContent.date,
          );
        }
        window.dispatchEvent(fileDownloadedEvent);
      });
    }
  });

  socket.onclose = (event) => {
    console.log('WebSocket connection closed:', event);
    actions.setIsRequesting(false);
  };

  socket.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
    actions.setIsRequesting(false);
  });
};

export default webSocketConnection;
