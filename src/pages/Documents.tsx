import React, { useEffect } from 'react';
import Accordion from '../components/Accordion';
import GridContainer3x3 from '../components/grids/GridContainer3x3';
import { notSecretConstants } from '../constants/notSecretConstants';
import { useClerk, useUser } from '@clerk/clerk-react';
import useGetDocumentDownloads from '../hooks/tools/math/useGetDocumentDownloads';
import useGetDocumentDownload from '../hooks/tools/math/useGetDocumentDownload';
import { Chunk } from '../interfaces';


export interface DocumentDownload {
    id: number;
    blobName: string;
    docType: 'pdf' | 'docx';
    timestamp: string;
    shared: boolean;
    timesDownloaded: number;
    sourceData: Chunk[];
    signedUrl?: string;
}

const Documents: React.FC = () => {
    // finish this
    const { documentDownloads, isLoading, error } = useGetDocumentDownloads(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/cloud_storage_document/list/`)
    const { getDocumentDownload, isLoading: isDownloadLoading, data, error: downloadError } = useGetDocumentDownload(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app`);

    const user = useUser();

    const handleDocumentClick = (blobName: string) => {
        getDocumentDownload(blobName);
    };

    useEffect(() => {
        if (data?.signedUrl) {
            window.location.href = data.signedUrl;
        }
    }, [data]);

    return (
        <>


            {!isLoading && documentDownloads && documentDownloads.length > 0 ? (
                <div className="flex justify-center items-center">
                    <Accordion title={"Documents"} visible={true}>
                        <ul className="list-inside space-y-4 text-white mt-4">
                            {documentDownloads.map((doc) => (
                                <li key={doc.id} className="border rounded p-4">
                                    <div onClick={() => handleDocumentClick(doc.blobName)}>
                                        <span className="text-blue-300 hover:underline cursor-pointer">
                                            {doc.blobName}
                                        </span>
                                    </div>
                                    <div>Document Type: {doc.docType}</div>
                                    <div>Timestamp: {doc.timestamp}</div>
                                    <div>Shared: {doc.shared ? 'Yes' : 'No'}</div>
                                    <div>Times Downloaded: {doc.timesDownloaded}</div>
                                    {/* Add other fields as needed */}
                                </li>
                            ))}
                        </ul>
                    </Accordion>
                </div>
            ) : <div className="text-white mt-4 text-center h-screen">
                {isLoading ? "Loading..." : "You don't have any documents yet."}
            </div>}

            {error && <p className="text-red-600 mt-4 text-center">Error: {error.message}</p>}
            {downloadError && <p className="text-red-600 mt-4 text-center">Download Error: {downloadError.message}</p>}
            {error && !user?.user?.username && <p className="text-red-600 mt-4 text-center">Note: Our tools require you to be signed in.</p>}

            {isLoading && <p className="dark:text-white">Loading...</p>}
            {isLoading && (
                <div className="flex justify-center mt-4">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                </div>
            )}
        </>
    );
};

export default Documents;
