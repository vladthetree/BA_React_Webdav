import {
  addToIndexDbStore,
  removeAlreadyStoredFiles,
} from "../db/storageObjectMethodes.jsx";
import { Buffer } from "buffer";

const DATABASE_VIDEOS = "db";
const OBJECT_STORE_VIDEOS = "videos";
const DEMO_IP = "192.168.43.100";
const LOCALHOST = "localhost";

export const NewFileControll = async (userdata, setNewVideos) => {
  const mp4FilesNames = await listContent(userdata);
  await removeAlreadyStoredFiles(
    DATABASE_VIDEOS,
    mp4FilesNames,
    OBJECT_STORE_VIDEOS
  );
  if (mp4FilesNames.length > 0) {
    console.log("#--New Files available--#");
    console.log("#-- New Files : --#");

    await getFileContent(userdata, mp4FilesNames, setNewVideos);
  } else {
    console.log("#--No new Files to Upload--#");
  }
};

const listContent = async (userdata) => {
  try {
    const response = await fetch(`http://${LOCALHOST}:8081/proxy/listContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
// const listContent = async (userdata) => {
//   try {
//     const response = await fetch("http://localhost:8081/proxy/listContent", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         username: userdata.nextCloudUserName,
//         password: userdata.nextCloudPassword,
//         targetUrl: userdata.webdavAdress,
//       }),
//     });
//     const availableContent = await response.json();
//     return availableContent;
//   } catch (error) {
//     console.error(error);
//   }
// };

const getFileContent = async (userdata, newMp4FilesArray, setNewVideos) => {
  try {
    // const response = await fetch("http://localhost:8081/proxy/getFileContent", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     username: userdata.nextCloudUserName,
    //     password: userdata.nextCloudPassword,
    //     targetUrl: userdata.webdavAdress,
    //     newFiles: newMp4FilesArray,
    //   }),
    // });
    const response = await fetch(`http://${LOCALHOST}:8081/proxy/getFileContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: userdata.nextCloudUserName,
        password: userdata.nextCloudPassword,
        targetUrl: userdata.webdavAdress,
        newFiles: newMp4FilesArray,
      }),
    });
    const content = await response.json();
    const newVideoNameArray = content
      .filter((video) => video.name.endsWith(".mp4"))
      .map((video) => video.name);
    console.log("\n\n\n#-- new Videos resieved --#");
    console.log("#-- start download into IndexDB --#\n\n\n");
    setNewVideos(newVideoNameArray);
    await Promise.all(content.map(async (newFile) => {
      const buffer = Buffer.from(newFile.buffer);
      if (newFile.name.endsWith(".json")) {
        const decoder = new TextDecoder('utf-8');
        const jsonString = decoder.decode(buffer);
        const jsonObject = JSON.parse(jsonString);
        await addToIndexDbStore(
          DATABASE_VIDEOS,
          OBJECT_STORE_VIDEOS,
          "readwrite",
          newFile.name,
          jsonObject,
          newFile.date
        );
      } else if (newFile.name.endsWith(".mp4")) {
        await addToIndexDbStore(
          DATABASE_VIDEOS,
          OBJECT_STORE_VIDEOS,
          "readwrite",
          newFile.name,
          buffer,
          newFile.date
        );
      }
    }));

    return content;

  } catch (error) {
    console.error(error);
  }
};