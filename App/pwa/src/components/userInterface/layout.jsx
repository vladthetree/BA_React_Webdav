import React, { useEffect, useState, useRef } from 'react';
import '../style/layout.css';
import { useWindowSize } from 'react-use';
import DefaultScreen from './modalElements/defaultScreenElement/DefaultScreen.jsx';
import ModalLogin from './modalElements/login/ModalLogin.jsx';

const Layout = ({
  navbar_left,
  navbar_middle,
  navbar_right,
  children,
  userdata,
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

  return !userdata ? (
    <ModalLogin />
  ) : (
    <div className="layout">
      <header className="layoutheader">
        <nav
          className="navbar"
          style={{
            height: navbarheight,
          }}
        >
          <div className="navbar_left_wrapper">
            <div className="navbar_left">{navbar_left}</div>
          </div>
          <div className="navbar_middle" style={{ fontSize: `${fontSize}px` }}>
            {navbar_middle}
          </div>
          <div className="navbar_left_wrapper">
            <div className="navbar_left">{navbar_right}</div>
          </div>
        </nav>
      </header>
      <div style={{ height: height - navbarheight }}>
        {!isActive ? (
          <DefaultScreen
            handleCloseModal={handleCloseModal}
            videoamount={videoamount}
          />
        ) : (
          <main className="layoutbody">{children}</main>
        )}
      </div>
    </div>
  );
};

export default Layout;
