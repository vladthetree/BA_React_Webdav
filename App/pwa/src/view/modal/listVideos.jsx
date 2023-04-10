import React, { useEffect, useRef, memo, useCallback } from 'react';
import { getConvertedBlobVideos } from '../../model/db/storageObjectMethods.js';
import { useWindowSize } from 'react-use';
import Swipe from '../svgs/Swipe.jsx';
import './../style/videostyle.css';

const COWNDOWN_ACTIVITYCHECK = `${process.env.COWNDOWN_ACTIVITYCHECK}`;

export default memo(function ListVideos({
  setIsActive,
  handleClickVideo,
  isVideoPlaying,
  videos,
  setVideos,
}) {
  const { width, height } = useWindowSize();

  const displayVideos = useCallback(async () => {
    const storedFiles = await getConvertedBlobVideos();
    const sortedFiles = storedFiles.sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
    setVideos(sortedFiles);
  }, [setVideos]);

  useEffect(() => {
    window.addEventListener('newVideoInIndexDB', displayVideos);
    window.addEventListener('appIsActive', displayVideos);

    return () => {
      window.removeEventListener('newVideoInIndexDB', displayVideos);
      window.removeEventListener('appIsActive', displayVideos);
    };
  }, [displayVideos]);

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
        : console.log(
            '#--Some Video is now playing, no Idle Timer Reset active.--#',
          );
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
                  onClick={(e) => handleClickVideo(e)}
                />
              </div>
              <div
                className="videoNameContainer"
                style={{ fontSize: height / 19 }}
              >
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
