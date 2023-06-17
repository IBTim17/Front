import './App.css';
import CertificateRequest from './components/CertificateRequest/CertificateRequest';
import CertificateTable from './components/CertificatesTable/CertificatesTable.js';
import Registration from './components/Registration/Registration';
import Login from './components/login/Login.js';
import { Routes, Route } from 'react-router-dom';
import ValidateCertificateCopy from "./components/ValidateCertificateCopy/ValidateCertificateCopy";
import AllCertificateRequests from "./components/AllCertificateRequests/AllCertificateRequests";
import AllRequestsUser from "./components/AllRequestsUser/AllRequestsUser";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<CertificateTable />} />
          <Route path="/validatecopy" element={<ValidateCertificateCopy/>}/>
          <Route path="/allrequestsadmin" element={<AllCertificateRequests/>}/>
        <Route path="/allrequestsuser" element={<AllRequestsUser/>}/>
      </Routes>
    </div>
  );
}

export default App;
