import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import mainPageDispatcher from '../../actions/mainPageActions.js';
import Layout from '../layout/layout.jsx';
import newFileControll from '../../controller/newFileControll.jsx';
import { ListVideos, Login } from '../../components/modalElementSet.js';
import { getObjectStorageIndex } from '../../model/db/storageObjectMethods.js';

const OBJECT_STORE_USERDATA = `${process.env.OBJECT_STORE_USERDATA}`;
const OBJECT_STORE_USERDATA_OBJECTSTORAGE = `${process.env.OBJECT_STORE_USERDATA_OBJECTSTORAGE}`;
const INTERVAL_NEWVIDEO_CHECK = `${process.env.INTERVAL_NEWVIDEO_CHECK}`;

const MainPage = () => {
  const videoPageState = useSelector(
    (videoPageState) => videoPageState.videoPageReducer,
  );
  const actions = mainPageDispatcher();

  const intervalRef = useRef(null);
  const appIsActive = new Event('appIsActive');
  document.addEventListener('DOMContentLoaded', getUserData);
  window.addEventListener('userDataUpdated', getUserData);

  useEffect(() => {
    if (videoPageState.isActive) {
      window.dispatchEvent(appIsActive);
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
        newFileControll(videoPageState.userdata, actions);
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

  return !videoPageState.userdata ? (
    <Login />
  ) : (
    <div>
      <Layout
        userdata={videoPageState.userdata}
        newVideos={videoPageState.newVideos}
        displayBLEconnection={videoPageState.existBLEconnection}
        isOnline={videoPageState.isOnline}
        isActive={videoPageState.isActive}
      >
        <ListVideos videos={videoPageState.displayedVideos} />
      </Layout>
    </div>
  );
};
export default MainPage;
