import React, { useEffect } from 'react';
import { useWindowSize } from 'react-use';
import { DefaultScreen } from './modalElementSet';
import '../style/layout.css';

const Layout = ({
  navbar_left,
  navbar_middle,
  navbar_right,
  children,
  isActive,
  setIsActive,
  setNewVideos,
  videoamount,
}) => {
  const { height } = useWindowSize();
  const navbarheight = height / 25;
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
        <nav className="navbar" style={{ height: navbarheight }}>
          <div className="navbar_left_wrapper">
            <div className="navbar_left">{navbar_left}</div>
          </div>
          <div className="navbar_middle" style={{ fontSize }}>
            {navbar_middle}
          </div>
          <div className="navbar_left_wrapper">
            <div className="navbar_left">{navbar_right}</div>
          </div>
        </nav>
      </header>
      <div style={{ height: height - navbarheight }}>
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
