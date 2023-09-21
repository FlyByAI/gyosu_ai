import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useGetDocument from '../hooks/tools/math/useGetDocument';
import ProblemBankShelf from '../components/document/ProblemBankShelf';

import { Chunk } from '../interfaces';
import MathProblem from '../components/math/MathProblem';
import useSubmitDocument from '../hooks/tools/math/useSubmitDocument';
import PlusIcon from '../svg/PlusIcon';
import useEnvironment from '../hooks/useEnvironment';
import CreateDocxModal from '../components/CreateDocxModal';
import { useSidebarContext } from '../contexts/useSidebarContext';
import SearchIcon from '../svg/SearchIcon';
import { useScreenSize } from '../contexts/ScreenSizeContext';

const ProblemBank: React.FC = () => {
    const { id } = useParams();
    const { apiUrl } = useEnvironment();
    const { isLoading, error, document } = useGetDocument(`${apiUrl}/math_app/school_document/`, Number(id));

    const endpoint2 = `${apiUrl}/math_app/school_document/`;
    const { updateDocument } = useSubmitDocument(endpoint2);

    const { activeChunkIndices, setActiveChunkIndices } = useSidebarContext();

    const { isDesktop } = useScreenSize();

    if (isLoading) {
        return <div className="text-white">Loading...</div>;
    }

    if (error) {
        return (
            <div className='flex'>
                <ProblemBankShelf isExporting={false} />
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
        <div className='flex '>
            <ProblemBankShelf isExporting={false} />
            <div className="w-5/6 mt-4 overflow-x-hidden" style={{ marginRight: isDesktop ? '16.6667%' : "0" }}>
                <div className='w-full md:w-3/4 mx-auto py-2'>
                    <CreateDocxModal enabled={activeChunkIndices.length > 0} document={document} modalId={"createDocx"} />
                </div>
                {/* <DocumentHeader document={document} /> */}
                <h2 className="text-center text-xl text-white my-4">Problem Bank: {document.title}</h2>
                {document && document.problemChunks
                    && document.problemChunks.length > 0
                    && document.problemChunks?.map((chunk, chunkIndex) => {
                        return (
                            <div
                                key={chunkIndex} className='w-full md:w-3/4 mx-auto flex flex-row mb-4 bg-gray-900 p-2'>
                                <div className='w-full rounded-xl' >
                                    <MathProblem
                                        insertChunk={insertChunk}
                                        selectable={true}
                                        disableInstructionProblemDrag={true}
                                        updateChunk={updateDocumentChunk}
                                        key={chunkIndex}
                                        chunkIndex={chunkIndex}
                                        problem={chunk}
                                        enableTools={true}
                                    />
                                </div>

                            </div>
                        )
                    })}
                {document && document.problemChunks && document.problemChunks.length === 0 &&
                    <div className="flex flex-col items-center">
                        <div className="text-white text-center my-4">
                            You don't have any problems in this banks yet, try
                            <Link to="/math-app" className="px-2 text-blue-300 text-bold underline">
                                Search
                            </Link>

                        </div>

                    </div>}

                {/* Once we have a trained AI for adding problems from text input, I would like to do that here.. */}
                {/* {<div className='w-3/4 mx-auto flex flex-row mb-4 bg-gray-900 p-2 justify-center'>
                    {<button onClick={() => insertChunk((document.problemChunks?.length || 0) + 1)} className="pe-1 text-green-500">
                        <PlusIcon />
                    </button>}
                </div>} */}
            </div>
        </div>
    );
};

export default ProblemBank;