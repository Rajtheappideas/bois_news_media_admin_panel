import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import BaseUrl from "../BaseUrl";

const DownloadButton = ({ filePath, label }) => {
    const { token } = useSelector((state) => state.root.auth);
    const [downloadLink, setDownloadLink] = useState(null);

    const handleDownload = async () => {
        try {
            const response = await fetch(`${BaseUrl}/api/admin/files/${filePath}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            });

            if (!response.ok) {
                console.error('Failed to download file:', response.statusText);
                // Handle the error, show a message, etc.
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            setDownloadLink(url);

            // Create a temporary link and trigger a click to start the download
            const a = document.createElement('a');
            a.href = url;
            a.download = filePath; // Use the provided file name
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
            // Handle the error, show a message, etc.
        }
    };

    return (
        <button onClick={handleDownload}>
            {label || `Download ${filePath}`}
        </button>
    );
};

export default DownloadButton;
