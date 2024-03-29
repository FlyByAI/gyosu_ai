import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useGetDocument from '../hooks/tools/math/useGetDocument';

import ContentWrapper from '../components/ContentWrapper';
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

    const { activeChunkIndices } = useSidebarContext();

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

            <CreateDocxModal document={document} modalId="createDocx" />
            <ContentWrapper>
                <div className="w-full flex-grow mt-4 overflow-x-hidden pb-28">
                    <div className="space-y-4 bg-base-100 p-4 border border-base-300 rounded-lg shadow">
                        <h2 className="text-center text-xl  text-red-500 font-bold">NOTE: These features are experiemental and likely to break.</h2>
                        <h2 className="text-center text-lg font-bold">How to Create Your Worksheet</h2>
                        <ol className="list-inside space-y-2">
                            <li className="italic">First, add new problems using the "Add problem" button below. Alternatively, you can use Problem Search and select problems you like to be added to a specific problem bank. </li>
                            <li className="italic">Then, click "Export" once you have all the problems you want. This will export your problems to a word document and to a PDF. Once exported, these documents will show up in
                                <Link className="text-primary font-bold underline px-2" to='/math-app/documents'>my documents</Link>.</li>
                        </ol>


                        {document.problemChunks && document?.problemChunks?.length > 0 && <div className="text-center my-4">
                            Try
                            <Link to="/math-app" className="text-primary font-bold underline px-2">searching</Link>for some new problems here.
                        </div>}

                        {document.problemChunks && document?.problemChunks?.length > 0 ?

                            document.problemChunks.map((chunk, chunkIndex) => (
                                <div key={chunkIndex} className='mx-auto mb-4 bg-base-200 card p-4 rounded-lg shadow'>
                                    <MathProblem
                                        problemBankId={id}
                                        insertChunk={insertChunk}
                                        disableInstructionProblemDrag={true}
                                        updateChunk={updateDocumentChunk}
                                        chunkIndex={chunkIndex}
                                        problem={chunk}
                                        enableTools={true}
                                    />
                                </div>
                            )
                            ) : (
                                <div className="text-center my-4">
                                    You don't have any problems in this bank yet. Try
                                    <Link to="/math-app" className="text-primary font-bold underline px-2">searching</Link> for some.
                                </div>
                            )}

                        {
                            <button className='btn btn-primary'
                                onClick={() => insertChunk(document.problemChunks ? document.problemChunks.length : 0)}
                            > Add new chunk</button>
                        }
                    </div>
                </div>
            </ContentWrapper>
        </div>



    );
};

export default ProblemBank;