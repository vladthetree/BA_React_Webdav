import { Buffer } from 'buffer';
import {
  addToIndexDbStore,
  removeAlreadyStoredFiles,
} from '../model/db/storageObjectMethods.js';
const DATABASE_VIDEOS = `${process.env.DATABASE_VIDEOS}`;
const OBJECT_STORE_VIDEOS = `${process.env.OBJECT_STORE_VIDEOS}`;

export default async function newFileControll(
  userdata,
  setNewVideos,
  setIsRequesting,
) {
  let mp4FilesNames = null;
  console.log('#-- No ongoing requests --#');
  mp4FilesNames = await listContent(userdata).then((contentArray) => {
    setIsRequesting(true);
    return contentArray;
  });
  if (mp4FilesNames) {
    await removeAlreadyStoredFiles(
      DATABASE_VIDEOS,
      mp4FilesNames,
      OBJECT_STORE_VIDEOS,
    );
    if (mp4FilesNames.length > 0) {
      console.log('#--New Files available--#');
      console.log('#-- New Files : --#');
      await getFileContent(userdata, mp4FilesNames, setIsRequesting).then(
        () => {
          setNewVideos(mp4FilesNames);
        },
      );
    } else {
      console.log('#--No new Files to Upload--#');
      setIsRequesting(false);
    }
  } else {
    setIsRequesting(false);
  }
}

const listContent = async (userdata) => {
  console.log('TEST2');
  console.log(userdata.webdavAddress);
  try {
    const response = await fetch(
      `${process.env.DEFAULT_LOCALHOST}/listContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userdata.nextCloudUserName,
          password: userdata.nextCloudPassword,
          targetUrl: userdata.webdavAddress,
        }),
      },
    );
    const availableContent = await response.json();
    const availableVideosArray = Array.from(availableContent);
    return availableVideosArray;
  } catch (error) {
    console.error(error);
  }
};

const getFileContent = async (userdata, newMp4FilesArray, setIsRequesting) => {
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
    setIsRequesting(false);
  };

  socket.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
    setIsRequesting(false);
  });
};
