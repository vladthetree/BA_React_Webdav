import { ListVideos } from "../components/utils/pageUtils/listVideos.jsx";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Layout from "../components/layout/layout.jsx";
import { hasObjectStorageDatabase } from "../components/db/storageObjectMethodes.jsx";
import { getObjectStorageIndex } from "../components/db/storageObjectMethodes.jsx";
import { NewFileControll } from "../components/utils/NewFileControll.jsx";
import ModalSettings from "../components/utils/pageUtils/modal/settings/ModalSettings.jsx";
import { ScannConnection } from "../components/utils/pageUtils/modal/BLE/ScannConnection.jsx";

const OBJECT_STORE_USERDATA = "userData";
const OBJECT_STORE_USERDATA_OBJECTSTORAGE = "customer";

const VideoPage = () => {
  const [dbExist, setDbExist] = useState(false);
  const [newVideos, setNewVideos] = useState([]);
  const [userdata, setUserData] = useState();
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [displayBLEconnection, setdisplayBLEconnection] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [displayedVideos, setDisplayedVideos] = useState([]);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  let videoAmount = newVideos.length;

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

  useEffect(() => {
    const getData = async () => {
      const resivedUserData = await getObjectStorageIndex(
        OBJECT_STORE_USERDATA,
        OBJECT_STORE_USERDATA_OBJECTSTORAGE,
        "adress01"
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
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // opt here
  useEffect(() => {
    if (dbExist === false) {
      const hasVideos = async () => {
        let exist = await hasObjectStorageDatabase("db", "videos");
        setDbExist(exist);
      };
      hasVideos();
    }
  }, [dbExist]);

  useEffect(() => {
    if (userdata && isOnline) {
      console.log("#-- User is online --#");
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            height: "10px",
            width: "10px",
            backgroundColor: displayBLEconnection ? "green" : "red",
            display: "inline-block",
            marginRight: "5px",
          }}
        />
        <div
          style={{
            height: "10px",
            width: "10px",
            backgroundColor: isOnline ? "green" : "red",
            borderRadius: "50%",
            display: "inline-block",
            marginRight: "5px",
          }}
        />
        <div>Logged : {userdata.username} ------- </div>
        <div>Today: {new Date().toLocaleDateString("de-DE")}</div>
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
        navbar_left={
          <ScannConnection
            newVideosAmount={videoAmount}
            currentBLEstatus={displayBLEconnection}
            handleDisplayBLEconnection={handleDisplayBLEconnection}
          />
        }
        navbar_middle={userdata ? displayName() : ""}
        navbar_right={<ModalSettings />}
      >
        {dbExist && (
          <ListVideos
            setIsActive={setIsActive}
            handleClickVideo={handleClickVideo}
            isVideoPlaying={isVideoPlaying}
            videos={displayedVideos}
            setVideos={setDisplayedVideos}
          />
        )}
      </Layout>
    </div>
  );
};
export default VideoPage;
