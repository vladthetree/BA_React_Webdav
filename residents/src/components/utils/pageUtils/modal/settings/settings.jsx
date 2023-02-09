import React from "react";
import "../../../../style/settings.css";

const Settings = ({ onClose }) => {
  const myArray = [
    { name: "text1", value: "value1", status:true},
    { name: "text2", value: "value2", status:true },
    { name: "text3", value: "value3", status:true },
    { name: "text4", value: "value4", status:true },
    { name: "text5", value: "value5", status:true },
    { name: "text6", value: "value6", status:true },
    { name: "text7", value: "value7", status:true },
  ];
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
            {myArray.map((item, index) => (
              <div key={index} className="settings-list ">
                <div className="settings-beginning-side settings-list-font">
                  {item.name}
                </div>
                <div className="settings-mid-side settings-list-font">
                  {item.value}
                </div>
                <div className="settings-list-itemStatus">
                  <div className=""></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// {listData.map((item, index) => (
//   <div key={index} className="list-item" style={{ height: "15%" }}>
//       <p>{`${item.name}: ${item.value}`}</p>
//   </div>
// ))}

export default Settings;
