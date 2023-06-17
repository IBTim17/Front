import React from "react";
import "./App.css";
import CertificateRequest from "./components/CertificateRequest/CertificateRequest";
import CertificateTable from "./components/CertificatesTable/CertificatesTable.js";
import Registration from "./components/Registration/Registration";
import Login from "./components/login/Login.js";
import { Routes, Route, Navigate } from "react-router-dom";

class App extends React.Component {
  
  render() {
    return (
      <>
        <div className="App">
          <Routes>
            <Route path="/register" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login"/>}/>
            <Route path="/main" element={<CertificateTable />} />
            <Route path="/add" element={<CertificateRequest />} />
          </Routes>
        </div>
      </>
    );
  }
}

export default App;
