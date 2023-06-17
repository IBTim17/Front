import React, { useState } from 'react';
import "./AllCertificateRequests.css";
import CertificateRequest from "../CertificateRequest/CertificateRequest";
import ReactModal from "react-modal";
import {render} from "@testing-library/react";

function AllCertificateRequests() {
    const [certificates, setCertificates] = useState([]);
    const [showDeclineReason, setShowDeclineReason] = useState(false);
    const [requestForm, setRequestForm] = useState({
        id: '',
        reason: '',
    });
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const hasLoaded = true; // Replace with your actual logic for determining if the component has loaded

    const showRequest = (certificate) => {
        // Implement the logic for showing the request details
    };

    const acceptDecline = () => {
        // Implement the logic for accepting or declining the request
    };

    const acceptPressed = () => {
        // Implement the logic when the accept button is pressed
    };

    const declinePressed = () => {
        // Implement the logic when the decline button is pressed
    };

    render()
    {
        return (
            <>
                <div className="table-wrapper">
                    <button
                        id="addBtn" onClick={() => {
                        this.openAddModal();
                    }}
                    >Add
                    </button>
                    <button style={{marginLeft: "15px"}}
                            id="addBtn" onClick={() => {
                        this.logout();
                    }}
                    >Logout
                    </button>
                    {this.state.isOpenAddModal && <CertificateRequest></CertificateRequest>}
                    <table className="fl-table">
                        <thead>
                        <tr>
                            <th>Type</th>
                            <th>Start Date</th>
                            <th>Email</th>
                            <th>First name</th>
                            <th>Last name</th>
                            <th>Validate</th>
                            <th>Download</th>
                            <th>Revoke</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.certificates.map((certificate) => (
                            <tr key={certificate.serialNumber}>
                                <td>{certificate.type}</td>
                                <td>{certificate.startDate}</td>
                                <td>{certificate.ownerEmail}</td>
                                <td>{certificate.ownerName}</td>
                                <td>{certificate.ownerLastName}</td>
                                <td>
                                    <button
                                        onClick={() =>
                                            this.handleCheckValidity(certificate.serialNumber)
                                        }
                                    >
                                        Check Validity
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => this.downloadCrt(certificate.serialNumber)}
                                    >
                                        Download
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => this.showModal(certificate.serialNumber)}
                                    >
                                        Revoke
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <ReactModal
                        isOpen={this.state.showModal}
                        contentLabel="Revoke Reason Modal"
                        appElement={document.getElementById("root")}
                    >
                        <form className="input-box1" onSubmit={this.handleSubmit}>
                            <span className="details">Reason</span>
                            <input
                                type="text"
                                placeholder="Reason for revoking certificate"
                                value={this.state.reason}
                                onChange={this.handleReason}
                                required
                            />
                            <div className="button">
                                <input type="submit" value="Submit"/>
                            </div>
                        </form>
                    </ReactModal>
                </div>
            </>
        );
    }


}

export default AllCertificateRequests;
