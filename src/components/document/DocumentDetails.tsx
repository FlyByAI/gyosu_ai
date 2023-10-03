import React, { useEffect } from 'react';
import useSubmitDocument from '../../hooks/tools/math/useSubmitDocument';
import { DocumentDownload } from '../../pages/Documents';
import useEnvironment from '../../hooks/useEnvironment';
import useGetDocumentDownload from '../../hooks/tools/math/useGetDocumentDownload';

interface DocumentDetailsProps {
    documentDownload: DocumentDownload;
}

const DocumentDetails: React.FC<DocumentDetailsProps> = ({ documentDownload }) => {
    const { apiUrl } = useEnvironment();

    const { getDocumentDownload, isLoading: isDownloadLoading, data, error: downloadError } = useGetDocumentDownload(`${apiUrl}/math_app`);


    const handleDocumentClick = (blobName: string) => {
        const newWindow = window.open('', '_blank'); // Preemptively open a new window
        getDocumentDownload(blobName, newWindow);  // Fetch the document and populate the new window
    };

    useEffect(() => {
        if (data?.signedUrl) {
            window.location.href = data.signedUrl;
        }
    }, [data]);

    const {
        blobName,
        docType,
        timestamp,
        timesDownloaded,
        id,
        shared
    } = documentDownload;

    return (
        <>
            <li className="border rounded p-4">
                <div onClick={() => handleDocumentClick(blobName)}>
                    <span className="text-blue-300 hover:underline cursor-pointer">
                        {blobName}
                    </span>
                </div>
                <div>Document Type: {docType}</div>
                <div>Timestamp: {new Date(timestamp).toLocaleString()}</div>
                <div>Shared: {shared ? 'Yes' : 'No'}</div>
                <div>Times Downloaded: {timesDownloaded}</div>
            </li>

            {downloadError && <p className="text-red-600 mt-4 text-center">Download Error: {downloadError.message}</p>}

            {isDownloadLoading && <p className="dark:text-white">Loading...</p>}
            {
                isDownloadLoading && (
                    <div className="flex justify-center mt-4">
                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                    </div>
                )
            }
        </>
    );
};

export default DocumentDetails;
