import React from "react";
import axios from "axios";
import "./CertificatesTable.css";
import ReactModal from "react-modal";
import CertificateRequest from "../CertificateRequest/CertificateRequest";

class CertificateTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      certificates: [],
      showModal: false,
      reason: "",
      serialNumber: "",
      isOpenAddModal: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleReason = (event) => {
    this.setState({ reason: event.target.value });
  };

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ showModal: false });
    this.revokeCrt(this.state.serialNumber);
    this.setState({ reason: "" });
  }

  showModal = (serialNumber) => {
    this.setState({ showModal: true });
    this.setState({ serialNumber: serialNumber });
  };

  openAddModal = (event) => {
    this.setState({ isOpenAddModal: true});
    console.log(this.state.isOpenAddModal);
  };

  logout = (event) => {
    localStorage.removeItem("access_token");
    window.location.replace("/login");
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
        responseType: "arraybuffer",
      })
      .then((response) => {
        console.log(response);
        try {
          console.log(response.headers["content-type"]);

          if (response.headers["content-type"] === "application/zip") {
            const url = window.URL.createObjectURL(
              new Blob([response.data], { type: "application/zip" })
            );
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

  revokeCrt = (serialNumber) => {
    axios
      .put(
        `http://localhost:8080/api/certificate/revoke/${serialNumber}`,
        { reason: this.state.reason },
        {
          headers: {
            "x-auth-token": localStorage.getItem("access_token"),
          },
        }
      )
      .then((response) => {
        console.log(response);
        alert(response.data.message);
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  render() {
    return (
      <>
        <div className="table-wrapper">
          <button
            id="addBtn" onClick={() => {
              this.openAddModal();
            }}
          >Add</button>
          <button style={{marginLeft: "15px"}}
            id="addBtn" onClick={() => {
              this.logout();
            }}
          >Logout</button>
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
                <input type="submit" value="Submit" />
              </div>
            </form>
          </ReactModal>
        </div>
      </>
    );
  }
}

export default CertificateTable;
