import React from 'react';
import Layout from './../layout/layout.jsx';
import {
  ModalSettings,
  BluetoothConnection,
  ListVideos,
  Login,
} from '../modalElementSet.js';
import { TopBarInformations } from '../layout/TopBarInformations.jsx';

const VideoPageView = (props) => {
  const { state, dispatch, setter, handleDisplayBLEconnection } =
    props.contextValue;

  console.log(props.contextValue);

  const handleClickVideo = (e) => {
    const video = e.currentTarget;
    if (video.paused) {
      dispatch({ type: 'setIsVideoPlaying', payload: true });
      video.play();
    } else {
      video.pause();
      dispatch({ type: 'setIsVideoPlaying', payload: false });
    }
  };

  return !state.userdata ? (
    <Login />
  ) : (
    <div>
      <Layout
        topBar_left={
          <BluetoothConnection
            newVideos={state.newVideos}
            currentBLEstatus={state.displayBLEconnection}
            handleDisplayBLEconnection={handleDisplayBLEconnection}
          />
        }
        topBar_middle={
          state.userdata
            ? TopBarInformations(
                state.userdata,
                state.displayBLEconnection,
                state.isOnline,
              )
            : ''
        }
        topBar_right={<ModalSettings />}
        newVideos={state.newVideos}
        isActive={state.isActive}
        setIsActive={setter.setIsActive}
        setNewVideos={setter.setNewVideos}
        videoamount={state.newVideos.length}
      >
        <ListVideos
          setIsActive={setter.setIsActive}
          handleClickVideo={handleClickVideo}
          isVideoPlaying={state.isVideoPlaying}
          videos={state.displayedVideos}
          setVideos={setter.setDisplayedVideos}
        />
      </Layout>
    </div>
  );
};

export default VideoPageView;
