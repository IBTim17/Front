import './ValidateCertificateCopy.css'
import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import ReactModal from "react-modal";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ValidateCertificateCopy() {
    const [isShownUpload, setIsShownUpload] = useState(false);
    const [isValidUpload, setIsValidUpload] = useState(false);
    const [errorMessageUpload, setErrorMessageUpload] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName,setFileName] = useState('')


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedFile) {
            alert('Please insert a file');
            return;
        }

        const formData = new FormData();
        formData.append('file',selectedFile);

        await axios
            .post(`http://localhost:8080/api/certificate/isvalidcert`, formData)
            .then((response) => {
                setIsValidUpload(response.data);
                setIsShownUpload(true);
            })
            .catch((error) => {
                console.log(error);
                setErrorMessageUpload(error.response?.data?.message || 'An error occurred');
            });
    };

    const onFileSelected = (event) => {
        const MAX_FILE_SIZE_BYTES = 1073741824;
        const fileUpload = event.target.files[0];

        if (!fileUpload){
            return;
        }

        const fileName = fileUpload.name;
        const fileExtension = fileName.split('.').pop().toLowerCase();

        if (fileExtension !== 'crt') {
            alert('The selected file must have a ".crt" extension');
            this.file = null;
            setSelectedFile(null);
            setFileName("");
            return;
        }

        if (fileUpload.size > MAX_FILE_SIZE_BYTES) {
            alert('File size is too large, please select a file smaller than 1GB.');
            this.file = null;
            setSelectedFile(null);
            setFileName("");
            return;
        }

        setSelectedFile(fileUpload);
        setFileName(fileUpload.name);
    };

    return (
        <div className="">
            <div className="row text-center">
                <div className="col-12 mb-5">
                    <h4>Check by uploading a copy of the certificate</h4>
                </div>

                <div className="col-12 mt-3">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                placeholder="id"
                                type="file"
                                className="form-control"
                                onChange={onFileSelected}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </form>
                </div>

                <div className="col-12 m-3">
                    {isShownUpload && isValidUpload === true && (
                        <div className="alert alert-primary" role="alert">
                            The certificate is <b>VALID</b>
                        </div>
                    )}

                    {isShownUpload && isValidUpload === false && (
                        <div className="alert alert-danger" role="alert">
                            The certificate is <b>INVALID</b>
                        </div>
                    )}

                    {errorMessageUpload !== '' && (
                        <div className="alert alert-danger" role="alert">
                            {errorMessageUpload}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ValidateCertificateCopy;
