import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { addToIndexDbStore } from "../components/utils/db/storageObjectMethodes";
import "../components/style/login.css";
const OBJECT_STORE_USERDATA = "userData";
const OBJECT_STORE_USERDATA_OBJECTSTORAGE = "customer";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [webdavAdress, setWebdavAdress] = useState("");
  const [nextClouduserName, setnextClouduserName] = useState("");
  const [nextCloudPassword, setnextCloudPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    await addToIndexDbStore(
      OBJECT_STORE_USERDATA,
      OBJECT_STORE_USERDATA_OBJECTSTORAGE,
      "readwrite",
      "customer01",
      customer
    );
    document.cookie = "isLoggedIn=true;expires=Fri, 31 Dec 9999 23:59:59 GMT";
    navigate("videos");
  }

  const customer = {
    username,
    password,
    webdavAdress,
    nextClouduserName,
    nextCloudPassword
  };

  return (
    <div className="outer-container ">
      <div className="innerContainer">
        <form className="login-form">
          <label htmlFor="name">Username:</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={event => setUsername(event.target.value)}
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
          <label>NextCloudName:</label>
          <input
            type="text"
            name="nextCloudUserName"
            value={nextClouduserName}
            onChange={event => setnextClouduserName(event.target.value)}
          />
          <label>NextCloudAdress:</label>
          <input
            name="webdavAdress"
            value={webdavAdress}
            onChange={event => setWebdavAdress(event.target.value)}
          />
          <label>NextCloudPassword:</label>
          <input
            type="password"
            name="nextCloudPassword"
            value={nextCloudPassword}
            onChange={event => setnextCloudPassword(event.target.value)}
          />
          <div className="button-container">
            <button type="submit" onClick={e => handleSubmit(e)}>
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
