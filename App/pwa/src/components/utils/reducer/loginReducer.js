const initialState = {
  username: '',
  password: '',
  webdavAddress: '',
  nextCloudUserName: '',
  nextCloudPassword: '',
  isNotificationVisible: false,
  notificationMessage: '',
};

function loginReducer(state, action) {
  switch (action.type) {
    case 'setUsername':
      return { ...state, username: action.payload };
    case 'setPassword':
      return { ...state, password: action.payload };
    case 'setWebdavAdress':
      return { ...state, webdavAddress: action.payload };
    case 'setnextCloudUserName':
      return { ...state, nextCloudUserName: action.payload };
    case 'setnextCloudPassword':
      return { ...state, nextCloudPassword: action.payload };
    case 'setNotificationVisibility':
      return { ...state, isNotificationVisible: action.payload };
    case 'setNotificationMessage':
      return { ...state, notificationMessage: action.payload };
    default:
      throw new Error();
  }
}

export { initialState, loginReducer };
