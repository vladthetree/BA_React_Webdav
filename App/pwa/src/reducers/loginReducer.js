export const initialState = {
  username: '',
  password: '',
  webdavAddress: '',
  nextCloudUserName: '',
  nextCloudPassword: '',
  isNotificationVisible: false,
  notificationMessage: '',
};

export const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'setUsername':
      return { ...state, username: action.payload };
    case 'setPassword':
      return { ...state, password: action.payload };
    case 'setWebdavAdress':
      return { ...state, webdavAddress: action.payload };
    case 'setNextCloudUserName':
      return { ...state, nextCloudUserName: action.payload };
    case 'setNextCloudPassword':
      return { ...state, nextCloudPassword: action.payload };
    case 'setNotificationVisibility':
      return { ...state, isNotificationVisible: action.payload };
    case 'setNotificationMessage':
      return { ...state, notificationMessage: action.payload };
    default:
      return state;
  }
};
