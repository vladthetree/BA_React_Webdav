import React, { useState, useReducer } from 'react';
import '../../../style/modalCss.css';
import { addToIndexDbStore } from '../../../db/storageObjectMethods.js';
import {
  loginReducer,
  initialState,
} from '../../../utils/reducer/loginReducer';
const OBJECT_STORE_USERDATA = `${process.env.OBJECT_STORE_USERDATA}`;
const OBJECT_STORE_USERDATA_OBJECTSTORAGE = `${process.env.OBJECT_STORE_USERDATA_OBJECTSTORAGE}`;

export default function Login() {
  const [state, dispatch] = useReducer(loginReducer, initialState);

  async function handleSubmit(event) {
    event.preventDefault();
    if (
      !state.username ||
      !state.password ||
      !state.nextCloudUserName ||
      !state.nextCloudPassword
    ) {
      dispatch({ type: 'setNotificationVisibility', payload: true });
      dispatch({
        type: 'setNotificationMessage',
        payload: 'All fields have to be filled!',
      });
    } else {
      await addToIndexDbStore(
        OBJECT_STORE_USERDATA,
        OBJECT_STORE_USERDATA_OBJECTSTORAGE,
        'readwrite',
        'adress01',
        {
          username: state.username,
          password: state.password,
          webdavAddress: `${state.webdavAddress}resident_${state.username}`,
          nextCloudUserName: state.nextCloudUserName,
          nextCloudPassword: state.nextCloudPassword,
        },
      );
    }
    window.dispatchEvent(new Event('userDataUpdated'));
  }

  return (
    <div className="outer-container ">
      {state.isNotificationVisible && (
        <div className="errorMessage">
          <p>{state.notificationMessage}</p>
        </div>
      )}

      <div className="innerContainer innerContainer-LoginColor">
        <form className="login-form">
          <label htmlFor="name">Username:</label>
          <input
            type="text"
            name="username"
            value={state.usename}
            onChange={(event) =>
              dispatch({ type: 'setUsername', payload: event.target.value })
            }
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            value={state.password}
            onChange={(event) =>
              dispatch({ type: 'setPassword', payload: event.target.value })
            }
          />
          <label>NextCloudName:</label>
          <input
            type="text"
            name="nextCloudUserName"
            value={state.nextCloudUserName}
            onChange={(event) =>
              dispatch({
                type: 'setnextCloudUserName',
                payload: event.target.value,
              })
            }
          />
          <label>NextCloudAdress:</label>
          <input
            name="webdavAdress"
            value={state.webdavAdress}
            onChange={(event) =>
              dispatch({ type: 'setWebdavAdress', payload: event.target.value })
            }
          />
          <label>NextCloudPassword:</label>
          <input
            type="password"
            name="nextCloudPassword"
            value={state.nextCloudPassword}
            onChange={(event) =>
              dispatch({
                type: 'setnextCloudPassword',
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
