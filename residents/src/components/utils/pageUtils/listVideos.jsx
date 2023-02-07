import { useState, useEffect, useRef, memo } from "react";
import { getConvertedBlobVideos } from "../db/storageObjectMethodes.jsx";
import { useWindowSize } from "react-use";
import React from 'react';
import "../../style/videostyle.css";

const INTERVAL_VIDEOCHECK = 1000;
const DATABASE_VIDEOS = "db";

export const ListVideos = memo(function ListVideos() {
  const [videos, setVideos] = useState([]);
  const addedVideosRef = useRef(new Set());
  const { width, height } = useWindowSize();
  const intervalVideoRef = useRef();
  const fontSize = height / 25;

  useEffect(() => {
    intervalVideoRef.current = setInterval(async () => {
      let storedFiles = await getConvertedBlobVideos();
      let newVideos = await newVideoCheck(storedFiles, videos);
      for (const video of newVideos) {
        if (!addedVideosRef.current.has(video.name)) {
          addedVideosRef.current.add(video.name);
          setVideos(prevVideos => [...prevVideos, video]);
        }
      }
    }, INTERVAL_VIDEOCHECK);
    return () => clearInterval(intervalVideoRef.current);
  }, []);

  async function newVideoCheck(storagaArray, videoArray) {
    return storagaArray.filter(item => !videoArray.includes(item.name));
  }

  const handleClickVideo = (e) =>{
    const video = e.currentTarget;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

  return (
    <div
      style={{
        display: "flex",
        overflowX: "scroll"
      }}
    >
      {videos.map(video =>
        <div key={video.name} style={{ marginTop:"10px" }}>
          <video
            src={video.url}
           
            type="video/mp4"
            className={"videostyle"}
            style={{
              width: width / 1.2,
              height: height / 1.2
            }}
            onClick={handleClickVideo}
            
          >
          </video>
          <p
            style={{
              color: "white",
              fontSize: `${fontSize}px`,
              textAlign: "center"
            }}
          >
            {video.name.substring(0, video.name.length - 4)}
          </p>
        </div>
      )}
    </div>
  );
});
