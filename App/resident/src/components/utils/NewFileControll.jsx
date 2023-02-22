import {
  addToIndexDbStore,
  removeAlreadyStoredFiles,
} from "../db/storageObjectMethodes.jsx";
import { Buffer } from "buffer";

const DATABASE_VIDEOS = "db";
const OBJECT_STORE_VIDEOS = "videos";

export const NewFileControll = async (userdata, errorRef, setNewVideos) => {
  const mp4FilesNames = await listContent(userdata, errorRef);
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

const listContent = async (userdata, errorRef) => {
  try {
    const response = await fetch("http://localhost:8081/proxy/listContent", {
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
    errorRef.current = error;
  }
};

const getFileContent = async (userdata, newMp4FilesArray, setNewVideos) => {
  try {
    const response = await fetch("http://localhost:8081/proxy/getFileContent", {
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
    console.log(content);
	
    content.forEach((newFile) => {
      let buffer = Buffer.from(newFile.buffer);

      addToIndexDbStore(
        DATABASE_VIDEOS,
        OBJECT_STORE_VIDEOS,
        "readwrite",
        newFile.name,
        buffer,
        newFile.date
      );
    });
    return content;
  } catch (error) {
    console.error(error);
  }
};
