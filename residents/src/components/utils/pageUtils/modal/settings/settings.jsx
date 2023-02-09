import React, { useState, useEffect } from "react";
import "../../../../style/settings.css";

const Settings = ({ onClose, userdataArray }) => {
  const [displayedArray, setDisplayedArray] = useState([]);

  useEffect(() => {
    if (userdataArray && userdataArray.length > 0) {
      setDisplayedArray([...userdataArray]);
    }
  }, [userdataArray]);

  console.log(displayedArray);



  return (
    <div className="outer-container">
      <div className="innerContainer-Settings">
        <div className="settings-container">
          <div className="settings-upper-row ">
            <div className="settings-beginning-side settings-top-font ">
              Optionen
            </div>
            <div className="settings-mid-side settings-top-font">
              Einstellungen
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
                  {item.status ? "delete" : "delete"}
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
