import { useEffect, useRef } from "react";
import { client } from "./webdav/client";
import {
  addToIndexDbStore,
  removeAlreadyStoredFiles
} from "./db/storageObjectMethodes.jsx";
import {Buffer} from "buffer"

const DATABASE_VIDEOS = "db";
const OBJECT_STORE_VIDEOS = "videos";
const INTERVAL_WEBDAVCHECK = 2000;
const username = "test";
const password = "12345";
const targetUrl = "https://localhost:8443/remote.php/dav/files/test/";

export function ListDir() {
  const intervalRef = useRef();
  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      if (navigator.onLine) {
        console.log(" IM ONLINE");
        const content = await listContent();
        const mp4Files = await filterMp4Files(content);
        await removeAlreadyStoredFiles(
          DATABASE_VIDEOS,
          mp4Files,
          OBJECT_STORE_VIDEOS
        );
        if (mp4Files.length > 0) {
          console.log("#--New Files available--#");
          console.log("Result of Server");
          await getFileContent(mp4Files);

          //downloadNewFiles(mp4Files);
        } else {
          console.log(`#--No new Files to Upload--#`);
        }
      } else {
        console.log(" IM OFFLINE");
      }
    }, INTERVAL_WEBDAVCHECK);
    return () => clearTimeout(intervalRef.current);
  }, []);
}

async function filterMp4Files(content) {
  return content.filter(item => item.basename.includes(".mp4"));
}

const listContent = async () => {
  try {
    const response = await fetch("/proxy/listContent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
        targetUrl: targetUrl
      })
    });
    const content = await response.json();
    return content;
  } catch (error) {
    console.error(error);
  }
};

const getFileContent = async newMp4FilesArray => {
  try {
    const response = await fetch("/proxy/getFileContent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
        targetUrl: targetUrl,
        newFiles: newMp4FilesArray
      })
    });
    const content = await response.json();
    console.log("\n\n\n#-- new Videos resieved --#");
    console.log("#-- start download into IndexDB --#\n\n\n");
    content.forEach(newFile => {
      console.log("PRE CONVERT BUFFER")
      console.log(newFile.buffer);
      let buffer = Buffer.from(newFile.buffer);

        addToIndexDbStore(
          DATABASE_VIDEOS,
          OBJECT_STORE_VIDEOS,
          "readwrite",
          newFile.name,
          buffer
        );
    });
    return content;
  } catch (error) {
    console.error(error);
  }
};
