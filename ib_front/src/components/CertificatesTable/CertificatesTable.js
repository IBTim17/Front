import React from "react";
import axios from "axios";
import "./CertificatesTable.css";

class CertificateTable extends React.Component {
  state = {
    certificates: [],
  };

  componentDidMount() {
    axios
      .get("http://localhost:8080/api/certificate", {
        headers: {
          "x-auth-token": localStorage.getItem("access_token"),
        },
      })
      .then((response) => this.setState({ certificates: response.data }))
      .catch((error) => console.error("Error fetching certificates: ", error));
  }

  handleCheckValidity = (serialNumber) => {
    axios
      .get(`http://localhost:8080/api/certificate/valid/${serialNumber}`, {
        headers: {
          "x-auth-token": localStorage.getItem("access_token"),
        },
      })
      .then((response) => {
        const valid = response.data;
        alert(valid ? "Certificate is valid!" : "Certificate is invalid!");
      })
      .catch((error) =>
        console.error(`Error checking certificate validity: ${error}`)
      );
  };

  downloadCrt = (serialNumber) => {
    axios
      .get(`http://localhost:8080/api/certificate/download/${serialNumber}`, {
        headers: {
          "x-auth-token": localStorage.getItem("access_token"),
        },
        responseType: 'arraybuffer'
      })
      .then((response) => {
        console.log(response);
        try {
          console.log(response.headers["content-type"]);

          if (response.headers["content-type"] === "application/zip") {
            const url = window.URL.createObjectURL(new Blob([response.data],{type:'application/zip'}));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${serialNumber}.zip`);
            document.body.appendChild(link);
            link.click();
          } else {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${serialNumber}.crt`);
            document.body.appendChild(link);
            link.click();
          }
        } catch (e) {
          console.log(e);
        }
      })
      .catch((error) =>
        console.error(`Error downloading certificate : ${error}`)
      );
  };

  render() {
    return (
      <html>
        <head>
          <title>Registration</title>
          <meta charset="utf-8"></meta>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
          ></meta>
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,700&display=swap"
          ></link>
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
        </head>
        <body>
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
                  <th>Download</th>
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
                        onClick={() =>
                          this.downloadCrt(certificate.serialNumber)
                        }
                      >
                        Download
                      </button>
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
