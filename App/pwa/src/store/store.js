import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { videoPageReducer } from '../reducers/videoPageReducer.js';
import { loginReducer } from '../reducers/loginReducer.js';

const reducer = combineReducers({
  videoPageReducer: videoPageReducer,
  loginReducer: loginReducer,
});
const store = configureStore({
  reducer,
});
export default store;
