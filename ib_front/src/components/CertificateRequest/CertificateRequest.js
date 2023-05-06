import "./CertificateRequest.css";
import React, { useState } from "react";
import Select from "react-select";

function CertificateRequest() {
  const [type, setType] = useState("Intermediate");
  const [organization, setOrganization] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); //TODO
  const [selectedOption, setSelectedOption] = useState("");

  const onOptionChange = (e) => {
    setType(e.target.value);
    console.log(e.target.value);
  };

  function handleOrganizationChange(event) {
    setOrganization(event.target.value);
  }

  function submitRequest(event) {
    event.preventDefault();
  }

  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]

  return (
    <div className="form-body">
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
                checked={type === "Intermediate"}
                onChange={onOptionChange}
              />
              <label htmlFor="intermediate">Intermediate</label>
            </span>
            <span className="radio-gap">
              <input
                type="radio"
                name="type"
                value="End"
                id="end"
                checked={type === "End"}
                onChange={onOptionChange}
              />
              <label htmlFor="end">End</label>
            </span>
            {isAdmin && (
              <span className="radio-gap">
                <input
                  type="radio"
                  name="type"
                  value="Root"
                  id="rootCrt"
                  checked={type === "Root"}
                  onChange={onOptionChange}
                />
                <label htmlFor="root">Root</label>
              </span>
            )}
          </div>
        </div>
        <div className="row form">
          <span className="details">Certificate Issuer</span>
          <Select
            className="basic-single"
            classNamePrefix="select"
            isSearchable="true"
            name="issuer"
            options={options}
          />
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
    </div>
  );
}
export default CertificateRequest;
