import React, { useState } from 'react';
import "./AllCertificateRequests.css";
import CertificateRequest from "../CertificateRequest/CertificateRequest";
import ReactModal from "react-modal";
import {render} from "@testing-library/react";
import axios from "axios";

class AllCertificateRequests extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            certificateRequests: [],
            reason:''
        };
        //this.handleSubmit = this.handleSubmit.bind(this);
        const queryParams = new URLSearchParams(window.location.search);
        if (queryParams.has("token") && queryParams.has("refresh_token")) {
            localStorage.setItem('access_token', queryParams.get("token"));
            localStorage.setItem('refresh_token',queryParams.get("refresh_token"))
        }
    }

    componentDidMount() {
        this.fetchCertificateRequests();
    }

    fetchCertificateRequests() {
        axios
            .get("http://localhost:8080/api/requests/list-all", {
                headers: {
                    "x-auth-token": localStorage.getItem("access_token"),
                },
            })
            .then((response) => this.setState({ certificateRequests: response.data }))
            .catch((error) => {
                // console.log("Error fetching certificates: ", error);
                if (error.response.status === 401) {
                    //localStorage.removeItem("access_token");
                    window.location.replace("/");
                }
            });
    }

    acceptCSR = (serialNumber) => {
        axios
            .put(`http://localhost:8080/api/requests/approve/${serialNumber}`, {
                headers: {
                    "x-auth-token": localStorage.getItem("access_token"),
                },
            })
            .then((response) => {
                const approved = response.data;
                alert(approved)
            })
            .catch((error) => {
                console.error(`Error approving certificate: ${error}`);
                if (error.response.status === 401) {
                    localStorage.removeItem("access_token");
                    // window.location.replace("/login");
                }
            });
    };

    declineCSR = (serialNumber) => {
        axios
            .put(`http://localhost:8080/api/requests/decline/${serialNumber}`, {
                headers: {
                    "x-auth-token": localStorage.getItem("access_token"),
                },
            })
            .then((response) => {
                const declined = response.data;
                alert(declined)
                //alert(valid ? "Certificate is valid!" : "Certificate is invalid!");
            })
            .catch((error) => {
                console.error(`Error declining certificate: ${error}`);
                if (error.response.status === 401) {
                    localStorage.removeItem("access_token");
                    // window.location.replace("/login");
                }
            });
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
                    {/*{this.state.isOpenAddModal && <CertificateRequest></CertificateRequest>}*/}
                    <table className="fl-table">
                        <thead>
                        <tr>
                            <th>Type</th>
                            <th>Start Date</th>
                            <th>Email</th>
                            <th>First name</th>
                            <th>Last name</th>
                            <th>Accept</th>
                            <th>Decline</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.certificateRequests.map((certificateRequest) => (
                            <tr key={certificateRequest.serialNumber}>
                                <td>{certificateRequest.type}</td>
                                <td>{certificateRequest.startDate}</td>
                                <td>{certificateRequest.ownerEmail}</td>
                                <td>{certificateRequest.ownerName}</td>
                                <td>{certificateRequest.ownerLastName}</td>
                                <td>
                                    <button
                                        onClick={() => this.acceptCSR(certificateRequest.serialNumber)}
                                    >
                                        Accept
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => this.declineCSR(certificateRequest.serialNumber)}
                                    >
                                        Decline
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }


}

export default AllCertificateRequests;
