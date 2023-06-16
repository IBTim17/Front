import "./Login.css";
// import {Routes, Route, useNavigate} from 'react-router-dom';
import React, { useState, useRef } from "react";
import ReactModal from "react-modal";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

function Login() {
  const [isOpen, setIsOpen] = useState(false);
  const [renewal, setRenawal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resource, setResource] = useState("Email");
  const [resValue, setResValue] = useState("");
  const [emailPhoneNumPlh, setEmailPhoneNumPlh] = useState("bob@ros.com");
  const [sentCode, setSentCode] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [code, setCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const captchaRef = useRef(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleIsVerified(event) {
    setIsVerified(event.target.value);
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleRecourceChange(event) {
    setResValue(event.target.value);
  }

  function handleNewPasswordChange(event) {
    setNewPassword(event.target.value);
  }

  function handlePasswordRepeatChange(event) {
    setPasswordRepeat(event.target.value);
  }

  function handleCodeChange(event) {
    setCode(event.target.value);
  }

  const onOptionChange = (e) => {
    setResource(e.target.value);
    console.log(e.target.value);
    if (e.target.value === "Email") {
      setEmailPhoneNumPlh("bob@ros.com");
    } else if (e.target.value === "Phone Number") {
      setEmailPhoneNumPlh("+381651234567");
    }
  };

  function onCloseModal() {
    setIsOpen(false);
    setRenawal(false);
    setResValue("");
    setCode("");
    setNewPassword("");
  }

  function sendCode(event) {
    event.preventDefault();
    const codeRequest = { resource: resValue };

    resetPassword(codeRequest)
      .then((response) => {
        console.log(response);
        setSentCode(true);
      })
      .catch((error) => {
        alert("Something went wrong. Please try again.");
      });
  }

  function sendNewPassword(event) {
    event.preventDefault();
    if (newPassword !== passwordRepeat) {
      alert("Passwords don't match!");
      return;
    }
    const codeRequest = { email, code, newPassword };

    putNewPassword(codeRequest)
      .then((response) => {
        console.log(response);
        alert("Successfully changed password!");
        setSentCode(false);
        setIsOpen(false);
      })
      .catch((error) => {
        alert("Something went wrong. Please try again.");
      });
  }

  function onChangeRecaptcha(value) {
    console.log("Captcha value:", value);
    handleIsVerified(true);
  }

  async function login(event) {
    event.preventDefault();

    let token = captchaRef.current.getValue();
    if (token) {
      let valid_token = await verifyToken(token);
      if (valid_token) {
        setMessage("Hurray!! you have submitted the form");
        console.log(token);
        const loginRequest = {
          email,
          password,
        };

        loginUser(loginRequest)
          .then((response) => {
            // console.log(response);
            localStorage.setItem("access_token", response.token);
            navigate("/main", { replace: true });
          })
          .catch((error) => {
            console.log(error.response.data);
            if (error.response.data === "Password needs renewal!") {
              setRenawal(true);
              alert(error.response.data);
            } else {
              alert("Sign in failed. Please try again.");
            }
          });
      } else {
        setError("Sorry!! Token invalid");
      }
    } else {
      setError("You must confirm you are not a robot");
    }
  }

  const verifyToken = async (token) => {
    try {
      let response = await axios.post(
        `http://localhost:8080/api/user/recaptcha/${token}`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log("error ", error);
    }
  };

  function loginUser(user) {
    return axios
      .post("http://localhost:8080/api/user/login", user)
      .then((response) => {
        return response.data;
      });
  }

  function resetPassword(body) {
    return axios
      .post("http://localhost:8080/api/user/resetPassword", body)
      .then((response) => {
        return response.data;
      });
  }

  function putNewPassword(body) {
    return axios
      .put("http://localhost:8080/api/user/resetPassword", body)
      .then((response) => {
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
          <Link to="/register">Create account.</Link>
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
          <div className="row" style={{margin: "5px"}}>
            <ReCAPTCHA
              sitekey="6LeuCaQmAAAAAO-f1DVpM9aCjS2TMWxPGFFICF7c"
              ref={captchaRef}
            />
            <div className="button">
              <input type="submit" value="Sign in" disabled={isVerified} />
            </div>
          </div>
        </form>
        {error && <p className="textError">Error: {error}</p>}
        {message && <p className="textSuccess">Success: {message}</p>}
      </div>
      <ReactModal
        isOpen={isOpen}
        contentLabel="Example Modal"
        onRequestClose={onCloseModal}
        appElement={document.getElementById("root")}
      >
        {!sentCode && (
          <div className="row form">
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
        )}
        {sentCode && (
          <div className="row form" style={{ marginTop: "3em" }}>
            <form onSubmit={sendNewPassword}>
              <div className="input-box">
                <span className="details">Email</span>
                <input
                  style={{ width: "95%" }}
                  type="email"
                  placeholder="bob@ros.com"
                  value={resValue}
                  onChange={handleRecourceChange}
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Reset code</span>
                <input
                  style={{ width: "95%" }}
                  type="text"
                  placeholder="Reset code"
                  value={code}
                  onChange={handleCodeChange}
                  required
                />
              </div>
              <div className="row">
                <div className="col-sm-6" style={{ width: "46%" }}>
                  <div className="input-box">
                    <span className="details">New Password</span>
                    <input
                      type="password"
                      placeholder="********"
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-sm-6" style={{ width: "46%" }}>
                  <div className="input-box">
                    <span className="details">Repeat password</span>
                    <input
                      type="password"
                      placeholder="********"
                      value={passwordRepeat}
                      onChange={handlePasswordRepeatChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "1em" }}>
                <div className="button">
                  <input type="submit" value="Reset Password" />
                </div>
              </div>
            </form>
          </div>
        )}
      </ReactModal>
      <ReactModal
        isOpen={renewal}
        contentLabel="Example Modal"
        onRequestClose={onCloseModal}
        appElement={document.getElementById("root")}
      >
        {!sentCode && (
          <div className="row form">
            <p className="title">Password renewal - 90. days passed</p>
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
        )}
        {sentCode && (
          <div className="row form" style={{ marginTop: "3em" }}>
            <form onSubmit={sendNewPassword}>
              <div className="input-box">
                <span className="details">Email</span>
                <input
                  style={{ width: "95%" }}
                  type="email"
                  placeholder="bob@ros.com"
                  value={resValue}
                  onChange={handleRecourceChange}
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Reset code</span>
                <input
                  style={{ width: "95%" }}
                  type="text"
                  placeholder="Reset code"
                  value={code}
                  onChange={handleCodeChange}
                  required
                />
              </div>
              <div className="row">
                <div className="col-sm-6" style={{ width: "46%" }}>
                  <div className="input-box">
                    <span className="details">New Password</span>
                    <input
                      type="password"
                      placeholder="********"
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-sm-6" style={{ width: "46%" }}>
                  <div className="input-box">
                    <span className="details">Repeat password</span>
                    <input
                      type="password"
                      placeholder="********"
                      value={passwordRepeat}
                      onChange={handlePasswordRepeatChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "1em" }}>
                <div className="button">
                  <input type="submit" value="Reset Password" />
                </div>
              </div>
            </form>
          </div>
        )}
      </ReactModal>
    </div>
  );
}
export default Login;
