import React from 'react';
import VideoPageView from '../../view/routesView/VideoPageView.jsx';
import VideoPageController from '../routesLogic/videoPageController.jsx';

const VideoPage = () => {
  return (
    <VideoPageController>
      {(props) => <VideoPageView {...props} />}
    </VideoPageController>
  );
};

export default VideoPage;
