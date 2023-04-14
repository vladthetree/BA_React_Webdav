import React, { useEffect, memo, useCallback } from 'react';
import { getConvertedBlobVideos } from '../../model/db/storageObjectMethods.js';
import { useWindowSize } from 'react-use';
import { useSelector } from 'react-redux';
import mainPageDispatcher from '../../actions/mainPageActions.js';
import Swipe from '../../assets/svgs/Swipe.jsx';
import '../../assets/style/videostyle.css';

const COUNTDOWN_ACTIVITYCHECK = `${process.env.COUNTDOWN_ACTIVITYCHECK}`;

export default memo(function ListVideos({ videos }) {
  const { width, height } = useWindowSize();
  const actions = mainPageDispatcher();

  const videoPageState = useSelector(
    (videoPageState) => videoPageState.videoPageReducer,
  );

  const displayVideos = useCallback(async () => {
    const storedFiles = await getConvertedBlobVideos();
    actions.setDisplayedVideos(storedFiles);
  }, [videos]);

  useEffect(() => {
    window.addEventListener('newVideoInIndexDB', displayVideos);
    window.addEventListener('appIsActive', displayVideos);

    return () => {
      window.removeEventListener('newVideoInIxndexDB', displayVideos);
      window.removeEventListener('appIsActive', displayVideos);
    };
  }, [displayVideos]);

  useEffect(() => {
    let idleTimeout = setTimeout(() => {
      actions.setIsActive(false);
      window.removeEventListener('mousemove', resetTimeout);
      window.removeEventListener('keydown', resetTimeout);
      window.removeEventListener('touchstart', resetTimeout);
    }, COUNTDOWN_ACTIVITYCHECK);

    function resetTimeout() {
      clearTimeout(idleTimeout);
      idleTimeout = !videoPageState.isVideoPlaying
        ? setTimeout(() => {
            actions.setIsActive(false);
            window.removeEventListener('mousemove', resetTimeout);
            window.removeEventListener('keydown', resetTimeout);
            window.removeEventListener('touchstart', resetTimeout);
          }, COUNTDOWN_ACTIVITYCHECK)
        : console.log(
            '#--Some Video is now playing, no Idle Timer Reset active.--#',
          );
    }
    window.addEventListener('mousemove', resetTimeout);
    window.addEventListener('keydown', resetTimeout);
    window.addEventListener('touchstart', resetTimeout);
  }, [videoPageState.isVideoPlaying]);

  const handleClickVideo = (e) => {
    const video = e.currentTarget;
    if (video.paused) {
      actions.setIsVideoPlaying(true);
      video.play();
      console.log(
        'IS VIDEO PLAYIN ? SHOULD BE true ',
        videoPageState.isVideoPlaying,
      );
    } else {
      video.pause();
      actions.setIsVideoPlaying(false);
      console.log(
        'IS VIDEO PLAYIN ? SHOULD BE false',
        videoPageState.isVideoPlaying,
      );
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        overflowX: 'scroll',
      }}
    >
      {videos.map((video, index) => (
        <div
          key={video.name}
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
                  preload="metadata"
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
