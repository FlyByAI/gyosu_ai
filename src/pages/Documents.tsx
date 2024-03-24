import { useUser } from '@clerk/clerk-react';
import React from 'react';
import useCreateAnswerKey from '../hooks/tools/math/useCreateAnswerKey';
import useGetDocumentDownload from '../hooks/tools/math/useGetDocumentDownload';
import useGetDocumentDownloads from '../hooks/tools/math/useGetDocumentDownloads';
import useEnvironment from '../hooks/useEnvironment';
import { useRequireSignIn } from '../hooks/useRequireSignIn';
import { Chunk } from '../interfaces';
import DocxSVG from '../svg/DocxSVG';
import PdfSVG from '../svg/PdfSVG';


export interface DocumentDownload {
    id: number;
    blobName: string;
    docType: 'pdf' | 'docx';
    timestamp: string;
    shared: boolean;
    timesDownloaded: number;
    sourceData: Chunk[];
    signedUrl?: string;
    documentOrAnswerKey: "document" | "answer_key";
}

interface AnswerKeyResponse {
    blobName: string;
    signedUrl?: string;
}

const Documents: React.FC = () => {

    useRequireSignIn();

    const { apiUrl } = useEnvironment();
    const { documentDownloads, isLoading, error } = useGetDocumentDownloads(`${apiUrl}/math_app/cloud_storage_document/list/`)
    const { getDocumentDownload, isLoading: isDownloadLoading, data, error: downloadError } = useGetDocumentDownload(`${apiUrl}/math_app`);
    const { createAnswerKey, isLoading: isAnswerKeyLoading, error: answerKeyError } = useCreateAnswerKey(`${apiUrl}/math_app`);

    const user = useUser();

    const handleDocumentClick = (blobName: string, documentOrAnswerKey: "document" | "answer_key") => {
        const newWindow = window.open('', '_blank');
        getDocumentDownload(blobName, newWindow, documentOrAnswerKey);
    };

    const handleGenerateAnswerKey = (id: number | string, blobName: string) => {
        createAnswerKey(id, blobName);
    };

    return (
        <>
            {!isLoading && documentDownloads ? (
                <div className="flex justify-center items-center mt-4 bg-base-200">
                    <div className="w-full max-w-4xl bg-base-200 rounded-box p-4">
                        {documentDownloads.length > 0 ? (
                            <ul className="menu menu-compact flex flex-col space-y-4">
                                {documentDownloads.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                    .map((doc) => (
                                        <li key={doc.id} className="border-base-200 border rounded-box">
                                            <div className='flex justify-between items-center p-4 bg-base-100'>
                                                <div className='flex flex-col space-y-2'>
                                                    <span className="link link-hover" onClick={() => handleDocumentClick(doc.blobName, "document")}>
                                                        {doc.blobName}
                                                    </span>
                                                    <span>Document Type: {doc.docType}</span>
                                                    <span>Timestamp: {new Date(doc.timestamp).toLocaleString()}</span>
                                                    <span>Shared: {doc.shared ? 'Yes' : 'No'}</span>
                                                    <span>Times Downloaded: {doc.timesDownloaded}</span>
                                                    {!doc.blobName ? (
                                                        <span className="text-error">No Answer Key</span>
                                                    ) : (
                                                        <span className="link link-hover" onClick={() => handleDocumentClick(doc.blobName, "answer_key")}>
                                                            Download Answer Key
                                                        </span>
                                                    )}
                                                </div>
                                                <div className='flex flex-row items-center space-x-4'>
                                                    {doc.docType.toUpperCase() === "PDF" && (
                                                        <div onClick={() => handleDocumentClick(doc.blobName, "document")}>
                                                            <span className="card cursor-pointer">
                                                            <PdfSVG height="80px" width="80px" color="#cc1510" className='bg-white py-1 rounded-md mb-2' />
                                                                Download PDF
                                                            </span>
                                                        </div>
                                                    )}
                                                    {doc.docType.toUpperCase() === "DOCX" && (
                                                        <div onClick={() => handleDocumentClick(doc.blobName, "document")}>
                                                            <span className="card cursor-pointer">
                                                            <DocxSVG height="80px" width="80px" color="#0167b3" className='bg-white py-1 rounded-md mb-2' />

                                                                Download DOCX
                                                            </span>
                                                        </div>
                                                    )}
                                                    {doc.blobName && (
                                                        <div onClick={() => handleDocumentClick(doc.blobName, "answer_key")}>
                                                            <span className="card cursor-pointer">
                                                                <PdfSVG height="80px" width="80px" color="#ebb305" className='bg-white py-1 rounded-md mb-2' />
                                                                Answer Key
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                        ) : (
                            <div className="text-base-content">You don't have any documents yet.</div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-base-content mt-4 text-center h-screen">
                    Loading...
                </div>
            )}
            {error && <p className="text-error mt-4 text-center">Error: {error.message}</p>}
            {error && !user?.user?.username && <p className="text-error mt-4 text-center">Note: Our tools require you to be signed in.</p>}
        </>

    );
};

export default Documents;
