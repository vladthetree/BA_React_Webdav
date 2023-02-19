import { Navigate, Outlet } from "react-router-dom";
import React from 'react';

const PrivateRoute = ({ children, ...rest }) => {
  console.log("Private Route Trigger");

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
  const isLoggedIn = getCookie("isLoggedIn") === "true";

  return isLoggedIn ? <Outlet /> : <Navigate to="/" />;
};
export default PrivateRoute;
