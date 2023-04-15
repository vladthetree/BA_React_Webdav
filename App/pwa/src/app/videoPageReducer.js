export const initialState = {
  newVideos: [],
  displayedVideos: [],
  userdata: null,
  isOnline: window.navigator.onLine,
  displayBLEconnection: false,
  isActive: false,
  isVideoPlaying: false,
  isRequesting: false,
  username: '',
  password: '',
  webdavAddress: '',
  nextCloudUserName: '',
  nextCloudPassword: '',
  isNotificationVisible: false,
  notificationMessage: '',
  availableVideos: [],
  incomingMp4Filenames: null,
};

export const videoPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NEW_VIDEOS':
      const newVideos = action.payload;
      const existingVideos = state.newVideos;
      const updatedVideos = [...existingVideos];
      newVideos.forEach((newVideo) => {
        const index = existingVideos.findIndex(
          (upVideos) => upVideos.url === newVideo.url,
        );
        if (index === -1) {
          updatedVideos.push(newVideo);
        }
      });
      return { ...state, newVideos: updatedVideos };
    case 'SET_USER_DATA':
      return { ...state, userdata: action.payload };
    case 'SET_IS_ONLINE_STATUS':
      return { ...state, isOnline: action.payload };
    case 'SET_EXIST_BLE_CONNECTION':
      return { ...state, existBLEconnection: action.payload };
    case 'SET_IS_ACTIVE':
      return { ...state, isActive: action.payload };
    case 'SET_DISPLAYED_VIDEOS':
      return { ...state, displayedVideos: action.payload };
    case 'SET_IS_VIDEO_PLAYING':
      return { ...state, isVideoPlaying: action.payload };
    case 'SET_IS_REQUESTING':
      return { ...state, isRequesting: action.payload };
    case 'SET_USER_NAME':
      return { ...state, username: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    case 'SET_WEBDAV_ADDRESS':
      return { ...state, webdavAddress: action.payload };
    case 'SET_NEXT_CLOUD_USER_NAME':
      return { ...state, nextCloudUserName: action.payload };
    case 'SET_NEXT_CLOUD_PASSWORD':
      return { ...state, nextCloudPassword: action.payload };
    case 'SET_NOTIFICATION_VISIBLE':
      return { ...state, isNotificationVisible: action.payload };
    case 'SET_NOTIFICATION_MESSAGE':
      return { ...state, notificationMessage: action.payload };
    case 'SET_AVAILABLE_VIDEOS':
      return { ...state, availableVideos: action.payload };
    case 'SET_INCOMING_MP4_FILENAMES':
      return { ...state, incomingMp4Filenames: action.payload };
    default:
      return state;
  }
};
