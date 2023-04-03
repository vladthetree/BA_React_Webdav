import { ListVideos } from '../components/utils/pageUtils/listVideos.jsx';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Layout from '../components/layout/layout.jsx';
import { hasObjectStorageDatabase } from '../components/db/storageObjectMethodes.jsx';
import { getObjectStorageIndex } from '../components/db/storageObjectMethodes.jsx';
import { NewFileControll } from '../components/utils/NewFileControll.jsx';
import ModalSettings from '../components/utils/pageUtils/modal/settings/ModalSettings.jsx';
import { ScanConnection } from '../components/utils/pageUtils/modal/BLE/ScanConnection.jsx';

const OBJECT_STORE_USERDATA = 'userData';
const OBJECT_STORE_USERDATA_OBJECTSTORAGE = 'customer';
const OBJECT_STORE_VIDEOS = 'db';
const OBJECT_STORE_VIDEOS_OBJECTSTORAGE = 'videos';

const VideoPage = () => {
  const [dbExist, setDbExist] = useState(false);
  const [newVideos, setNewVideos] = useState([]);
  const [userdata, setUserData] = useState();
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [displayBLEconnection, setdisplayBLEconnection] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [displayedVideos, setDisplayedVideos] = useState([]);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [memoryObject, setMemoryObject] = useState([]);
  const [isRequesting, setIsRequesting] = useState(false);
  const intervalRef = useRef(null);

  console.log('dislayed Videos');
  console.log(displayedVideos);

  const storedFilesRef = useRef([]);

  const handleMemorizeObject = (someObject) => {
    setMemoryObject(someObject);
  };

  const handleDisplayBLEconnection = (isDisplayed) => {
    if (isDisplayed) {
      setdisplayBLEconnection(true);
    }
  };

  const handleNewVideos = () => {
    if (isActive) {
      setNewVideos([]);
    }
  };

  const handleClickVideo = (e) => {
    const video = e.currentTarget;
    if (video.paused) {
      setIsVideoPlaying(true);
      video.play();
    } else {
      video.pause();
      setIsVideoPlaying(false);
    }
  };

  window.addEventListener('userDataUpdated', async () => {
    const resivedUserData = await getObjectStorageIndex(
      OBJECT_STORE_USERDATA,
      OBJECT_STORE_USERDATA_OBJECTSTORAGE,
      'adress01',
    );
    if (resivedUserData) {
      const result = resivedUserData.fileContext;
      setUserData(result);
    }
  });

  document.addEventListener('DOMContentLoaded', async () => {
    const resivedUserData = await getObjectStorageIndex(
      OBJECT_STORE_USERDATA,
      OBJECT_STORE_USERDATA_OBJECTSTORAGE,
      'adress01',
    );
    if (resivedUserData) {
      const result = resivedUserData.fileContext;
      setUserData(result);
    }
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (dbExist === false) {
      const hasVideos = async () => {
        let exist = await hasObjectStorageDatabase('db', 'videos');

        setDbExist(exist);
      };
      hasVideos();
    }
  }, [dbExist]);

  const checkOnlineStatus = () => {
    if (userdata && isOnline && !isRequesting) {
      intervalRef.current = setInterval(() => {
        NewFileControll(userdata, setNewVideos, setIsRequesting);
      }, 20000);
    }
  };

  useEffect(() => {
    checkOnlineStatus();
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [userdata, isOnline, isRequesting]);

  const displayName = () => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            height: `${1.5}vw`,
            width: `${1.5}vw`,
            backgroundColor: displayBLEconnection ? 'green' : 'red',
            display: 'inline-block',
            marginRight: '5px',
          }}
        />
        <div
          style={{
            height: `${1.5}vw`,
            width: `${1.5}vw`,
            backgroundColor: isOnline ? 'green' : 'red',
            borderRadius: '50%',
            display: 'inline-block',
            marginRight: '5px',
          }}
        />
        <div
          style={{
            width: 0,
            height: 0,
            borderTop: `${1.5}vw solid ${(function () {
              if ('serviceWorker' in navigator) {
              } else {
                console.log(' SERVICEWORER IST NICHT IM NAVIGATOR');
              }

              try {
                return navigator.serviceWorker.controller ? 'green' : 'red';
              } catch (e) {
                console.error('Error in navigator code:', e);
                return 'gray';
              }
            })()}`,
            borderLeft: `${0.75}vw solid transparent`,
            borderRight: `${0.75}vw solid transparent`,
            display: 'inline-block',
            marginRight: '5px',
          }}
        />
        &nbsp; &nbsp;
        <div>
          Logged: &nbsp; {userdata.username}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      </div>
    );
  };

  return (
    <div>
      <Layout
        userdata={userdata}
        handleNewVideos={handleNewVideos}
        newVideos={newVideos}
        isActive={isActive}
        setIsActive={setIsActive}
        setNewVideos={setNewVideos}
        memoryObject={memoryObject}
        videoamount={newVideos.length}
        navbar_left={
          <ScanConnection
            newVideos={newVideos}
            currentBLEstatus={displayBLEconnection}
            handleDisplayBLEconnection={handleDisplayBLEconnection}
          />
        }
        navbar_middle={userdata ? displayName() : ''}
        navbar_right={<ModalSettings />}
      >
        {dbExist && (
          <ListVideos
            setIsActive={setIsActive}
            handleClickVideo={handleClickVideo}
            isVideoPlaying={isVideoPlaying}
            videos={displayedVideos}
            setVideos={setDisplayedVideos}
            storedFilesRef={storedFilesRef}
            handleMemorizeObject={handleMemorizeObject}
          />
        )}
      </Layout>
    </div>
  );
};
export default VideoPage;
