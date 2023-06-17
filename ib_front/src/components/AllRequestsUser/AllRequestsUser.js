import React from "react";
import axios from "axios";
import "./AllRequestsUser.css";
import ReactModal from "react-modal";
import CertificateRequest from "../CertificateRequest/CertificateRequest";

class AllRequestsUser extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            certificateRequests: []
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

    logout = (event) => {
        localStorage.removeItem("access_token");
        window.location.replace("/login");
    };

    fetchCertificateRequests() {
        axios
            .get("http://localhost:8080/api/list-all", {
                headers: {
                    "x-auth-token": localStorage.getItem("access_token"),
                },
            })
            .then((response) => this.setState({ certificateRequests: response.data }))
            .catch((error) => {
                // console.log("Error fetching certificates: ", error);
                if (error.response.status === 401) {
                    localStorage.removeItem("access_token");
                    window.location.replace("/login");
                }
            });
    }
    render() {
        return (
            <>
                    {/*{this.state.isOpenAddModal && <CertificateRequest></CertificateRequest>}*/}
                    <table className="fl-table">
                        <thead>
                        <tr>
                            <th>Type</th>
                            <th>Owner email</th>
                            <th>Issuer</th>
                            <th>First name</th>
                            <th>Last name</th>
                            <th>State</th>
                            <th>Reject reason</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.certificateRequests.map((certificateRequest) => (
                            <tr key={certificateRequest.serialNumber}>
                                <td>{certificateRequest.type}</td>
                                <td>{certificateRequest.ownerEmail}</td>
                                <td>{certificateRequest.issuer}</td>
                                <td>{certificateRequest.ownerName}</td>
                                <td>{certificateRequest.ownerLastName}</td>
                                <td>{certificateRequest.state}</td>
                                <td>{certificateRequest.rejectReason}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
            </>
        );
    }
}
export default AllRequestsUser;