import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useEnvironment from '../../hooks/useEnvironment';
import { Chunk, Problem } from '../../interfaces';
import { ChunkComponent } from './ChunkComponent';


const DocumentManager: React.FC = () => {
    const { id } = useParams();
    const { apiUrl } = useEnvironment();
    const endpoint = `${apiUrl}/math_app/school_document/`;

    const defaultProblem: Problem = {
        type: 'problem',
        content: [{
            type: 'math',
            value: 'x^2 + y^2 = 1',
        }],
    }

    const [chunk, setChunk] = useState<Chunk>({ type: 'chunk', content: [defaultProblem] } as Chunk);

    return (
        <div className="max-w-4xl mx-auto my-4 text-2xl text-center">
            <div className='mx-auto mb-4 bg-base-200 card p-4 rounded-lg shadow'>
                <ChunkComponent
                    landingPageDemo={true}
                    chunk={chunk}
                    updateChunk={setChunk}
                    chunkIndex={0}
                />
            </div>
        </div>
    );
};

export default DocumentManager;
