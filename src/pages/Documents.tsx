import React, { useEffect } from 'react';
import Accordion from '../components/Accordion';
import { useClerk, useUser } from '@clerk/clerk-react';
import useGetDocumentDownloads from '../hooks/tools/math/useGetDocumentDownloads';
import useGetDocumentDownload from '../hooks/tools/math/useGetDocumentDownload';
import { Chunk } from '../interfaces';
import useEnvironment from '../hooks/useEnvironment';
import DocumentDetails from '../components/document/DocumentDetails';


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

    const user = useUser();

    return (
        <>
            {!isLoading && documentDownloads ? (
                <div className="flex justify-center items-center  mt-4">
                    <Accordion title={"Documents"} visible={true}>
                        {documentDownloads.length > 0 ?
                            <ul className="list-inside space-y-4 text-white mt-4">
                                {documentDownloads.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                    .map((doc) => (
                                        <DocumentDetails documentDownload={doc} />
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
