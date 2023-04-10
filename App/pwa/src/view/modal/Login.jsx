import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToIndexDbStore } from '../../model/db/storageObjectMethods.js';
import './../style/modalCss.css';
const OBJECT_STORE_USERDATA = `${process.env.OBJECT_STORE_USERDATA}`;
const OBJECT_STORE_USERDATA_OBJECTSTORAGE = `${process.env.OBJECT_STORE_USERDATA_OBJECTSTORAGE}`;

export default function Login() {
  const loginPageState = useSelector((loginPageState) => loginPageState.loginReducer);
  const dispatch = useDispatch();

  async function handleSubmit(event) {
    event.preventDefault();
    console.log("RECOGNICE CLICK")
    console.log(loginPageState)
    console.log(loginPageState.username)
    console.log(loginPageState.password)
    console.log(loginPageState.nextCloudUserName)
    console.log(loginPageState.nextCloudPassword)
    if (
      !loginPageState.username ||
      !loginPageState.password ||
      !loginPageState.nextCloudUserName ||
      !loginPageState.nextCloudPassword
    ) {
      console.log("RECOGNICE CLICK 2 ")

      dispatch({ type: 'setNotificationVisibility', payload: true });
      dispatch({
        type: 'setNotificationMessage',
        payload: 'All fields have to be filled!',
      });
    } else {
      console.log("RECOGNICE CLICK 3")

      await addToIndexDbStore(
        OBJECT_STORE_USERDATA,
        OBJECT_STORE_USERDATA_OBJECTSTORAGE,
        'readwrite',
        'adress01',
        {
          username: loginPageState.username,
          password: loginPageState.password,
          webdavAddress: `${loginPageState.webdavAddress}resident_${loginPageState.username}`,
          nextCloudUserName: loginPageState.nextCloudUserName,
          nextCloudPassword: loginPageState.nextCloudPassword,
        },
      );
    }
    console.log("RECOGNICE CLICK 4")
    window.dispatchEvent(new Event('userDataUpdated'));
  }

  return (
    <div className="outer-container ">
      {loginPageState.isNotificationVisible && (
        <div className="errorMessage">
          <p>{loginPageState.notificationMessage}</p>
        </div>
      )}

      <div className="innerContainer innerContainer-LoginColor">
        <form className="login-form">
          <label htmlFor="name">Username:</label>
          <input
            type="text"
            name="username"
            value={loginPageState.username}
            onChange={(event) =>
              dispatch({ type: 'setUsername', payload: event.target.value })
            }
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            value={loginPageState.password}
            onChange={(event) =>
              dispatch({ type: 'setPassword', payload: event.target.value })
            }
          />
          <label>NextCloudName:</label>
          <input
            type="text"
            name="nextCloudUserName"
            value={loginPageState.nextCloudUserName}
            onChange={(event) =>
              dispatch({
                type: 'setNextCloudUserName',
                payload: event.target.value,
              })
            }
          />
          <label>NextCloudAdress:</label>
          <input
            name="webdavAdress"
            value={loginPageState.webdavAdress}
            onChange={(event) =>
              dispatch({ type: 'setWebdavAdress', payload: event.target.value })
            }
          />
          <label>NextCloudPassword:</label>
          <input
            type="password"
            name="nextCloudPassword"
            value={loginPageState.nextCloudPassword}
            onChange={(event) =>
              dispatch({
                type: 'setNextCloudPassword',
                payload: event.target.value,
              })
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
