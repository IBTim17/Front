import "./Login.css";
import React, { useState } from "react";
import ReactModal from 'react-modal';

function Login() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }
  
  return (
    <div className="container-login">
      <div className="col-sm-6 welcome-back">
        <div className="row">
          <br/>
          <p className="motto">Welcome back to CertifyHub</p>
        </div>
        <div className="row">
          <p className="message">You were missed! Welcome back and let's pick up right where we left off. First time visiting us?</p>
          {/* <Link to="/register" className="btn btn-primary">Create account.</Link> */}
        </div>
        <div className="row">
          {/* <img src="..\..\assets\logo.png"> */}
        </div>
      </div>
      <div className="col-sm-6 line">
        <div className="row form">
          <br/>
          <p className="sign-in">Sign in</p>
        </div>
        <div className="row form">
          <div className="input-box">
            <span className="details">Email</span>
            <input 
              type="text" 
              placeholder="bob@ross.com" 
              value={email}
              onChange={handleEmailChange}
              required/>
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
              required/>
          </div>
        </div>
        <a className="right" onClick={() => setIsOpen(true)}>Forgot password?</a>
        <div className="row">
          <div className="button">
            <input type="submit" value="Sign in"/>
          </div>
        </div>
      </div>
      <ReactModal
        isOpen={isOpen}
        contentLabel="Example Modal"
        onRequestClose={() => setIsOpen(false)}
        >
          <div className="row form" style={{marginTop:'3em'}}>
            <div className="input-box">
              <span className="details">Email or PhoneNumber</span>
              <input 
                style={{width:'95%'}}
                type="text" 
                placeholder="bob@ross.com or +381651234567" 
                value={email}
                onChange={handleEmailChange}
                required/>
            </div>
            <div style={{marginTop:'3em'}}>
              <div className="button">
                <input type="submit" value="Send Code"/>
              </div>
            </div>
          </div>
        
      </ReactModal>
    </div>
  );
  
}
export default Login;
