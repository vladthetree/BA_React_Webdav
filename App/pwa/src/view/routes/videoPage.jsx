import React, { useEffect, useRef, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layout from '../layout/layout.jsx';
import newFileControll from './../../controller/newFileControll.jsx';
import {
  ModalSettings,
  BluetoothConnection,
  ListVideos,
  Login,
} from '../modalElementSet.js';
import { TopBarInformations } from '../layout/TopBarInformations.jsx';
import { getObjectStorageIndex } from '../../model/db/storageObjectMethods.js';

const OBJECT_STORE_USERDATA = `${process.env.OBJECT_STORE_USERDATA}`;
const OBJECT_STORE_USERDATA_OBJECTSTORAGE = `${process.env.OBJECT_STORE_USERDATA_OBJECTSTORAGE}`;
const INTERVAL_NEWVIDEO_CHECK = `${process.env.INTERVAL_NEWVIDEO_CHECK}`;

const VideoPage = () => {
  const videoPageState = useSelector(
    (videoPageState) => videoPageState.videoPageReducer,
  );
  const dispatch = useDispatch();

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
    console.log('I GET TRIGGERED');
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
    if (
      videoPageState.userdata &&
      videoPageState.isOnline &&
      !videoPageState.isRequesting
    ) {
      console.log('#--Checking for new Files--#');
      intervalRef.current = setInterval(() => {
        newFileControll(videoPageState.userdata, setNewVideos, setIsRequesting);
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
        topBar_left={
          <BluetoothConnection
            newVideos={videoPageState.newVideos}
            currentBLEstatus={videoPageState.displayBLEconnection}
            handleDisplayBLEconnection={handleDisplayBLEconnection}
          />
        }
        topBar_middle={
          videoPageState.userdata
            ? TopBarInformations(
                videoPageState.userdata,
                videoPageState.displayBLEconnection,
                videoPageState.isOnline,
              )
            : ''
        }
        topBar_right={<ModalSettings />}
        newVideos={videoPageState.newVideos}
        isActive={videoPageState.isActive}
        setIsActive={setIsActive}
        setNewVideos={setNewVideos}
        videoamount={videoPageState.newVideos.length}
      >
        <ListVideos
          setIsActive={setIsActive}
          handleClickVideo={handleClickVideo}
          isVideoPlaying={videoPageState.isVideoPlaying}
          videos={videoPageState.displayedVideos}
          setVideos={setDisplayedVideos}
          storedFilesRef={storedFilesRef}
        />
      </Layout>
    </div>
  );
};
export default VideoPage;
