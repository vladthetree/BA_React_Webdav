import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { addToIndexDbStore } from "../../../db/storageObjectMethodes.jsx";
import "../../../../style/modalCss.css"
const OBJECT_STORE_USERDATA = "userData";
const OBJECT_STORE_USERDATA_OBJECTSTORAGE = "customer";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [webdavAdress, setWebdavAdress] = useState("");
  const [nextClouduserName, setnextClouduserName] = useState("");
  const [nextCloudPassword, setnextCloudPassword] = useState("");
  const navigate = useNavigate();
  const resident = "resident_";
  let adress = null;

  async function handleSubmit(event) {
    event.preventDefault();
    await addToIndexDbStore(
      OBJECT_STORE_USERDATA,
      OBJECT_STORE_USERDATA_OBJECTSTORAGE,
      "readwrite",
      "adress01",
      customer
    );
  }

if(webdavAdress){
adress = `${webdavAdress}${resident}${username}`
}

  const customer = {
    username :username,
    password :password,
    webdavAdress:adress,
    nextCloudUserName:nextClouduserName,
    nextCloudPassword:nextCloudPassword
  };

  return (
    <div className="outer-container ">
      <div className="innerContainer innerContainer-LoginColor">
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
