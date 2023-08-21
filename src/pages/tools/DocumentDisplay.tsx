import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useGetDocument from '../../hooks/tools/math/useGetDocument';
import { ChunkComponent } from '../../components/AST';
import { notSecretConstants } from '../../constants/notSecretConstants';
import DocumentShelf from '../../components/document/DocumentShelf';

import { Chunk, ProblemData } from '../../interfaces';
import MathProblem from '../../components/math/MathProblem';
import DocumentHeader from '../../components/document/DocumentHeader';

const DocumentDisplay: React.FC = () => {
    const { id } = useParams();
    const { isLoading, error, document } = useGetDocument(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/school_document`, Number(id));


    if (isLoading) {
        return <div className="text-white">Loading...</div>;
    }

    if (error) {
        return <div className="text-white">Error: {error.message}</div>;
    }

    if (!document) {
        return <div className="text-white">No document found</div>;
    }

    const insertChunk = (index: number, chunk: Chunk) => {
        console.log("insert from display document", index, "problem", chunk)
    }

    const deleteChunk = (index: number) => {
        console.log("delete from display document for index: ", index)
    }

    return (
        <div className='flex bg-gray-900'>
            <DocumentShelf isExporting={false} />
            <div className="w-5/6">
                <DocumentHeader document={document} />

                {document.problemChunks
                    && document.problemChunks.length > 0
                    && document.problemChunks?.map((chunk, index) => {
                        return (
                            <MathProblem
                                insertChunk={insertChunk}
                                deleteChunk={deleteChunk}
                                key={index}
                                index={index}
                                problem={chunk}
                                problemData={{} as ProblemData} //fix?
                            />)
                    })
                }

                {/* {document && document?.problemChunks?.map((chunk, index) => (
                    <ChunkComponent key={index} chunk={chunk} />
                ))} */}
            </div>
        </div>
    );
};

export default DocumentDisplay;