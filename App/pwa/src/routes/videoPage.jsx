import React, { useState, useEffect, useRef, useReducer } from 'react';
import Layout from './../components/userInterface/layout.jsx';
import newFileControll from '../components/utils/newFileControll.jsx';
import {
  ModalSettings,
  BluetoothConnection,
  ListVideos,
  Login,
} from '../components/userInterface/modalElementSet.js';
import { TopBarInformations } from '../components/utils/TopBarInformations.jsx';
import { getObjectStorageIndex } from '../components/db/storageObjectMethods.js';
import {
  videoPageReducer,
  initialState,
} from '../components/utils/reducer/videoPageReducer.js';

const OBJECT_STORE_USERDATA = `${process.env.OBJECT_STORE_USERDATA}`;
const OBJECT_STORE_USERDATA_OBJECTSTORAGE = `${process.env.OBJECT_STORE_USERDATA_OBJECTSTORAGE}`;
const INTERVAL_NEWVIDEO_CHECK = `${process.env.INTERVAL_NEWVIDEO_CHECK}`;

const VideoPage = () => {
  const [state, dispatch] = useReducer(videoPageReducer, initialState);
  const intervalRef = useRef(null);
  const storedFilesRef = useRef([]);
  const appIsActive = new Event('appIsActive');
  document.addEventListener('DOMContentLoaded', getUserData);
  window.addEventListener('userDataUpdated', getUserData);

  function setNewVideos(newVideos) {
    dispatch({ type: 'setNewVideos', payload: newVideos });
  }

  function setIsActive(status) {
    dispatch({ type: 'setIsActive', payload: status });
  }

  function setIsRequesting(status) {
    dispatch({ type: 'setIsRequesting', payload: status });
  }

  function setDisplayedVideos(videos) {
    dispatch({ type: 'setDisplayedVideos', payload: videos });
  }

  function setIsOnlineStatus() {
    dispatch({ type: 'setIsOnline', payload: navigator.onLine });
  }

  useEffect(() => {
    if (state.isActive) {
      window.dispatchEvent(appIsActive);
    }
  }, [state.isActive]);

  useEffect(() => {
    function handleNewVideoInIndexDB() {
      if (!state.isActive) {
        document.documentElement.style.filter = 'brightness(100%)';
        const audio = new Audio();
        audio.src = '/audio/sampleAudio.mp3';
        audio.autoplay = true;
      }
    }
    window.addEventListener('newVideoInIndexDB', handleNewVideoInIndexDB);
    return () => {
      window.removeEventListener('newVideoInIndexDB', handleNewVideoInIndexDB);
    };
  }, [state.isActive]);

  const handleDisplayBLEconnection = (isDisplayed) => {
    if (isDisplayed) {
      dispatch({ type: 'setDisplayBLEconnection', payload: true });
    }
  };

  const handleClickVideo = (e) => {
    const video = e.currentTarget;
    if (video.paused) {
      dispatch({ type: 'setIsVideoPlaying', payload: true });
      video.play();
    } else {
      video.pause();
      dispatch({ type: 'setIsVideoPlaying', payload: false });
    }
  };

  async function getUserData() {
    const resivedUserData = await getObjectStorageIndex(
      OBJECT_STORE_USERDATA,
      OBJECT_STORE_USERDATA_OBJECTSTORAGE,
      'adress01',
    );
    if (resivedUserData) {
      const result = resivedUserData.fileContext;
      dispatch({ type: 'setUserData', payload: result });
    }
  }

  useEffect(() => {
    setIsOnlineStatus();
    window.addEventListener('online', setIsOnlineStatus);
    window.addEventListener('offline', setIsOnlineStatus);
    return () => {
      window.removeEventListener('online', setIsOnlineStatus);
      window.removeEventListener('offline', setIsOnlineStatus);
    };
  }, []);

  const checkOnlineStatus = () => {
    if (state.userdata && state.isOnline && !state.isRequesting) {
      console.log('#--Checking for new Files--#');
      intervalRef.current = setInterval(() => {
        newFileControll(state.userdata, setNewVideos, setIsRequesting);
      }, INTERVAL_NEWVIDEO_CHECK);
    }
  };

  useEffect(() => {
    checkOnlineStatus();
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [state.userdata, state.isOnline, state.isRequesting]);

  return !state.userdata ? (
    <Login />
  ) : (
    <div>
      <Layout
        navbar_middle={
          state.userdata
            ? TopBarInformations(
                state.userdata,
                state.displayBLEconnection,
                state.isOnline,
              )
            : ''
        }
        navbar_right={<ModalSettings />}
        navbar_left={
          <BluetoothConnection
            newVideos={state.newVideos}
            currentBLEstatus={state.displayBLEconnection}
            handleDisplayBLEconnection={handleDisplayBLEconnection}
          />
        }
        newVideos={state.newVideos}
        isActive={state.isActive}
        setIsActive={setIsActive}
        setNewVideos={setNewVideos}
        videoamount={state.newVideos.length}
      >
        <ListVideos
          setIsActive={setIsActive}
          handleClickVideo={handleClickVideo}
          isVideoPlaying={state.isVideoPlaying}
          videos={state.displayedVideos}
          setVideos={setDisplayedVideos}
          storedFilesRef={storedFilesRef}
        />
      </Layout>
    </div>
  );
};
export default VideoPage;
