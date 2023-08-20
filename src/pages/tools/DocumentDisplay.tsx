import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useGetDocument from '../../hooks/tools/math/useGetDocument';
import { ChunkComponent } from '../../components/AST';
import { notSecretConstants } from '../../constants/notSecretConstants';
import DocumentShelf from '../../components/document/DocumentShelf';

import { ProblemData } from '../../interfaces';
import MathProblem from '../../components/math/MathProblem';
import DocumentHeader from '../../components/document/DocumentHeader';

const DocumentDisplay: React.FC = () => {
    const { id } = useParams();
    const { isLoading, error, document } = useGetDocument(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/school_document`, Number(id));

    const [chat, setChat] = useState<string>('');

    if (isLoading) {
        return <div className="text-white">Loading...</div>;
    }

    if (error) {
        return <div className="text-white">Error: {error.message}</div>;
    }

    if (!document) {
        return <div className="text-white">No document found</div>;
    }

    const insertChunk = (index: number, problem: ChunkComponent) => {
        console.log("insert from display document")
    }

    const deleteChunk = (index: number) => {
        console.log("delete from display document")
    }

    return (
        <div className='flex bg-gray-900'>
            <DocumentShelf />
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
                                setChat={setChat}
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