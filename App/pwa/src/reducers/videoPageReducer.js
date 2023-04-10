export const initialState = {
  newVideos: [],
  userdata: null,
  isOnline: window.navigator.onLine,
  displayBLEconnection: false,
  isActive: false,
  displayedVideos: [],
  isVideoPlaying: false,
  isRequesting: false,
};

export const videoPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'setNewVideos':
      return { ...state, newVideos: action.payload };
    case 'setUserData':
      return { ...state, userdata: action.payload };
    case 'setIsOnline':
      return { ...state, isOnline: action.payload };
    case 'setDisplayBLEconnection':
      return { ...state, displayBLEconnection: action.payload };
    case 'setIsActive':
      return { ...state, isActive: action.payload };
    case 'setDisplayedVideos':
      return { ...state, displayedVideos: action.payload };
    case 'setIsVideoPlaying':
      return { ...state, isVideoPlaying: action.payload };
    case 'setIsRequesting':
      return { ...state, isRequesting: action.payload };
    default:
      return state;
  }
};

