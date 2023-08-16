import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useGetDocument from '../../hooks/tools/math/useGetDocument';
import { ChunkComponent } from '../../components/AST';
import { notSecretConstants } from '../../constants/notSecretConstants';
import DocumentShelf from '../../components/math/DocumentShelf';
import ProblemManagerV2 from '../../components/math/ProblemManagerV2';

import { Document, ProblemData } from '../../interfaces';
// interface DocumentParams {
//     id: string;
// }

const DocumentDisplay: React.FC = () => {
    const { id } = useParams();
    const { getDocument, isLoading, error, document } = useGetDocument(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/document`);

    const [chat, setChat] = useState<string>('');

    useEffect(() => {
        getDocument(Number(id));
    }, [id, getDocument]);

    useEffect(() => {
        console.log("document", document)
    }, [document]);

    if (isLoading) {
        return <div className="text-white">Loading...</div>;
    }

    if (error) {
        return <div className="text-white">Error: {error}</div>;
    }

    if (!document) {
        return <div className="text-white">No document found</div>;
    }

    return (
        <div className='flex'>
            <DocumentShelf />
            <div className="w-5/6">
                <h1>{document.title}</h1>
                <ProblemManagerV2
                    chunkArray={document.content}
                    setChat={setChat}
                    problemData={{} as ProblemData}
                />
                {document && document?.content?.map((chunk, index) => (
                    <ChunkComponent key={index} content={chunk} />
                ))}
            </div>
        </div>
    );
};

export default DocumentDisplay;