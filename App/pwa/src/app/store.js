import {
  configureStore,
  applyMiddleware,
  combineReducers,
} from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { videoPageReducer } from './videoPageReducer.js';
import loginSlice from '../common/slice/loginSlice.js';

const reducer = combineReducers({
  videoPageReducer: videoPageReducer,
  loginSlice: loginSlice,
});
const store = configureStore({
  reducer,
  middleware: [thunk],
});
export default store;
