import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: '',
  password: '',
  webdavAddress: '',
  nextCloudUserName: '',
  nextCloudPassword: '',
  isNotificationVisible: false,
  notificationMessage: '',
};

const loginSlice = createSlice({
  name: 'loginSlice',
  initialState,
  reducers: {
    setUserName(state, action) {
      state.username = action.payload;
    },
    setPassword(state, action) {
      state.password = action.payload;
    },
    setWebdavAddress(state, action) {
      state.webdavAddress = action.payload;
    },
    setNextCloudUserName(state, action) {
      state.nextCloudUserName = action.payload;
    },
    setNextCloudPassword(state, action) {
      state.nextCloudPassword = action.payload;
    },
    setNotificationVisible(state, action) {
      state.isNotificationVisible = action.payload;
    },
    setNotificationMessage(state, action) {
      state.notificationMessage = action.payload;
    },
  },
});

export const {
  setUserName,
  setPassword,
  setWebdavAddress,
  setNextCloudUserName,
  setNextCloudPassword,
  setNotificationVisible,
  setNotificationMessage,
} = loginSlice.actions;

export default loginSlice.reducer;
