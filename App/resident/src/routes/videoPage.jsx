import { ListVideos } from '../components/utils/pageUtils/listVideos.jsx';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Layout from '../components/layout/layout.jsx';
import { hasObjectStorageDatabase } from '../components/db/storageObjectMethodes.jsx';
import { getObjectStorageIndex } from '../components/db/storageObjectMethodes.jsx';
import { NewFileControll } from '../components/utils/NewFileControll.jsx';
import ModalSettings from '../components/utils/pageUtils/modal/settings/ModalSettings.jsx';
import { ScannConnection } from '../components/utils/pageUtils/modal/BLE/ScannConnection.jsx';

const OBJECT_STORE_USERDATA = 'userData';
const OBJECT_STORE_USERDATA_OBJECTSTORAGE = 'customer';
const OBJECT_STORE_VIDEOS = 'db';
const OBJECT_STORE_VIDEOS_OBJECTSTORAGE = 'videos';
const REMINDER = 'Reminder.json';

const VideoPage = () => {
  const [dbExist, setDbExist] = useState(false);
  const [newVideos, setNewVideos] = useState([]);
  const [userdata, setUserData] = useState();
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [displayBLEconnection, setdisplayBLEconnection] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [displayedVideos, setDisplayedVideos] = useState([]);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [reminder, setReminder] = useState([]);
  const [memoryObject, setMemoryObject] = useState([]);

  const storedFilesRef = useRef([]);

  const handleMemorizeObject = someObject => {
    setMemoryObject(someObject);
  };

  useEffect(() => {
    const getData = async () => {
      const reminder = await getObjectStorageIndex(
        OBJECT_STORE_VIDEOS,
        OBJECT_STORE_VIDEOS_OBJECTSTORAGE,
        REMINDER,
      );
      if (reminder) {
        setReminder(Object.keys(reminder.fileContext));
      }
    };
    getData();
  }, []);

  let videoAmount = newVideos.length;

  const handleDisplayBLEconnection = isDisplayed => {
    if (isDisplayed) {
      setdisplayBLEconnection(true);
    }
  };

  const handleNewVideos = () => {
    if (isActive) {
      setNewVideos([]);
    }
  };

  const handleClickVideo = e => {
    console.log(e);
    const video = e.currentTarget;
    if (video.paused) {
      setIsVideoPlaying(true);
      video.play();
    } else {
      video.pause();
      setIsVideoPlaying(false);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const resivedUserData = await getObjectStorageIndex(
        OBJECT_STORE_USERDATA,
        OBJECT_STORE_USERDATA_OBJECTSTORAGE,
        'adress01',
      );
      if (resivedUserData) {
        const result = resivedUserData.fileContext;
        setUserData(result);
      }
    };

    if (!userdata) {
      const interval = setInterval(() => {
        getData();
      }, 500);
      return () => clearInterval(interval);
    }
  }, [userdata]);

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

  // opt here
  useEffect(() => {
    if (dbExist === false) {
      const hasVideos = async () => {
        let exist = await hasObjectStorageDatabase('db', 'videos');
        console.log();
        setDbExist(exist);
      };
      hasVideos();
    }
  }, [dbExist]);

  useEffect(() => {
    if (userdata && isOnline) {
      console.log('#-- User is online --#');
      const downloadVideos = setInterval(() => {
        NewFileControll(userdata, setNewVideos);
      }, 5000);
      return () => clearInterval(downloadVideos);
    } else {
    }
  }, [userdata, isOnline]);

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
                
              }else{
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
        videoAmount={videoAmount}
        isActive={isActive}
        setIsActive={setIsActive}
        setNewVideos={setNewVideos}
        memoryObject={memoryObject}
        navbar_left={
          <ScannConnection
            newVideosAmount={videoAmount}
            currentBLEstatus={displayBLEconnection}
            handleDisplayBLEconnection={handleDisplayBLEconnection}
          />
        }
        navbar_middle={userdata ? displayName() : ''}
        navbar_right={<ModalSettings />}
      >
        {dbExist && (
          <ListVideos
            reminder={reminder}
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
