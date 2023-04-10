import React, { useEffect } from 'react';
import { useWindowSize } from 'react-use';
import { DefaultScreen } from '../modalElementSet';
import { TopBar } from './TopBar.jsx';
import '../style/layout.css';

const Layout = ({
  topBar_left,
  topBar_middle,
  topBar_right,
  children,
  isActive,
  setIsActive,
  setNewVideos,
  videoamount,
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
          topBar_middle={topBar_middle}
          topBar_right={topBar_right}
          topBarheight={topBarheight}
          fontSize={fontSize}
        />
      </header>
      <div style={{ height: height - topBarheight }}>
        {isActive ? (
          <main className="layoutbody">{children}</main>
        ) : (
          <DefaultScreen
            handleCloseModal={handleCloseModal}
            videoamount={videoamount}
          />
        )}
      </div>
    </div>
  );
};

export default Layout;
