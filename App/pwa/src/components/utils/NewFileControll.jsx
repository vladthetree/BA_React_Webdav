import {
  addToIndexDbStore,
  removeAlreadyStoredFiles,
} from '../db/storageObjectMethodes.jsx';
import { Buffer } from 'buffer';
const DATABASE_VIDEOS = 'db';
const OBJECT_STORE_VIDEOS = 'videos';

const DEMO_IP = '192.168.43.100';
const LOCALHOST = '217.160.57.23';

export const NewFileControll = async (
  userdata,
  setNewVideos,
  setIsRequesting,
) => {
  let mp4FilesNames = null;
  console.log('#-- No ongoing requests --#');
  mp4FilesNames = await listContent(userdata).then((contentArray) => {
    setIsRequesting(true);
    return contentArray;
  });
  console.log('T0');
  console.log(mp4FilesNames);
  if (mp4FilesNames) {
    console.log('T1');
    await removeAlreadyStoredFiles(
      DATABASE_VIDEOS,
      mp4FilesNames,
      OBJECT_STORE_VIDEOS,
    );
    console.log('T2');
    console.log(mp4FilesNames);
    if (mp4FilesNames.length > 0) {
      console.log('#--New Files available--#');
      console.log('#-- New Files : --#');
      await getFileContent(userdata, mp4FilesNames, setIsRequesting).then(
        () => {
          console.log('TESTING RESULT OF sampleA');
          console.log(' AFTER GET FILE CONTENT');
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
};

const listContent = async (userdata) => {
  try {
    const response = await fetch(`https://server.banextcl.eu/listContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: userdata.nextCloudUserName,
        password: userdata.nextCloudPassword,
        targetUrl: userdata.webdavAdress,
      }),
    });
    const availableContent = await response.json();
    const availableVideosArray = Array.from(availableContent);
    console.log('available Content : ', availableVideosArray);
    return availableVideosArray;
  } catch (error) {
    console.error(error);
  }
};

const getFileContent = async (userdata, newMp4FilesArray, setIsRequesting) => {
  const socket = new WebSocket(`wss://server.banextcl.eu/ws`);
  console.log('OPEN THE SOCKET : ');
  try {
    const message = {
      type: 'newData',
      data: {
        username: userdata.nextCloudUserName,
        password: userdata.nextCloudPassword,
        targetUrl: userdata.webdavAdress,
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
    console.log('LISTENER : ');
    console.log(event.data);
    const newMessageObject = JSON.parse(event.data);
    if (newMessageObject.type === 'incomingNewData') {
      const newContent = newMessageObject.data[0];
      console.log('GOT NEW  VIDEO DATA FROM SERVER');
      console.log(newContent);
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
