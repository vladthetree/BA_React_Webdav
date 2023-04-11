import React, { useEffect } from 'react';
import { useWindowSize } from 'react-use';
import { DefaultScreen } from '../../components/modalElementSet';
import TopBar from '../../components/layoutComponents/TopBar.jsx';
import '../../assets/style/layout.css';

const Layout = ({
  topBar_left,
  children,
  userdata,
  displayBLEconnection,
  isOnline,
  isActive,
  setIsActive,
  newVideos,
  setNewVideos,
  handleDisplayBLEconnection,
}) => {
  const { height } = useWindowSize();
  const topBarheight = height / 25;
  const fontSize = height / 23;

  const handleCloseModal = () => {
    setIsActive(true);
    setNewVideos([]);
  };
  useEffect(() => {
    console.log('isActive changed:', isActive);
  }, [isActive]);
  return (
    <div className="layout">
      <header className="layoutheader">
        <TopBar
          topBar_left={topBar_left}
          topBarheight={topBarheight}
          fontSize={fontSize}
          userdata={userdata}
          displayBLEconnection={displayBLEconnection}
          isOnline={isOnline}
          handleDisplayBLEconnection={handleDisplayBLEconnection}
          newVideos={newVideos}
        />
      </header>
      <div style={{ height: height - topBarheight }}>
        {isActive ? (
          <main className="layoutbody">{children}</main>
        ) : (
          <DefaultScreen
            handleCloseModal={handleCloseModal}
            videoamount={newVideos.length}
          />
        )}
      </div>
    </div>
  );
};

export default Layout;
