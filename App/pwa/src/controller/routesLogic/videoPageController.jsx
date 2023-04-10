import React, { useEffect, useRef, useReducer } from 'react';
import newFileControll from '../newFileControll.jsx';
import { getObjectStorageIndex } from '../../model/db/storageObjectMethods.js';
import {
  videoPageReducer,
  initialState,
} from '../../utils/reducer/videoPageReducer.js';

const OBJECT_STORE_USERDATA = `${process.env.OBJECT_STORE_USERDATA}`;
const OBJECT_STORE_USERDATA_OBJECTSTORAGE = `${process.env.OBJECT_STORE_USERDATA_OBJECTSTORAGE}`;
const INTERVAL_NEWVIDEO_CHECK = `${process.env.INTERVAL_NEWVIDEO_CHECK}`;

const VideoPageController = ({ children }) => {
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

  const handleDisplayBLEconnection = (isDisplayed) => {
    if (isDisplayed) {
      dispatch({ type: 'setDisplayBLEconnection', payload: true });
    }
  };

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

  const contextValue = {
    state: state,
    dispatch: dispatch,
    handleDisplayBLEconnection: handleDisplayBLEconnection,
    setter: {
      setNewVideos: setNewVideos,
      setIsActive: setIsActive,
      setIsRequesting: setIsRequesting,
      setDisplayedVideos: setDisplayedVideos,
      setIsOnlineStatus: setIsOnlineStatus,
    },
  };

  return <div>{children({ contextValue })}</div>;
};

export default VideoPageController;
