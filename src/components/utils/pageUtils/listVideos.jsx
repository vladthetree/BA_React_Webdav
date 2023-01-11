import { useState, useEffect, useRef, memo } from "react";
import { getConvertedBlobVideos } from "../db/storageObjectMethodes";
import { useWindowSize } from "react-use";
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
    console.log("VIDEOS")
    console.log(videos)
    intervalVideoRef.current = setInterval(async () => {
      let storedFiles = await getConvertedBlobVideos();
      console.log("INSIDE listVideos")
      console.log(storedFiles)
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

  return (
    <div
      style={{
        display: "flex",
        overflowX: "scroll"
      }}
    >
      {videos.map(video =>
        <div key={video.name} style={{ flex: 2, padding: "15px 20px" }}>
          <video
            src={video.url}
            controls
            type="video/mp4"
            className={`videostyle`}
            style={{
              width: width / 1.2,
              height: height / 1.2
            }}
          >
            Your browser does not support the video element.
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
