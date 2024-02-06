import { useUser } from '@clerk/clerk-react';
import React from 'react';
import Accordion from '../components/Accordion';
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
                <div className="flex justify-center items-center  mt-4">
                    <Accordion title={"Documents"} visible={true}>
                        {documentDownloads.length > 0 ?
                            <ul className="list-inside space-y-4 text-white mt-4">
                                {documentDownloads.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                    .map((doc) => (
                                        <div key={doc.id}>
                                            <li className="border rounded p-4 flex flex-row justify-between">
                                                <div className='w-3/4'>
                                                    <div onClick={() => handleDocumentClick(doc.blobName, "document")}>
                                                        <span className="text-blue-300 hover:underline cursor-pointer">
                                                            {doc.blobName}
                                                        </span>
                                                    </div>
                                                    <div>Document Type: {doc.docType}</div>
                                                    <div>Timestamp: {new Date(doc.timestamp).toLocaleString()}</div>
                                                    <div>Shared: {doc.shared ? 'Yes' : 'No'}</div>
                                                    <div>Times Downloaded: {doc.timesDownloaded}</div>
                                                    {!doc.blobName ? <div>
                                                        <span className="text-white-300 hover:underline cursor-pointer">
                                                            No Answer Key
                                                        </span>
                                                    </div> :
                                                        <div onClick={() => handleDocumentClick(doc.blobName, "answer_key")}>
                                                            <span className="text-yellow-300 hover:underline cursor-pointer">
                                                                Download Answer Key
                                                            </span>
                                                        </div>
                                                    }
                                                </div>
                                                <div className='w-1/4 flex flex-row justify-between'>
                                                    {doc.docType.toUpperCase() == "PDF" &&
                                                        <div onClick={() => handleDocumentClick(doc.blobName, "document")} className="w-1/2">
                                                            <span className="text-blue-300 hover:underline cursor-pointer">
                                                                <PdfSVG height="80px" width="80px" color="#cc1510" className='bg-white py-1 rounded-md mb-2' />
                                                                Download {doc.docType.toUpperCase()}
                                                            </span>
                                                        </div>
                                                    }
                                                    {doc.docType.toUpperCase() == "DOCX" &&
                                                        <div onClick={() => handleDocumentClick(doc.blobName, "document")} className="w-1/2">
                                                            <span className="text-blue-300 hover:underline cursor-pointer">
                                                                <DocxSVG height="80px" width="80px" color="#0167b3" className='bg-white py-1 rounded-md mb-2' />
                                                                Download {doc.docType.toUpperCase()}
                                                            </span>
                                                        </div>
                                                    }
                                                    {!doc.blobName ? <div className="w-1/2">
                                                        <span className="text-white-300 ">
                                                            No Answer Key
                                                        </span>
                                                    </div> :
                                                        <div onClick={() => handleDocumentClick(doc.blobName, "answer_key")} className="w-1/2">
                                                            <span className="text-yellow-500 hover:underline cursor-pointer">
                                                                <PdfSVG height="80px" width="80px" color="#ebb305" className='bg-white py-1 rounded-md mb-2' />
                                                                Download Answer Key
                                                            </span>
                                                        </div>
                                                    }
                                                </div>
                                            </li>


                                        </div>

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
