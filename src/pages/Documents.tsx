import React, { useEffect } from 'react';
import Accordion from '../components/Accordion';
import { useClerk, useUser } from '@clerk/clerk-react';
import useGetDocumentDownloads from '../hooks/tools/math/useGetDocumentDownloads';
import useGetDocumentDownload from '../hooks/tools/math/useGetDocumentDownload';
import { Chunk } from '../interfaces';
import useEnvironment from '../hooks/useEnvironment';
import useCreateAnswerKey from '../hooks/tools/math/useCreateAnswerKey';


export interface DocumentDownload {
    id: number;
    blobName: string;
    docType: 'pdf' | 'docx';
    timestamp: string;
    shared: boolean;
    timesDownloaded: number;
    sourceData: Chunk[];
    signedUrl?: string;
    answerKey: {
        blobName: string;
        signedUrl?: string;
    };
}

interface AnswerKeyResponse {
    blobName: string;
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
    const { createAnswerKey, isLoading: isAnswerKeyLoading, error: answerKeyError } = useCreateAnswerKey(`${apiUrl}/math_app`);

    const user = useUser();

    const handleDocumentClick = (blobName: string) => {
        const newWindow = window.open('', '_blank');
        getDocumentDownload(blobName, newWindow);
    };

    const handleGenerateAnswerKey = (id: number | string, blobName: string) => {
        createAnswerKey(id, blobName);
    };

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
                                            {!doc.answerKey?.blobName ? <div onClick={() => handleGenerateAnswerKey(doc.id, doc.blobName)}>
                                                <span className="text-yellow-300 hover:underline cursor-pointer">
                                                    Generate Answer Key
                                                </span>
                                            </div> :
                                                <div onClick={() => handleDocumentClick(doc.answerKey.blobName)}>
                                                    <span className="text-yellow-300 hover:underline cursor-pointer">
                                                        Download Answer Key
                                                    </span>
                                                </div>
                                            }
                                        </li>
                                    ))}
                            </ul>
                            :
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
            {error && !user?.user?.username && <p className="text-red-600 mt-4 text-center">Note: Our tools require you to be signed in.</p>}
        </>
    );
};

export default Documents;
