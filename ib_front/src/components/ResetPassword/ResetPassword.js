import React, { useState } from "react";
import ReactModal from "react-modal";
import axios from "axios";

function ResetPassword() {
  const [resource, setResource] = useState("Email");
  const [resValue, setResValue] = useState("");
  const [emailPhoneNumPlh, setEmailPhoneNumPlh] = useState("bob@ros.com");
  const [sentCode, setSentCode] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  function handleRecourceChange(event) {
    setResValue(event.target.value);
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
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
        alert("Successfully chenged password!");
        setSentCode(false);
        setIsOpen(false);
      })
      .catch((error) => {
        alert("Something went wrong. Please try again.");
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
                type={resource === "Email" ? "email" : "text"}
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
                value={email}
                onChange={handleEmailChange}
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
  );
}
export default ResetPassword;
