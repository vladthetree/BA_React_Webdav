import React, { useEffect, useState } from 'react';
import '../../../style/defaultScreen.css';
import { useWindowSize } from 'react-use';
import Swipe from '../../../svgs/Swipe.jsx';

export default function DefaultScreen({ handleCloseModal, videoamount }) {
  const { width, height } = useWindowSize();
  const [startX, setStartX] = useState(null);

  function handleTouchStart(e) {
    setStartX(e.touches[0].clientX);
  }
  function handleTouchMove(e) {
    const deltaY = e.touches[0].clientX - startX;
    console.log(`DELTA ${deltaY}`);
    if (deltaY > 0) {
      console.log('right');
      handleCloseModal();
    } else {
      console.log('left');
      handleCloseModal();
    }
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className="defaultScreen-outerContainer"
    >
      <div className="defaultScreen-innerContainer">
        <div className="defaultScreen-Columns">
          <div className="defaultScreen-SideContainer">
            <Swipe />
          </div>
          <div className="defaultScreen-MidContainer">
            <div className="defaultScreen-ActionContainer">
              <div className="defaultScreen-ActionContaner-inner">
                <div className="defaultScreen-inner-left">NEW VIDEOS</div>
                <div className="defaultScreen-inner-right">{videoamount}</div>
              </div>
            </div>
          </div>
          <div className="defaultScreen-SideContainer">
            <Swipe
              style={{
                height: height * 0.5,
                width: width * 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
