import React, { useEffect } from 'react';
import mainPageDispatcher from '../../actions/mainPageActions';
import { useWindowSize } from 'react-use';
import { DefaultScreen } from '../../common/helper/modalElementSet';
import TopBar from '../../common/components/layoutComponents/TopBar.jsx';
import '../../common/assets/style/layout.css';

const Layout = ({
  children,
  userdata,
  displayBLEconnection,
  isOnline,
  isActive,
  newVideos,
}) => {
  const { height } = useWindowSize();
  const topBarheight = height / 25;
  const fontSize = height / 23;
  const actions = mainPageDispatcher();

  const handleCloseModal = () => {
    actions.setIsActive(true);
    actions.setNewVideos([]);
  };
  useEffect(() => {
    console.log('isActive changed:', isActive);
  }, [isActive]);
  return (
    <div className="layout">
      <header className="layoutheader">
        <TopBar
          topBarheight={topBarheight}
          fontSize={fontSize}
          userdata={userdata}
          displayBLEconnection={displayBLEconnection}
          isOnline={isOnline}
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
