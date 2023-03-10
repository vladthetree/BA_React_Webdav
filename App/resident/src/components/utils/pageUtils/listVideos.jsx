import { useState, useEffect, useRef, memo } from 'react';
import { getConvertedBlobVideos } from '../../db/storageObjectMethodes.jsx';
import { useWindowSize } from 'react-use';
import React from 'react';
import '../../style/videostyle.css';
import Swipe from '../../svgs/Swipe.jsx';

const INTERVAL_VIDEOCHECK = 1000;
const COWNDOWN_ACTIVITYCHECK = 3000;

export const ListVideos = memo(function ListVideos({
  reminder,
  setIsActive,
  handleClickVideo,
  isVideoPlaying,
  videos,
  setVideos,
  handleMemorizeObject,
}) {
  const addedVideosRef = useRef(new Set());
  const { width, height } = useWindowSize();
  const intervalVideoRef = useRef();
  const allVideosRef = useRef([]);
  const matchingVideo = allVideosRef.current.find(video => reminder.includes(reminder[0]));
  if (matchingVideo) {
    handleMemorizeObject(matchingVideo);
  }
  console.log('# ---------------------------- # ListVideos');
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
    const videoNames = videoArray.map(video => video.name);
    return storagaArray.filter(item => !videoNames.includes(item.name));
  }

  useEffect(() => {
    let idleTimeout = setTimeout(() => {
      setIsActive(false);
      window.removeEventListener('mousemove', resetTimeout);
      window.removeEventListener('keydown', resetTimeout);
      window.removeEventListener('touchstart', resetTimeout);
    }, COWNDOWN_ACTIVITYCHECK);

    function resetTimeout() {
      clearTimeout(idleTimeout);
      idleTimeout = !isVideoPlaying
        ? setTimeout(() => {
            setIsActive(false);
            window.removeEventListener('mousemove', resetTimeout);
            window.removeEventListener('keydown', resetTimeout);
            window.removeEventListener('touchstart', resetTimeout);
          }, COWNDOWN_ACTIVITYCHECK)
        : console.log('#--Some Video is now playing, no Idle Timer Reset active.--#');
    }

    window.addEventListener('mousemove', resetTimeout);
    window.addEventListener('keydown', resetTimeout);
    window.addEventListener('touchstart', resetTimeout);
  }, [isVideoPlaying]);

  return (
    <div
      style={{
        display: 'flex',
        overflowX: 'scroll',
      }}
    >
      {videos.map((video, index) => (
        <div
          key={video.id}
          style={{
            marginTop: '10px',
            marginRight: '10px',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: width / 1.2,
              height: height / 1.2,
              display: 'flex',
            }}
          >
            <div className="leftPart">
              <div className="videoPartContainer">
                <video
                  src={video.url}
                  type="video/mp4"
                  className="video"
                  onClick={e => handleClickVideo(e)}
                />
              </div>
              <div className="videoNameContainer" style={{ fontSize: height / 19 }}>
                {video.name.substring(0, video.name.length - 4)}
              </div>
            </div>
            {index !== videos.length - 1 && (
              <div className="videoSwipe">
                <Swipe
                  style={{
                    height: height * 0.5,
                    width: width * 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
