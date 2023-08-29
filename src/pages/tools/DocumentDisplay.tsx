import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useGetDocument from '../../hooks/tools/math/useGetDocument';
import { notSecretConstants } from '../../constants/notSecretConstants';
import DocumentShelf from '../../components/document/DocumentShelf';

import { Chunk } from '../../interfaces';
import MathProblem from '../../components/math/MathProblem';
import DocumentHeader from '../../components/document/DocumentHeader';
import AIChatSmallWrapper from '../../components/math/AIChatSmallWrapper';
import useSubmitDocument from '../../hooks/tools/math/useSubmitDocument';
import ChunkSidebarWrapper from '../../components/math/ChunkSidebarWrapper';
import PlusIcon from '../../svg/PlusIcon';

const DocumentDisplay: React.FC = () => {
    const { id } = useParams();
    const { isLoading, error, document } = useGetDocument(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/school_document/`, Number(id));

    const endpoint2 = `${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/school_document/`;
    const { updateDocument } = useSubmitDocument(endpoint2);

    if (isLoading) {
        return <div className="text-white">Loading...</div>;
    }

    if (error) {
        return (
            <div className='flex'>
                <DocumentShelf isExporting={false} />
                <div className="w-5/6">
                    <div className="text-white text-center mt-2">
                        Error: {error.message}
                    </div>
                    <div className="text-white text-center mt-4">
                        Document not found.
                    </div>
                </div>
            </div>
        );
    }

    if (!document) {
        return <div className="text-white">No document found</div>;
    }

    const insertChunk = (index: number) => {
        // Define an empty chunk with the type and empty content
        const emptyChunk: Chunk = { type: "chunk", content: [] };

        // Create a copy of the existing chunks and insert the empty chunk at the specified index
        const updatedChunks = [...(document.problemChunks || [])];
        updatedChunks.splice(index, 0, emptyChunk);

        // Create an updated document object with the new chunks array
        const updatedDocument = { ...document, problemChunks: updatedChunks };

        // Submit the change, triggering the updateDocument mutation
        updateDocument({ document: updatedDocument });
    };


    const deleteChunk = (index: number) => {
        // Create a copy of the existing chunks and remove the chunk at the specified index
        const updatedChunks = [...(document.problemChunks || [])];
        updatedChunks.splice(index, 1);

        // Create an updated document object with the new chunks array
        const updatedDocument = { ...document, problemChunks: updatedChunks };

        // Submit the change, triggering the updateDocument mutation
        updateDocument({ document: updatedDocument });
    };



    const updateDocumentChunk = (chunk: Chunk, index: number) => {
        // Update the specific chunk in the document

        const updatedChunks = document.problemChunks?.map((c, i) => (i === index ? { ...chunk, id: undefined } : c)) || [];
        const updatedDocument = { ...document, problemChunks: updatedChunks };

        // Submit the change, triggering the updateDocument mutation
        updateDocument({ document: updatedDocument });
    };

    return (
        <div className='flex'>
            <DocumentShelf isExporting={false} />
            <div className="w-5/6" style={{ marginRight: '16.6667%' }}>
                <DocumentHeader document={document} />
                <ChunkSidebarWrapper
                    document={document}
                >
                    {document.problemChunks
                        && document.problemChunks.length > 0
                        && document.problemChunks?.map((chunk, chunkIndex) => {
                            return (
                                <div
                                    key={chunkIndex} className='w-3/4 mx-auto flex flex-row mb-4 bg-gray-900 p-2'>
                                    <div className='w-full rounded-xl' >
                                        <AIChatSmallWrapper chunk={chunk} index={chunkIndex}
                                            updateChunk={updateDocumentChunk}
                                        >
                                            <MathProblem
                                                insertChunk={insertChunk}
                                                updateChunk={updateDocumentChunk}
                                                key={chunkIndex}
                                                chunkIndex={chunkIndex}
                                                problem={chunk}
                                            />
                                        </AIChatSmallWrapper>
                                    </div>

                                </div>
                            )
                        })}
                    {<div className='w-3/4 mx-auto flex flex-row mb-4 bg-gray-900 p-2 justify-center'>
                        {<button onClick={() => insertChunk((document.problemChunks?.length || 0) + 1)} className="pe-1 text-green-500">
                            <PlusIcon />
                        </button>}
                    </div>}
                </ChunkSidebarWrapper>
            </div>
        </div>
    );
};

export default DocumentDisplay;