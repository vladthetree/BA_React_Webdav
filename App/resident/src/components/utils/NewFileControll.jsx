import { addToIndexDbStore, removeAlreadyStoredFiles } from '../db/storageObjectMethodes.jsx';
import { Buffer } from 'buffer';

const DATABASE_VIDEOS = 'db';
const OBJECT_STORE_VIDEOS = 'videos';

const DEMO_IP = '192.168.2.164';
const LOCALHOST = 'localhost';

export const NewFileControll = async (userdata, newVideos, isRequesting) => {
  let mp4FilesNames = null;
  console.log(`##-- Is requesting? : ${isRequesting.current} --##`);
  if (isRequesting.current === false) {
    console.log('#-- No ongoing requests --#');

    mp4FilesNames = await listContent(userdata);
    await removeAlreadyStoredFiles(DATABASE_VIDEOS, mp4FilesNames, OBJECT_STORE_VIDEOS);
    if (mp4FilesNames.length > 0) {
      console.log('#--New Files available--#');
      console.log('#-- New Files : --#');

      await getFileContent(userdata, mp4FilesNames, newVideos, isRequesting);
    } else {
      console.log('#--No new Files to Upload--#');
      isRequesting = false;
    }
  }
};

const listContent = async userdata => {
  try {
    const response = await fetch(`http://${LOCALHOST}:8081/proxy/listContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: userdata.nextCloudUserName,
        password: userdata.nextCloudPassword,
        targetUrl: userdata.webdavAdress,
      }),
    });
    const availableContent = await response.json();
    return availableContent;
  } catch (error) {
    console.error(error);
  }
};

const getFileContent = async (userdata, newMp4FilesArray, newVideos, isRequesting) => {
  const socket = new WebSocket('ws://localhost:8050');
  const isServerBusy = await new Promise(resolve => {
    const message = {
      type: 'isServerBusy',
    };
    socket.addEventListener('open', () => {
      socket.send(JSON.stringify(message));
    });
    socket.addEventListener('message', event => {
      const messageObject = JSON.parse(event.data);
      if (messageObject.type === 'serverBusy') {
        if (messageObject.data === true) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    });
  });
  console.log(`SERVER BUSY : ${isServerBusy}`);
  if (isServerBusy) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    await getFileContent(userdata, newMp4FilesArray, newVideos, isRequesting);
    isRequesting.current = true;
    return;
  } else {
    console.log('Server is not busy');
    try {
      console.log('THIS IS A TEST');
      const message = {
        type: 'newData',
        data: {
          username: userdata.nextCloudUserName,
          password: userdata.nextCloudPassword,
          targetUrl: userdata.webdavAdress,
          newFiles: newMp4FilesArray,
        },
      };
      socket.send(JSON.stringify(message));
      socket.addEventListener('message', async function (event) {
        const message = JSON.parse(event.data);
        if (message.type === 'newDataResponse') {
          const newContent = message.data[0];
          newVideos.push(newContent.name);
          isRequesting.current = false;
          await new Promise(resolve => {
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
    } catch (error) {
      console.error(error);
    }
  }
};
