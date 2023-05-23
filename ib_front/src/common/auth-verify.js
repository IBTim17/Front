import React, { useEffect } from "react";
import { withRouter } from "./with-router";
import jwt from 'jwt-decode';

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const AuthVerify = (props) => {
  let location = props.router.location;

  useEffect(() => {
    // console.log(localStorage.getItem("access_token"));
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      const decodedJwt = jwt(accessToken);
      console.log(decodedJwt);
      if (decodedJwt.exp * 1000 < Date.now()) {
        console.log("Logout");
        props.logOut();
      }
    }
  }, [location]);

  return <div></div>;
};

export default withRouter(AuthVerify);