import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState, useContext } from "react";

const PublicRoute = ({ children, ...rest }) => {
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
  const isLoggedIn = getCookie("isLoggedIn") === "true";

  return isLoggedIn ? <Navigate to="/videos" /> : <Outlet />;
};
export default PublicRoute;
