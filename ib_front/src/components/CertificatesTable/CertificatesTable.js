import React, { useState } from 'react';
import axios from 'axios';
import './CertificatesTable.css';
import getRole from '../../services/AuthService.js';
import CertificateRequest from '../CertificateRequest/CertificateRequest';

class CertificateTable extends React.Component {
    state = {
        certificates: []
    };
    // const [isOpen, setIsOpen] = useState(false);
    isOpen = false;
    

    createCrt() {
        // const [isOpen, setIsOpen] = useState(false);
        this.isOpen = true;
    };

    componentDidMount() {
        // getRole();
        axios.get('/api/certificates', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })
            .then(response => this.setState({ certificates: response.data }))
            .catch(error => console.error('Error fetching certificates: ', error));
    }

    handleCheckValidity = (serialNumber) => {
        axios.get(`/api/certificates/valid/${serialNumber}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })
            .then(response => {
                const valid = response.data;
                alert(valid ? 'Certificate is valid!' : 'Certificate is invalid!');
            })
            .catch(error => console.error(`Error checking certificate validity: ${error}`));
    };

    render() {
        return (
            <html>
                <head>
                    <title>Registration</title>
                    <meta charset="utf-8"></meta>
                    <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
                    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,700&display=swap"></link>
                    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
                </head>
                <body>
                    <span className="table-wrapper">
                        <button onClick={this.createCrt()}>Add</button>
                        {this.isOpen && (
                            <CertificateRequest />
                        )}
                    </span>
                    <div class="table-wrapper">
                        <table class="fl-table">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Start Date</th>
                                    <th>Email</th>
                                    <th>First name</th>
                                    <th>Last name</th>
                                    <th>Validate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.certificates.map((certificate) => (
                                    <tr key={certificate.id}>
                                        <td>{certificate.type}</td>
                                        <td>{certificate.startDate}</td>
                                        <td>{certificate.ownerEmail}</td>
                                        <td>{certificate.ownerName}</td>
                                        <td>{certificate.ownerLastName}</td>
                                        <td>
                                            <button onClick={() => this.handleCheckValidity(certificate.id)}>Check Validity</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </body>
            </html>
        );
    }
}

export default CertificateTable;