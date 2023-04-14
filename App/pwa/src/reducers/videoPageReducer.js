export const initialState = {
  newVideos: [],
  displayedVideos: [],
  userdata: null,
  isOnline: window.navigator.onLine,
  displayBLEconnection: false,
  isActive: false,
  isVideoPlaying: false,
  isRequesting: false,
};

export const videoPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NEW_VIDEOS':
      const newVideos = action.payload;
      const existingVideos = state.newVideos;
      const updatedVideos = [...existingVideos];
      newVideos.forEach((newVideo) => {
        const index = existingVideos.findIndex((upVideos) => upVideos.url === newVideo.url);
        if (index === -1) {
          updatedVideos.push(newVideo);
        }
      });
      return { ...state, newVideos: action.payload };
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
    default:
      return state;
  }
};
