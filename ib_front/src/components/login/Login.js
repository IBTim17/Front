import "./Login.css";
import React, { useState } from "react";
import ReactModal from "react-modal";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Login() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resource, setResource] = useState("Email");
  const [resValue, setResValue] = useState("");
  const [emailPhoneNumPlh, setEmailPhoneNumPlh] = useState("bob@ros.com");

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleRecourceChange(event) {
    setResValue(event.target.value);
  }

  const onOptionChange = (e) => {
    setResource(e.target.value);
    console.log(e.target.value);
    if (e.target.value === "Email") {
      setEmailPhoneNumPlh("bob@ros.com")
    } else if (e.target.value === "Phone Number") {
      setEmailPhoneNumPlh("+381651234567")
    }
  };

  function onCloseModal() {
    setIsOpen(false);
    setResValue("");
  }

  function sendCode(event) {
    event.preventDefault();
    
  }

  function login(event) {
    event.preventDefault();
    
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

  function resetPassword(body) {
    return axios.post('http://localhost:8080/api/user/resetPassword', body)
    .then(response => {
      return response.data;
    });
  }

  function putNewPassword(body) {
    return axios.put('http://localhost:8080/api/user/resetPassword', body)
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
      </div>
      <ReactModal
        isOpen={isOpen}
        contentLabel="Example Modal"
        onRequestClose={onCloseModal}
        appElement={document.getElementById('root')}
      >
        <div className="row form" style={{ marginTop: "3em" }}>
          <form onSubmit={sendCode}>
            <div className="inline-radio">
              <span className="radio-gap">
                <input
                  type="radio"
                  name="resource"
                  value="Email"
                  id="email"
                  checked={resource === "Email"}
                  onChange={onOptionChange}
                />
                <label htmlFor="email">Email</label>
              </span>
              <span className="radio-gap">
                <input
                  type="radio"
                  name="resource"
                  value="Phone Number"
                  id="phoneNumber"
                  checked={resource === "Phone Number"}
                  onChange={onOptionChange}
                />
                <label htmlFor="medium">Phone Number</label>
              </span>
            </div>

            <div className="input-box">
              <span className="details">{resource}</span>
              <input
                style={{ width: "95%" }}
                type="text"
                placeholder={emailPhoneNumPlh}
                value={resValue}
                onChange={handleRecourceChange}
                required
              />
            </div>
            <div style={{ marginTop: "3em" }}>
              <div className="button">
                <input type="submit" value="Send Code" />
              </div>
            </div>
          </form>
        </div>
      </ReactModal>
    </div>
  );
}
export default Login;
