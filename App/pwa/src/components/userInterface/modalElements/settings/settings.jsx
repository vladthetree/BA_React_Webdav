import React, { useState, useEffect } from 'react';
import "../../../style/settings.css";
import { deleteDBFromIndexDB } from '../../../db/storageObjectMethodes.jsx';
const DATABASE_VIDEOS = 'db';
const DATABASE_USERDATA = 'userData';

const Settings = ({ onClose }) => {
  const [displayedArray, setDisplayedArray] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(document.fullscreenElement);
  const deleteAllVideos = async () => {
    await deleteDBFromIndexDB(DATABASE_VIDEOS);
    await deleteDBFromIndexDB(undefined);
  };

  const deleteAll = async () => {
    await Promise.all([
      deleteDBFromIndexDB(DATABASE_VIDEOS),
      deleteDBFromIndexDB(DATABASE_USERDATA),
    ]);
    setTimeout(() => {
      window.location.href = window.location.href;
    }, 250);
  };
  const reloadPage = async () => {
    setTimeout(() => {
      window.location.href = window.location.href;
    }, 100);
  };

  // const presentationMode = async () => {
  // 	try {
  // 		const presentationRequest = new PresentationRequest(
  // 			"http://localhost:8080/",
  // 		);
  // 		const presentationConnection = await presentationRequest.start();
  // 		presentationConnection.addEventListener("connect", (event) => {
  // 			// Send a message to the presentation display to enter presentation mode
  // 			presentationConnection.send("enterPresentationMode");
  // 		});
  // 	} catch (error) {
  // 		// Handle the error
  // 	}
  // };

  const primeMethodes = [
    {
      name: 'Delete all\nvideos.',
      value: 'Delets all videos in indexDB.',
      status: deleteAllVideos,
    },
    {
      name: 'Reset',
      value: '!Resets the App.\nDeletes useraccount and all videos!',
      status: deleteAll,
    },
    {
      name: 'Reload',
      value: 'Reloads the page.',
      status: reloadPage,
    },
    // {
    // 	name: "Prasentation Mode",
    // 	value: "This will open the application in Presentation mode",
    // 	status: presentationMode,
    // },
  ];

  useEffect(() => {
    setDisplayedArray(primeMethodes);
  }, []);
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
                      if (typeof item.status === 'function') {
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
