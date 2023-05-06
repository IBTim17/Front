import './App.css';
import CertificateTable from './components/CertificatesTable/CertificatesTable.js';
import Registration from './components/Registration/Registration';
import Login from './components/login/Login.js';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/regirster" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<CertificateTable />} />
      </Routes>
    </div>
  );
}

export default App;