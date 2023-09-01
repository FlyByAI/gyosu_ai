import React from 'react';
import Accordion from '../components/Accordion';
import GridContainer3x3 from '../components/grids/GridContainer3x3';
import { notSecretConstants } from '../constants/notSecretConstants';
import { useClerk, useUser } from '@clerk/clerk-react';
import useGetDocumentDownloads from '../hooks/tools/math/useGetDocumentDownloads';


export interface DocumentDownload {
    title: string;
    url: string;
    blobName: string;
    createdAt: string;
}

const Documents: React.FC = () => {
    // finish this
    const { documentDownloads, isLoading, error } = useGetDocumentDownloads(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/document/downloads/`)

    const user = useUser();

    return (
        <>
            {documentDownloads && documentDownloads.length > 0 ? (
                <div className="flex justify-center items-center">
                    <Accordion title={"Search Results"} visible={true}>
                        <GridContainer3x3>
                            fill in document details here...
                        </GridContainer3x3>
                    </Accordion>
                </div>
            ) : documentDownloads ? (
                <Accordion title={"Search Results"} visible={true}>
                    <div className="text-red-100">No results found. Try searching for something else.</div>
                </Accordion>
            ) : null}

            {error && <p className="text-red-600 mt-4 text-center">Error: {error.message}</p>}
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
