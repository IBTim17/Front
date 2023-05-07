import "./CertificateRequest.css";
import React, { useState } from "react";
import AsyncSelect from 'react-select/async';
import ReactModal from "react-modal";
import getRole from "../../services/AuthService.js";
import axios from 'axios';

function CertificateRequest() {
  const [type, setType] = useState("Intermediate");
  const [organization, setOrganization] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); //TODO
  const [issuer, setIssuer] = useState(null);
  const [isOpen, setIsOpen] = useState(true); //TODO

  const role = getRole();

  let certificates = [];
  
  const checkIfAdmin = () => {
    console.log(role);
    if (role === 'ADMIN') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  const onOptionChange = (e) => {
    setType(e.target.value);
    console.log(e.target.value);
  };

  function handleOrganizationChange(event) {
    setOrganization(event.target.value);
  }

  const onChangeIssuer = (e) => {
    setIssuer(e.value);
};

  function submitRequest(event) {
    event.preventDefault();
    console.log(type);
    console.log(issuer);
    console.log(organization);
    let body = {
      type: type,
      issuer: issuer,
      organization: organization
    }
    axios.post('http://localhost:8080/api/requests', body, {
    headers: {
        'x-auth-token': localStorage.getItem('access_token')
    }
    }).then(response => { 
      alert("Successfully sent the request!");
    }).catch(error => {alert("Something went wrong. Please try again.");})
  }

  return (
    <ReactModal
        isOpen={isOpen}
        onAfterOpen={checkIfAdmin}
        appElement={document.getElementById('root')}>
      {/* <div className="form-body"> */}
        <form onSubmit={submitRequest}>
          <div className="row form">
            <span className="details">Certificate Type</span>
            <div className="inline-radio">
              <span className="radio-gap">
                <input
                  type="radio"
                  name="type"
                  value="INTERMEDIATE"
                  id="intermediate"
                  checked={type === "INTERMEDIATE"}
                  onChange={onOptionChange}
                />
                <label htmlFor="intermediate">Intermediate</label>
              </span>
              <span className="radio-gap">
                <input
                  type="radio"
                  name="type"
                  value="END"
                  id="end"
                  checked={type === "END"}
                  onChange={onOptionChange}
                />
                <label htmlFor="end">End</label>
              </span>
              {isAdmin && (
                <span className="radio-gap">
                  <input
                    type="radio"
                    name="type"
                    value="ROOT"
                    id="rootCrt"
                    checked={type === "ROOT"}
                    onChange={onOptionChange}
                  />
                  <label htmlFor="root">Root</label>
                </span>
              )}
            </div>
          </div>
          <div className="row form">
            {type != "ROOT" && (<span className="details">Certificate Issuer</span>)}
            {type != "ROOT" && (<AsyncSelect
              className="basic-single"
              classNamePrefix="select"
              isSearchable="true"
              name="issuer"
              onChange={onChangeIssuer}
              cacheOptions defaultOptions 
              loadOptions={options => axios.get('http://localhost:8080/api/certificate', {
                headers: {
                    'x-auth-token': localStorage.getItem('access_token')
                }
            }).then(response => { 
              certificates = response.data;
              console.log(certificates);
              options = [];
              for(let crt of certificates) {
                options.push({ value: crt.serialNumber, label: crt.ownerName + " " + crt.ownerLastName + " " + crt.type });
              }
              return options;
            }).catch(error => console.error('Error fetching certificates: ', error))} 
            />)}
          </div>
          <div className="row form">
            <div className="input-box">
              <span className="details">Organization Name</span>
              <input
                type="text"
                placeholder="Organization Name"
                value={organization}
                onChange={handleOrganizationChange}
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="button">
              <input type="submit" value="Send Request" />
            </div>
          </div>
        </form>
      {/* </div> */}
    </ReactModal>
  );
}
export default CertificateRequest;
