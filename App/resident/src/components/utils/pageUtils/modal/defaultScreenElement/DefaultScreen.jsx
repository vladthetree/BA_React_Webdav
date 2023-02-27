import React, { useEffect, useState } from 'react';
import '../../../../style/defaultScreen.css';
import { useWindowSize } from 'react-use';
import Swipe from '../../../../svgs/Swipe.jsx';

const DefaultScreen = ({ handleCloseModal, newVideosAmount }) => {
  const { width, height } = useWindowSize();
  const [startX, setStartX] = useState(null);

  console.log('SAMPLE');
  console.log(newVideosAmount);

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
                <div className="defaultScreen-inner-right">{newVideosAmount}</div>
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
};

export default DefaultScreen;
