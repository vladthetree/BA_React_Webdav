import { useDispatch } from 'react-redux';
import { getAvailableContent } from '../common/helper/thunks.js';

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

const setUserName = (username) => ({
  type: 'SET_USER_NAME',
  payload: username,
});

const setPassword = (password) => ({
  type: 'SET_PASSWORD',
  payload: password,
});
const setWebdavAddress = (webdavAddress) => ({
  type: 'SET_WEBDAV_ADDRESS',
  payload: webdavAddress,
});
const setNextCloudUserName = (nextCloudUserName) => ({
  type: 'SET_NEXT_CLOUD_USER_NAME',
  payload: nextCloudUserName,
});

const setNextCloudPassword = (nextCloudPassword) => ({
  type: 'SET_NEXT_CLOUD_PASSWORD',
  payload: nextCloudPassword,
});

const setNotificationVisible = (boolean) => ({
  type: 'SET_NOTIFICATION_VISIBLE',
  payload: boolean,
});

const setMessage = (message) => ({
  type: 'SET_NOTIFICATION_MESSAGE',
  payload: message,
});

const setIncomingMp4Filenames = (incomingMp4Filenames) => ({
  type: 'SET_INCOMING_MP4_FILENAMES',
  payload: incomingMp4Filenames,
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
    setUserName: (username) => {
      dispatch(setUserName(username));
    },
    setPassword: (password) => {
      dispatch(setPassword(password));
    },
    setWebdavAddress: (webdavAddress) => {
      dispatch(setWebdavAddress(webdavAddress));
    },
    setNextCloudUserName: (nextCloudUserName) => {
      dispatch(setNextCloudUserName(nextCloudUserName));
    },
    setNextCloudPassword: (nextCloudPassword) => {
      dispatch(setNextCloudPassword(nextCloudPassword));
    },
    setNotificationVisible: (boolean) => {
      dispatch(setNotificationVisible(boolean));
    },
    setMessage: (message) => {
      dispatch(setMessage(message));
    },
    getAvailableVideos: async (userdata) => {
      dispatch(getAvailableContent(userdata));

    },
    setIncomingMp4Filenames: (incomingMp4Filenames) => {
      dispatch(setIncomingMp4Filenames(incomingMp4Filenames));
    },
  };
};
export default mainPageDispatcher;
