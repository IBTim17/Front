import "./Login.css";
// import {Routes, Route, useNavigate} from 'react-router-dom';
import React, { useState } from "react";
// import ReactModal from "react-modal";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ResetPassword from "../ResetPassword/ResetPassword";


function Login() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function login(event) {
    event.preventDefault();
    const loginRequest = {
      email,
      password
    };
    
    loginUser(loginRequest)
      .then(response => {
        // console.log(response);
        localStorage.setItem('access_token', response.token);
        navigate('/main', { replace: true });
      })
      .catch(error => {
        alert("Sign in failed. Please try again.");
      });
  }

  function loginUser(user) {
    return axios.post('http://localhost:8080/api/user/login', user)
    .then(response => {
      return response.data;
    });
  }


  return (
    <div className="container-login">
      <div className="col-sm-6 welcome-back">
        <div className="row">
          <br />
          <p className="motto">Welcome back to CertifyHub</p>
        </div>
        <div className="row">
          <p className="message">
            You were missed! Welcome back and let's pick up right where we left
            off. First time visiting us?
          </p>
          {/* <Link to="/register" className="btn btn-primary">Create account.</Link> */}
        </div>
        <div className="row">{/* <img src="..\..\assets\logo.png"> */}</div>
      </div>
      <div className="col-sm-6 line">
        <div className="row form">
          <br />
          <p className="sign-in">Sign in</p>
        </div>
        <form onSubmit={login}>
          <div className="row form">
            <div className="input-box">
              <span className="details">Email</span>
              <input
                type="text"
                placeholder="bob@ross.com"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
          </div>
          <div className="row form">
            <div className="input-box">
              <span className="details">Password</span>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>
          </div>
          <a className="right" onClick={() => setIsOpen(true)}>
            Forgot password?
          </a>
          <div className="row">
            <div className="button">
              <input type="submit" value="Sign in" />
            </div>
          </div>
        </form>
        {isOpen && <ResetPassword/>}
      </div>
      
    </div>
  );
}
export default Login;
