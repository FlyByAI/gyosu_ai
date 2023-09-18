import React, { useEffect } from 'react';
import Accordion from '../components/Accordion';
import { useClerk, useUser } from '@clerk/clerk-react';
import useGetDocumentDownloads from '../hooks/tools/math/useGetDocumentDownloads';
import useGetDocumentDownload from '../hooks/tools/math/useGetDocumentDownload';
import { Chunk } from '../interfaces';
import useEnvironment from '../contexts/useEnvironment';


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

    const { session, openSignIn } = useClerk();

    useEffect(() => {
        if (!session) {
            openSignIn()
        }
    }, [session, openSignIn])

    const { apiUrl } = useEnvironment();
    const { documentDownloads, isLoading, error } = useGetDocumentDownloads(`${apiUrl}/math_app/cloud_storage_document/list/`)
    const { getDocumentDownload, isLoading: isDownloadLoading, data, error: downloadError } = useGetDocumentDownload(`${apiUrl}/math_app`);

    const user = useUser();

    const handleDocumentClick = (blobName: string) => {
        const newWindow = window.open('', '_blank'); // Preemptively open a new window
        getDocumentDownload(blobName, newWindow);  // Fetch the document and populate the new window
    };

    useEffect(() => {
        if (data?.signedUrl) {
            window.location.href = data.signedUrl;
        }
    }, [data]);

    return (
        <>
            {!isLoading && documentDownloads ? (
                <div className="flex justify-center items-center  mt-4">
                    <Accordion title={"Documents"} visible={true}>
                        {documentDownloads.length > 0 ?
                            <ul className="list-inside space-y-4 text-white mt-4">
                                {documentDownloads.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                    .map((doc) => (
                                        <li key={doc.id} className="border rounded p-4">
                                            <div onClick={() => handleDocumentClick(doc.blobName)}>
                                                <span className="text-blue-300 hover:underline cursor-pointer">
                                                    {doc.blobName}
                                                </span>
                                            </div>
                                            <div>Document Type: {doc.docType}</div>
                                            <div>Timestamp: {new Date(doc.timestamp).toLocaleString()}</div>
                                            <div>Shared: {doc.shared ? 'Yes' : 'No'}</div>
                                            <div>Times Downloaded: {doc.timesDownloaded}</div>
                                            {/* Add other fields as needed */}
                                        </li>
                                    ))}
                            </ul> :
                            <div className='text-white'>
                                "You don't have any documents yet. "
                            </div>
                        }
                    </Accordion>
                </div>
            ) : <div className="text-white mt-4 text-center h-screen">
                Loading...
            </div>}

            {error && <p className="text-red-600 mt-4 text-center">Error: {error.message}</p>}
            {downloadError && <p className="text-red-600 mt-4 text-center">Download Error: {downloadError.message}</p>}
            {error && !user?.user?.username && <p className="text-red-600 mt-4 text-center">Note: Our tools require you to be signed in.</p>}

            {isDownloadLoading && <p className="dark:text-white">Loading...</p>}
            {isDownloadLoading && (
                <div className="flex justify-center mt-4">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                </div>
            )}
        </>
    );
};

export default Documents;
