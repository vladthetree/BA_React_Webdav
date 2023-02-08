import { useState, useEffect, useRef, memo } from "react";
import { getConvertedBlobVideos } from "../db/storageObjectMethodes.jsx";
import { useWindowSize } from "react-use";
import React from "react";
import "../../style/videostyle.css";
import SwipeRight from "../../icons/react-svg/SwipeRight.jsx";
import SwipeLeft from "../../icons/react-svg/SwipeLeft.jsx";

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
          setVideos((prevVideos) => [...prevVideos, video]);
        }
      }
    }, INTERVAL_VIDEOCHECK);
    return () => clearInterval(intervalVideoRef.current);
  }, []);

  async function newVideoCheck(storagaArray, videoArray) {
    return storagaArray.filter((item) => !videoArray.includes(item.name));
  }

  const handleClickVideo = (e) => {
    const video = e.currentTarget;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        overflowX: "scroll",
      }}
    >
      {videos.map((video, index) => (
        <div
          key={video.name}
          style={{
            marginTop: "10px",
            marginRight: "10px",
            position: "relative",
          }}
        >
          {console.log(video.length)}
          <div
            style={{
         
              width: width / 1.2,
              height: height / 1.2,
              display: "flex",
            }}
          >
            {index !== 0 && (
              <div className="videoSwipe">
                <SwipeLeft
                  style={{
                    height: height * 0.5,
                    width: width * 0.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
              </div>
            )}

            <div className="leftPart">
              <div className="videoPartContainer">
                <video
                  src={video.url}
                  type="video/mp4"
                  style={{
                    width: "100%",
                    height: height / 1.2,
                  }}
                  onClick={handleClickVideo}
                />
              </div>
              <div className="videoNameContainer">
                {video.name.substring(0, video.name.length - 4)}
              </div>
            </div>

            {index !== videos.length - 1 && (
              <div className="videoSwipe">
                <SwipeRight
                  style={{
                    height: height * 0.5,
                    width: width * 0.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});
