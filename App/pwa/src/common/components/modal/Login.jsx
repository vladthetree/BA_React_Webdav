import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setUserName,
  setNextCloudPassword,
  setNextCloudUserName,
  setNotificationMessage,
  setNotificationVisible,
  setPassword,
  setWebdavAddress,
} from '../../slice/loginSlice.js';
import { addToIndexDbStore } from '../../db/storageObjectMethods.js';
import '../../assets/style/modalCss.css';

const OBJECT_STORE_USERDATA = `${process.env.OBJECT_STORE_USERDATA}`;
const OBJECT_STORE_USERDATA_OBJECTSTORAGE = `${process.env.OBJECT_STORE_USERDATA_OBJECTSTORAGE}`;
export default function Login() {
  const loginSlice = useSelector((state) => state.loginSlice);
  const dispatch = useDispatch();

  async function handleSubmit(event) {
    event.preventDefault();
    if (
      !loginSlice.username ||
      !loginSlice.password ||
      !loginSlice.nextCloudUserName ||
      !loginSlice.nextCloudPassword
    ) {
      dispatch(setNotificationMessage('All fields have to be filled!'));
      dispatch(setNotificationVisible(true));
    } else {
      console.log(OBJECT_STORE_USERDATA, OBJECT_STORE_USERDATA_OBJECTSTORAGE);
      await addToIndexDbStore(
        OBJECT_STORE_USERDATA,
        OBJECT_STORE_USERDATA_OBJECTSTORAGE,
        'readwrite',
        'adress01',
        {
          username: loginSlice.username,
          password: loginSlice.password,
          nextCloudUserName: loginSlice.nextCloudUserName,
          nextCloudPassword: loginSlice.nextCloudPassword,
          webdavAddress: `${loginSlice.webdavAddress}resident_${loginSlice.username}`,
        },
        null,
      );
      window.dispatchEvent(new Event('userDataUpdated'));
    }
  }

  return (
    <div className="outer-container ">
      {loginSlice.isNotificationVisible && (
        <div className="errorMessage">
          <p>{loginSlice.notificationMessage}</p>
        </div>
      )}

      <div className="innerContainer innerContainer-LoginColor">
        <form className="login-form">
          <label htmlFor="name">Username:</label>
          <input
            type="text"
            name="username"
            value={loginSlice.username}
            onChange={(event) => dispatch(setUserName(event.target.value))}
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            value={loginSlice.password}
            onChange={(event) => dispatch(setPassword(event.target.value))}
          />
          <label>NextCloudName:</label>
          <input
            type="text"
            name="nextCloudUserName"
            value={loginSlice.nextCloudUserName}
            onChange={(event) =>
              dispatch(setNextCloudUserName(event.target.value))
            }
          />
          <label>NextCloudAdress:</label>
          <input
            name="webdavAdress"
            value={loginSlice.webdavAdress}
            onChange={(event) => dispatch(setWebdavAddress(event.target.value))}
          />
          <label>NextCloudPassword:</label>
          <input
            type="password"
            name="SET_NEXT_CLOUD_PASSWORD"
            value={loginSlice.nextCloudPassword}
            onChange={(event) =>
              dispatch(setNextCloudPassword(event.target.value))
            }
          />
          <div className="button-container">
            <button type="submit" onClick={(e) => handleSubmit(e)}>
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
