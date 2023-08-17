import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const YandexDiskUploader = ({ token, folder }) => {
    const [uploading, setUploading] = useState(false);
    const [fileStatus, setFileStatus] = useState({});
    const [acceptedFiles, setAcceptedFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const handleFileUploaded = (fileName) => {
        setFileStatus(prevState => ({
            ...prevState,
            [fileName]: 'Отправлено',
        }));
        setAcceptedFiles(prevState => prevState.filter(file => file.name !== fileName));
        setUploadedFiles(prevState => [...prevState, fileName]);
    };

    const handleUploadButtonClick = async () => {
        try {
            setUploading(true);

            for (const fileName of Object.keys(fileStatus)) {
                const file = acceptedFiles.find(file => file.name === fileName);
                const formData = new FormData();
                formData.append('file', file);

                const uploadUrlResponse = await axios.get(
                    'https://cloud-api.yandex.net/v1/disk/resources/upload',
                    {
                        params: {
                            path: `/${folder}/${fileName}`,
                            overwrite: true,
                        },
                        headers: {
                            Authorization: `OAuth ${token}`,
                        },
                    }
                );

                const uploadUrl = uploadUrlResponse.data.href;
                await axios.put(uploadUrl, formData, {
                    headers: {
                        'Content-Type': 'application/octet-stream',
                    },
                });

                console.log(`${fileName} успешно загружен на Яндекс.Диск.`);
                handleFileUploaded(fileName);
            }

            setFileStatus({});
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
        } finally {
            setUploading(false);
        }
    };

    const onDrop = useCallback((acceptedFiles) => {
        const updatedFileStatus = {};
        acceptedFiles.forEach(file => {
            updatedFileStatus[file.name] = 'Готов к отправке';
        });
        setFileStatus(updatedFileStatus);
        setAcceptedFiles(acceptedFiles);
    }, []);

    const {
        getRootProps,
        getInputProps,
        isDragActive,
    } = useDropzone({
        accept: '*',
        multiple: true,
        maxSize: 1024 * 1024 * 10,
        maxFiles: 100,
        onDrop,
    });

    return (
        <div className="container mt-5">
            <div
                {...getRootProps()}
                className={`dropzone ${isDragActive ? 'active' : ''}`}
                style={{
                    border: '2px dashed #ccc',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                }}
            >
                <input {...getInputProps()} />
                <p style={{margin: 0}}>Перетащите файлы сюда или кликните, чтобы выбрать файлы.</p>
            </div>
            {uploading && (
                <div className="mt-3">
                    <p>Идет загрузка файлов...</p>
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            {Object.keys(fileStatus).length > 0 && !uploading && (
                <div className="mt-3">
                    <h4>Файлы для отправки:</h4>
                    <ul>
                        {Object.entries(fileStatus).map(([fileName, status]) => (
                            <li key={fileName}>
                                {fileName} - <span style={{ color: 'green' }}>{status}</span>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={handleUploadButtonClick}
                        className="btn btn-primary"
                    >
                        Отправить на Яндекс.Диск
                    </button>
                </div>
            )}
            {uploadedFiles.length > 0 && (
                <div className="mt-3">
                    <h4>Файлы, отправленные на Яндекс.Диск:</h4>
                    <ul>
                        {uploadedFiles.map(fileName => (
                            <li key={fileName}>
                                {fileName} - Отправлено
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default YandexDiskUploader;
