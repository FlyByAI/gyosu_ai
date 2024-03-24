import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useGetDocument from '../hooks/tools/math/useGetDocument';

import CreateDocxModal from '../components/CreateDocxModal';
import MathProblem from '../components/math/MathProblem';
import { useScreenSize } from '../contexts/ScreenSizeContext';
import { useSidebarContext } from '../contexts/useSidebarContext';
import useSubmitDocument from '../hooks/tools/math/useSubmitDocument';
import useEnvironment from '../hooks/useEnvironment';
import { Chunk } from '../interfaces';

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
                <div className="text-white text-center mt-2">
                    Error: {error.message}
                </div>
                <div className="text-white text-center mt-4">
                    Document not found.
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

        const updatedChunks = document.problemChunks?.map((c, i) => (i === index ? { ...chunk, id: undefined } : c)) || [];
        const updatedDocument = { ...document, problemChunks: updatedChunks };

        updateDocument({ document: updatedDocument });
    };


    return (
        <div className='flex'>

            <CreateDocxModal enabled={activeChunkIndices.length > 0} document={document} modalId="createDocx" />

            <div className="w-5/6 flex-grow mt-4 overflow-x-hidden" style={{ marginRight: isDesktop ? '16.6667%' : "0" }}>
                <div className="space-y-4 bg-base-100 p-4 border border-base-300 text-base-content rounded-lg shadow">
                    <h2 className="text-center text-lg font-bold text-neutral">How to Create Your Worksheet</h2>
                    <ol className="list-decimal list-inside space-y-2">
                        <li className="italic">Select problems from the list below.</li>
                        <li className="italic">Click "Create Worksheet" to generate your document.</li>
                    </ol>

                    {document.problemChunks && document?.problemChunks?.length > 0 ? (
                        document.problemChunks.map((chunk, chunkIndex) => (
                            <div key={chunkIndex} className='mx-auto mb-4 bg-base-200 p-4 rounded-lg shadow'>
                                <MathProblem
                                    insertChunk={insertChunk}
                                    selectable={true}
                                    disableInstructionProblemDrag={true}
                                    updateChunk={updateDocumentChunk}
                                    chunkIndex={chunkIndex}
                                    problem={chunk}
                                    enableTools={true}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="text-neutral text-center my-4">
                            You don't have any problems in this bank yet. Try
                            <Link to="/math-app" className="text-primary font-bold underline px-2">searching</Link> for some.
                        </div>
                    )}
                </div>
            </div>
        </div>



    );
};

export default ProblemBank;