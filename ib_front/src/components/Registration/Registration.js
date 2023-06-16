import React, { useState, useRef } from "react";
import "./Registration.css";
import cert from "./cert.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

function Registration() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const navigate = useNavigate();
  const captchaRef = useRef(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handleFirstNameChange(event) {
    setFirstName(event.target.value);
  }

  function handleLastNameChange(event) {
    setlastName(event.target.value);
  }

  function handlepPhoneNumberChange(event) {
    setPhoneNumber(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handlePasswordRepeatChange(event) {
    setPasswordRepeat(event.target.value);
  }

  function handleVerificationCodeChange(event) {
    setVerificationCode(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (showCode) {
      confirm();
    } else {
      let token = captchaRef.current.getValue();
      if (token) {
        let valid_token = await verifyToken(token);
        if (valid_token) {
          setMessage("Hurray!! you have submitted the form");
          console.log(token);
          
          const user = {
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            repeatedPassword: passwordRepeat,
          };
          console.log(user);
          registerUser(user)
            .then((response) => {
              setShowCode(true);
            })
            .catch((error) => {
              alert("Registration failed. Please try again.");
            });
        } else {
          setError("Sorry!! Token invalid");
        }
      } else {
        setError("You must confirm you are not a robot");
      }
    }
  }

  function registerUser(user) {
    return axios
      .post("http://localhost:8080/api/user/register", user)
      .then((response) => {
        return response.data;
      });
  }

  function confirm() {
    return axios
      .put("http://localhost:8080/api/user/confirm", {
        email,
        code: verificationCode,
      })
      .then((response) => {
        navigate("/main", { replace: true });
        return response.data;
      })
      .catch((error) => {
        alert("Code not correct!");
      });
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

  return (
    <html lang="en">
      <head>
        <title>Registration</title>
        <meta charset="utf-8"></meta>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
        ></link>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,700&display=swap"
        ></link>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
      </head>

      <body>
        <div className="container">
          <div className="col-sm-6 mottos">
            <div className="row">
              <br />
              <p className="motto">
                Unlock secure online communication with our digital
                certificates.
              </p>
            </div>
            <div className="row">
              <p>
                Our website makes it easy and simple for you to obtain digital
                certificates and use them for secure online communication and
                transactions. Join our community of satisfied customers today
                and experience the peace of mind that comes with using our
                trusted digital certificates.
              </p>
            </div>
            <div className="row">
              <img src={cert} alt="certificate" />
            </div>
          </div>
          <div className="col-sm-6 line">
            <div className="row form">
              <br />
              <p className="sign-up">Sign up for CertifyHub</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div class="row">
                <div class="col-sm-6">
                  <div class="input-box">
                    <span class="details">First name</span>
                    <input
                      type="text"
                      placeholder="Bob"
                      value={firstName}
                      onChange={handleFirstNameChange}
                      required
                    />
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="input-box">
                    <span class="details">Last name</span>
                    <input
                      type="text"
                      placeholder="Ross"
                      value={lastName}
                      onChange={handleLastNameChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="row form">
                <div className="input-box form">
                  <span className="details">Email</span>
                  <input
                    type="email"
                    placeholder="bob@mail.com"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                </div>
              </div>
              <div className="row form">
                <div className="input-box form">
                  <span className="details">Phone number</span>
                  <input
                    type="text"
                    placeholder="0678632596"
                    value={phoneNumber}
                    onChange={handlepPhoneNumberChange}
                    required
                  />
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  <div class="input-box">
                    <span class="details">Password</span>
                    <input
                      type="password"
                      placeholder="********"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="input-box">
                    <span class="details">Repeat password</span>
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
              <div className="row" style={{ marginLeft: "5px" }}>
                <ReCAPTCHA
                  sitekey="6LeuCaQmAAAAAO-f1DVpM9aCjS2TMWxPGFFICF7c"
                  ref={captchaRef}
                />
                <div className="button">
                  <input type="submit" value="Register" />
                </div>
              </div>
              {error && <p className="textError">Error: {error}</p>}
              {message && <p className="textSuccess">Success: {message}</p>}
            </form>
            {showCode && (
              <form onSubmit={confirm}>
                <div className="row">
                  <div className="input-box form">
                    <span className="details">Verification code:</span>
                    <input
                      type="text"
                      placeholder="123456"
                      value={verificationCode}
                      onChange={handleVerificationCodeChange}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="button">
                    <input type="submit" value="Verify" />
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}

export default Registration;
