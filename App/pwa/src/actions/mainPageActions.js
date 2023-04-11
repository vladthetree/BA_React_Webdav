import { useDispatch } from 'react-redux';

const setIsActive = (status) => ({
  type: 'SET_IS_ACTIVE',
  payload: status,
});

const setIsRequesting = (boolean) => ({
  type: 'SET_IS_REQUESTING',
  payload: boolean,
});
const setNewVideos = (newVideos) => ({
  type: 'SET_NEW_VIDEOS',
  payload: newVideos,
});
const setDisplayedVideos = (videos) => ({
  type: 'SET_DISPLAYED_VIDEOS',
  payload: videos,
});

const setIsOnlineStatus = () => ({
  type: 'SET_IS_ONLINE_STATUS',
  payload: window.navigator.onLine,
});

const setUserData = (userdata) => ({
  type: 'SET_USER_DATA',
  payload: userdata,
});

const setIsVideoPlaying = (boolean) => ({
  type: 'SET_IS_VIDEO_PLAYING',
  payload: boolean,
});

const setExistBLEconnection = (boolean) => ({
  type: 'SET_EXIST_BLE_CONNECTION',
  payload: boolean,
});

const mainPageDispatcher = () => {
  const dispatch = useDispatch();
  return {
    setUserData: (userdata) => {
      dispatch(setUserData(userdata));
    },
    setIsActive: (status) => {
      dispatch(setIsActive(status));
    },
    setIsRequesting: (boolean) => {
      dispatch(setIsRequesting(boolean));
    },
    setNewVideos: (newVideos) => {
      dispatch(setNewVideos(newVideos));
    },
    setDisplayedVideos: (videos) => {
      dispatch(setDisplayedVideos(videos));
    },
    setIsOnlineStatus: () => {
      dispatch(setIsOnlineStatus());
    },
    setIsVideoPlaying: (boolean) => {
      dispatch(setIsVideoPlaying(boolean));
    },
    setExistBLEconnection: (boolean) => {
      dispatch(setExistBLEconnection(boolean));
    },
  };
};

export default mainPageDispatcher;
