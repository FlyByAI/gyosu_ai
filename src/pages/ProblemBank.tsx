import React, { useCallback, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import useGetDocument from '../hooks/tools/math/useGetDocument';

import toast from 'react-hot-toast';
import ContentWrapper from '../components/ContentWrapper';
import CreateDocxModal from '../components/CreateDocxModal';
import { ChunkComponent } from '../components/ast/ChunkComponent';
import { useScreenSize } from '../contexts/ScreenSizeContext';
import { useSidebarContext } from '../contexts/useSidebarContext';
import useSubmitDocument from '../hooks/tools/math/useSubmitDocument';
import useEnvironment from '../hooks/useEnvironment';
import { Chunk, Document } from '../interfaces';
import ChevronDown from '../svg/ChevronDown';
import ChevronUp from '../svg/ChevronUp';
import PlusIcon from '../svg/PlusIcon';

const ProblemBank: React.FC = () => {
    const { id } = useParams();
    const { apiUrl } = useEnvironment();
    const { isLoading, error, document } = useGetDocument(`${apiUrl}/math_app/school_document/`, Number(id));

    const endpoint2 = `${apiUrl}/math_app/school_document/`;
    const { error: updateError, updateDocument, isLoading: isLoadingSubmit } = useSubmitDocument(endpoint2);

    const { activeChunkIndices } = useSidebarContext();

    const { isDesktop } = useScreenSize();


    const insertChunk = useCallback((index: number) => {
        // Define an empty chunk with the type and empty content
        const emptyChunk: Chunk = { type: "chunk", content: [] };

        // Create a copy of the existing chunks and insert the empty chunk at the specified index
        const updatedChunks = [...(document?.problemChunks || [])];
        updatedChunks.splice(index, 0, emptyChunk);

        // Create an updated document object with the new chunks array
        const updatedDocument = { ...document, problemChunks: updatedChunks };

        // Submit the change, triggering the updateDocument mutation
        updateDocument({ document: updatedDocument as Document });
    }, [document, updateDocument]);


    const deleteChunk = (index: number) => {
        // Create a copy of the existing chunks and remove the chunk at the specified index
        const updatedChunks = [...(document?.problemChunks || [])];
        updatedChunks.splice(index, 1);

        // Create an updated document object with the new chunks array
        const updatedDocument = { ...document, problemChunks: updatedChunks };

        // Submit the change, triggering the updateDocument mutation
        updateDocument({ document: updatedDocument as Document });
    };



    const updateDocumentChunk = (chunk: Chunk, index: number) => {

        const updatedChunks = document?.problemChunks?.map((c, i) => (i === index ? { ...chunk, id: undefined } : c)) || [];
        const updatedDocument = { ...document, problemChunks: updatedChunks };
        updateDocument({ document: updatedDocument as Document });
    };

    function moveChunk(document: Document, chunkIndex: number, direction: 'up' | 'down'): void {
        if (!document.problemChunks || document.problemChunks.length <= 1) {
            return;
        }

        const newIndex = direction === 'up' ? chunkIndex - 1 : chunkIndex + 1;

        // Make sure newIndex is within bounds
        if (newIndex < 0 || newIndex >= document.problemChunks.length) {
            return; // No operation if moving out of bounds
        }

        const newProblemChunks = document.problemChunks.map((chunk, index) => {
            if (index === chunkIndex && document.problemChunks) {
                return { ...document.problemChunks[newIndex] }; // Swap current chunk with the target
            } else if (index === newIndex && document.problemChunks) {
                return { ...document.problemChunks[chunkIndex] }; // Swap target chunk with the current
            }
            return chunk; // No changes for other chunks
        });

        const updatedDocument = {
            ...document,
            problemChunks: newProblemChunks,
        };

        updateDocument({ document: updatedDocument });
    }

    useEffect(() => {
        //if there are no chunks in the problem bank after loading the data, let's create one
        if (document && (!document.problemChunks || document.problemChunks.length === 0)) {
            insertChunk(0);
            toast('Created empty problem.');

        }
    }, [activeChunkIndices, document, insertChunk]);

    if (!document) {
        return <div className="text-white">No document found</div>;
    }

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



    return (
        <div className='flex'>

            <CreateDocxModal document={document} modalId="createDocx" />
            <ContentWrapper>
                <div className="w-full flex-grow mt-4 overflow-x-hidden pb-28">
                    <div className="space-y-4 bg-base-100 p-4 border border-base-300 rounded-lg shadow">
                        <h2 className="text-center text-xl  text-red-500 font-bold">NOTE: These features are experiemental and likely to break.</h2>
                        <h2 className="text-center text-lg font-bold">How to Create Your Worksheet</h2>
                        <ol className="list-inside space-y-2">
                            <li className="italic">First, add new problems using the "Add problem" button below. Alternatively, you can use <Link className="text-secondary underline" to='/math-app/search'>problem search</Link> and select problems you like to be added to a specific problem bank. </li>
                            <li className="italic">Then, click "Export" once you have all the problems you want. This will export your problems to a word document and to a PDF. Once exported, these documents will show up in
                                <Link className="text-primary font-bold underline px-2" to='/math-app/documents'>my documents</Link>.</li>
                        </ol>



                        <div className="text-center my-4">
                            Try <Link to="/math-app" className="text-primary font-bold underline px-2">searching</Link>for some new problems here.
                        </div>
                        <div className='border space-y-4 p-4 rounded'>
                            <button className='btn hover:bg-green-100 tooltip w-full flex items-center'
                                data-tip="Add new problem to this bank."
                                disabled={isLoadingSubmit}
                                onClick={() => insertChunk(0)}
                            >

                                <PlusIcon />
                            </button>
                            {document.problemChunks && document?.problemChunks?.length > 0 &&

                                document.problemChunks.map((chunk, chunkIndex) => (
                                    <div key={chunkIndex} className='mx-auto mb-4 bg-base-200 card p-4 rounded-lg shadow'>
                                        {chunkIndex > 0 &&
                                            <button className="btn tooltip flex items-center w-full" data-tip="Move this problem up." onClick={() => moveChunk(document, chunkIndex, "up")}><ChevronUp /></button>
                                        }
                                        <ChunkComponent
                                            chunk={chunk}
                                            updateChunk={updateDocumentChunk}
                                            chunkIndex={chunkIndex}
                                        />
                                        {document.problemChunks && chunkIndex < document.problemChunks.length - 1 &&
                                            <button className="btn tooltip flex items-center w-full" data-tip="Move this problem down." onClick={() => moveChunk(document, chunkIndex, "down")}><ChevronDown /></button>
                                        }
                                    </div>
                                )
                                )}

                            {document.problemChunks && document?.problemChunks?.length > 0 &&
                                <div className='mx-auto w-full'>
                                    <button className='btn hover:bg-green-100 tooltip w-full flex items-center'
                                        data-tip="Add new problem to this bank."
                                        disabled={isLoadingSubmit}
                                        onClick={() => insertChunk(document.problemChunks ? document.problemChunks.length : 0)}
                                    >

                                        <PlusIcon />
                                    </button>
                                </div>
                            }
                        </div>
                        {updateError && <div className="text-red-500">{updateError.message}</div>}
                    </div>
                </div>
            </ContentWrapper>
        </div>



    );
};

export default ProblemBank;