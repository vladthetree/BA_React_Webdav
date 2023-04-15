import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import checkAndProcessNewFiles from '../../common/helper/checkAndProcessNewFiles.jsx';
import { ListVideos, Login } from '../../common/helper/modalElementSet.js';
import {
  getConvertedBlobVideos,
  getObjectStorageIndex,
} from '../../common//db/storageObjectMethods.js';
import mainPageDispatcher from '../../actions/mainPageActions.js';
import Layout from '../layout/layout.jsx';

const OBJECT_STORE_USERDATA = `${process.env.OBJECT_STORE_USERDATA}`;
const OBJECT_STORE_USERDATA_OBJECTSTORAGE = `${process.env.OBJECT_STORE_USERDATA_OBJECTSTORAGE}`;
const INTERVAL_NEWVIDEO_CHECK = `${process.env.INTERVAL_NEWVIDEO_CHECK}`;
const DATABASE_VIDEOS = `${process.env.DATABASE_VIDEOS}`;
const OBJECT_STORE_VIDEOS = `${process.env.OBJECT_STORE_VIDEOS}`;

const MainPage = () => {
  const videoPageState = useSelector(
    (videoPageState) => videoPageState.videoPageReducer,
  );
  const selectAvailableVideos = (state) => state.videoPageReducer.availableVideos;

  const actions = mainPageDispatcher();

  const intervalRef = useRef(null);
  const appIsActive = new Event('appIsActive');
  document.addEventListener('DOMContentLoaded', getUserData);
  window.addEventListener('userDataUpdated', getUserData);

  useEffect(() => {
    if (videoPageState.isActive) {
      window.dispatchEvent(appIsActive);
    } else if (
      !videoPageState.isActive &&
      videoPageState.displayedVideos.length === 0
    ) {
      preloadVideos();
    }
  }, [videoPageState.isActive]);

  useEffect(() => {
    function handleNewVideoInIndexDB() {
      if (!videoPageState.isActive) {
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
  }, [videoPageState.isActive]);

  async function getUserData() {
    const resivedUserData = await getObjectStorageIndex(
      OBJECT_STORE_USERDATA,
      OBJECT_STORE_USERDATA_OBJECTSTORAGE,
      'adress01',
    );
    if (resivedUserData) {
      const resultUserData = resivedUserData.fileContext;
      actions.setUserData(resultUserData);
    }
  }
  useEffect(() => {
    actions.setIsOnlineStatus();
    window.addEventListener('online', () => actions.setIsOnlineStatus());
    window.addEventListener('offline', () => actions.setIsOnlineStatus());
    return () => {
      window.removeEventListener('online', () => actions.setIsOnlineStatus());
      window.removeEventListener('offline', () => actions.setIsOnlineStatus());
    };
  }, []);
  const checkOnlineStatus = () => {
    if (
      videoPageState.userdata &&
      videoPageState.isOnline &&
      !videoPageState.isRequesting
    ) {
      console.log('#--Checking for new Files--#');
      intervalRef.current = setInterval(() => {
        console.log(videoPageState);
        checkAndProcessNewFiles(
          videoPageState.userdata,
          actions,
          selectAvailableVideos,
          DATABASE_VIDEOS,
          OBJECT_STORE_VIDEOS,
        );
      }, INTERVAL_NEWVIDEO_CHECK);
    }
  };

  useEffect(() => {
    checkOnlineStatus();
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [
    videoPageState.userdata,
    videoPageState.isOnline,
    videoPageState.isRequesting,
  ]);

  async function preloadVideos() {
    const storedFiles = await getConvertedBlobVideos();
    actions.setDisplayedVideos(storedFiles);
  }

  return !videoPageState.userdata ? (
    <Login
      OBJECT_STORE_USERDATA={OBJECT_STORE_USERDATA}
      OBJECT_STORE_USERDATA_OBJECTSTORAGE={OBJECT_STORE_USERDATA_OBJECTSTORAGE}
    />
  ) : (
    <div>
      <Layout
        userdata={videoPageState.userdata}
        newVideos={videoPageState.newVideos}
        displayBLEconnection={videoPageState.existBLEconnection}
        isOnline={videoPageState.isOnline}
        isActive={videoPageState.isActive}
      >
        <ListVideos
          videos={videoPageState.displayedVideos}
          isActive={videoPageState.isActive}
          isVideoPlaying={videoPageState.isVideoPlaying}
        />
      </Layout>
    </div>
  );
};
export default MainPage;
