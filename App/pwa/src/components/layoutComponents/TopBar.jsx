import React from 'react';
import { TopBarInformations } from './TopBarInformations.jsx';
import { ModalSettings, BluetoothConnection } from '../modalElementSet.js';
export default function TopBar({
  topBarheight,
  fontSize,
  userdata,
  displayBLEconnection,
  isOnline,
  handleDisplayBLEconnection,
  newVideos,
}) {
  return (
    <nav className="topBar" style={{ height: topBarheight }}>
      <div className="topBar_left_wrapper">
        <div className="topBar_left">
          {
            <BluetoothConnection
              newVideos={newVideos}
              currentBLEstatus={displayBLEconnection}
              handleDisplayBLEconnection={handleDisplayBLEconnection}
            />
          }
        </div>
      </div>
      <div className="topBar_middle" style={{ fontSize }}>
        {TopBarInformations(userdata, displayBLEconnection, isOnline)}
      </div>
      <div className="topBar_left_wrapper">
        <div className="topBar_left">{<ModalSettings />}</div>
      </div>
    </nav>
  );
}
