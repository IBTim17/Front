import "./Login.css";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ResetPassword from "../ResetPassword/ResetPassword";
import ReactModal from "react-modal";

function Login() {
  const [isOpen, setIsOpen] = useState(false);
  const [openTwoFactor, setOpenTwoFactor] = useState(false);
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("EMAIL");
  const navigate = useNavigate();

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleCodeChange(event) {
    setCode(event.target.value);
  }

  const onOptionChange = (e) => {
    setType(e.target.value);
    console.log(e.target.value);
  };

  function login(event) {
    event.preventDefault();
    setOpenTwoFactor(true);
    const loginRequest = {
      email: email,
      password: password,
      resource: type
    };

    loginUser(loginRequest)
      .then((response) => {
        localStorage.setItem("access_token", response.token);
      })
      .catch((error) => {
        alert("Sign in failed. Please try again.");
      });
  }

  function sendCode(event) {
    event.preventDefault();
    setOpenTwoFactor(false);

    checkLoginCode(email, code)
      .then((response) => {
        console.log(response);
        if (response.status === 200) navigate("/main", { replace: true });
        else localStorage.removeItem("access_token");
      })
      .catch((error) => {
        localStorage.removeItem("access_token");
        alert(error.data.message);
      });
  }

  function loginUser(user) {
    return axios
      .post("http://localhost:8080/api/user/login", user)
      .then((response) => {
        return response.data;
      });
  }

  function checkLoginCode(email, code) {
    return axios
      .put("http://localhost:8080/api/user/login", { email, code })
      .then((response) => {
        return response;
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
          <div className="row form">
            <div className="inline-radio">
              <span className="radio-gap">
                <input
                  type="radio"
                  name="type"
                  value="EMAIL"
                  id="email"
                  checked={type === "EMAIL"}
                  onChange={onOptionChange}
                />
                <label htmlFor="email">Email</label>
              </span>
              <span className="radio-gap">
                <input
                  type="radio"
                  name="type"
                  value="PHONE_NUMBER"
                  id="phoneNumber"
                  checked={type === "PHONE_NUMBER"}
                  onChange={onOptionChange}
                />
                <label htmlFor="phoneNumber">Phone number</label>
              </span>
            </div>
          </div>
          <div className="row">
            <div className="button">
              <input type="submit" value="Sign in" />
            </div>
          </div>
        </form>
        {isOpen && <ResetPassword />}
        <ReactModal
          isOpen={openTwoFactor}
          contentLabel="Login Code"
          appElement={document.getElementById("root")}
        >
          <form onSubmit={sendCode}>
            <div className="input-box">
              <span className="details">Login code</span>
              <input
                style={{ width: "95%" }}
                type="text"
                placeholder="Login code"
                value={code}
                onChange={handleCodeChange}
                required
              />
            </div>
            <div style={{ marginTop: "1em" }}>
              <div className="button">
                <input type="submit" value="Submit" />
              </div>
            </div>
          </form>
        </ReactModal>
      </div>
    </div>
  );
}
export default Login;
