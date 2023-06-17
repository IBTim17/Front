import "./Login.css";
import ResetPassword from "../ResetPassword/ResetPassword";
import React, { useState, useRef } from "react";
import ReactModal from "react-modal";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

function Login() {
  const [isOpen, setIsOpen] = useState(false);
  const [renewal, setRenawal] = useState(false);
  const [openTwoFactor, setOpenTwoFactor] = useState(false);
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("EMAIL");
  const navigate = useNavigate();
  const captchaRef = useRef(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resource, setResource] = useState("Email");
  const [resValue, setResValue] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const phoneRegex = /^\d{10}$/;

  const [emailPhoneNumPlh, setEmailPhoneNumPlh] = useState("bob@ros.com");
  const [sentCode, setSentCode] = useState(false);

  function onCloseModal() {
    setIsOpen(false);
    setRenawal(false);
    setResValue("");
    setCode("");
    setNewPassword("");
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

  async function login(event) {
    event.preventDefault();

    let token = captchaRef.current.getValue();
    if (token) {
      let valid_token = await verifyToken(token);
      if (valid_token) {
        setMessage("Hurray!! you have submitted the form");
        
        console.log(token);
        const loginRequest = {
          email: email,
          password: password,
          resource: type
        };
         if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
          }

          if (!passwordRegex.test(password)) {
            alert(
              'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character.'
            );
            return;
          }

        loginUser(loginRequest)
          .then((response) => {
            // console.log(response);
            setOpenTwoFactor(true);
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

  function signInWithGoogle() {
    window.location.href = window.location.href = "http://localhost:8080/oauth2/authorization/google?redirect_uri=http://localhost:3000/main"
  }

  function sendCode(event) {
    event.preventDefault();
    const codeRequest = { resource: resValue };

    if (resource === 'Email' && !emailRegex.test(resValue)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (resource === 'Phone Number' && !phoneRegex.test(resValue)) {
      alert('Please enter a valid phone number (10 digits).');
      return;
    }

    resetPassword(codeRequest)
      .then((response) => {
        console.log(response);
        setSentCode(true);
      })
      .catch((error) => {
        alert("Something went wrong. Please try again.");
      });
  }

  function sendLoginCode(event) {
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

  function sendNewPassword(event) {
    event.preventDefault();
    if (!passwordRegex.test(newPassword)) {
      alert(
        'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character.'
      );
      return;
    }

    if (newPassword !== passwordRepeat) {
      alert('Passwords do not match.');
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
          <div className="row" style={{margin: "5px"}}>
            <ReCAPTCHA
              sitekey="6LeuCaQmAAAAAO-f1DVpM9aCjS2TMWxPGFFICF7c"
              ref={captchaRef}
            />
            <div className="button">
              <input type="submit" value="Sign in" />
            </div>
            <div className="button">
              <input  onClick={() => signInWithGoogle()} value="Continue with google" style={{textAlign:"center"}} />
            </div>
          </div>
          {error && <p className="textError">Error: {error}</p>}
          {message && <p className="textSuccess">Success: {message}</p>}
        </form>
        {isOpen && <ResetPassword />}
        <ReactModal
          isOpen={openTwoFactor}
          contentLabel="Login Code"
          appElement={document.getElementById("root")}
        >
          <form onSubmit={sendLoginCode}>
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
      <ReactModal
        isOpen={renewal}
        contentLabel="Example Modal"
        onRequestClose={onCloseModal}
        appElement={document.getElementById("root")}>
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
