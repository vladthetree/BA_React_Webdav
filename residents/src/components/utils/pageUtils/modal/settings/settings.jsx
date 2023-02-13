import React, { useState, useEffect } from "react";
import "../../../../style/settings.css";
import { deleteDBFromIndexDB } from "../../../db/storageObjectMethodes.jsx";

const DATABASE_VIDEOS = "db";
const OBJECT_STORE_VIDEOS = "videos";
const DATABASE_USERDATA = "userData";
const OBJECT_STORE_CUSTOMER = "customer";

const Settings = ({ onClose, newVideos, setNewVideos }) => {
  const [displayedArray, setDisplayedArray] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(document.fullscreenElement)
  const deleteAllVideos = async () => {
    await deleteDBFromIndexDB(DATABASE_VIDEOS);
    await deleteDBFromIndexDB(undefined);
    setTimeout(() => {
      location.reload();
    }, 100);
  };
  const deleteAll = async () => {
    await Promise.all([
      deleteDBFromIndexDB(DATABASE_VIDEOS),
      deleteDBFromIndexDB(DATABASE_USERDATA),
    ]);
    setTimeout(() => {
      location.reload();
    }, 200);
  };
  const reloadPage = async () => {
    setTimeout(() => {
      location.reload();
    }, 50);
  };
  const markAsSeen = async () => {
    setNewVideos(0);
    setTimeout(() => {
      location.reload();
    }, 50);
  };
  const fullScreen = async () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
    } else {
      document.exitFullscreen();
    }
  };

const presentationMode = async() => {
  try {
    const presentationRequest = new PresentationRequest("http://localhost:8080/");
    const presentationConnection = await presentationRequest.start();
    presentationConnection.addEventListener("connect", event => {
      // Send a message to the presentation display to enter presentation mode
      presentationConnection.send("enterPresentationMode");
    });
  } catch (error) {
    // Handle the error
  }
}

  const primeMethodes = [
    {
      name: "Delete Videos",
      value: "Delete All Videos from DB.",
      status: deleteAllVideos,
    },
    {
      name: "DeleteAll",
      value: "Deletes videos and useraccount",
      status: deleteAll,
    },
    {
      name: "Reload",
      value: "Resets the page",
      status: reloadPage,
    },
    {
      name: "Mark as Seen",
      value:
        newVideos === 0
          ? "No new Videos to watch"
          : `They are ${newVideos} new Videos to watch!`,
      status: newVideos === 0 ? "" : markAsSeen,
    },
    {
      name: document.fullscreenElement ? "Close Fullscreen" : "Fullscreen",
      value: document.fullscreenElement
        ? "Close Fullscreen"
        : "Enables Fullscreen",
      status: fullScreen,
    },
    {
      name:"Prasentation Mode",
      value:"This will open the application in Presentation mode",
      status: presentationMode,
    }
  ];

  useEffect(() => {
    setDisplayedArray(primeMethodes);
  }, []);

  console.log(displayedArray);

  return (
    <div className="outer-container">
      <div className="innerContainer-Settings">
        <div className="settings-container">
          <div className="settings-upper-row ">
            <div className="settings-beginning-side settings-top-font ">
              Options
            </div>
            <div className="settings-mid-side settings-top-font">
              Explaination
            </div>
            <button className="settings-button" onClick={onClose}>
              X
            </button>
          </div>
          <div className="settings-options">
            {displayedArray.map((item, index) => (
              <div key={index} className="settings-list">
                <div className="settings-beginning-side settings-list-font">
                  {item.name}
                </div>
                <div className="settings-mid-side settings-list-font">
                  {item.value}
                </div>
                <div className="settings-end-side">
                  <button
                    className="settings-list-button "
                    onClick={() => {
                      if (typeof item.status === "function") {
                        item.status();
                      }
                    }}
                  >
                    Activate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
