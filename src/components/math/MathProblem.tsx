import React from 'react';
import { Chunk } from '../../interfaces';
import { ChunkComponent } from '../AST';

interface MathProblemProps {
    problem: Chunk;
    chunkIndex: number;
    insertChunk?: (chunkIndex: number) => void;
    deleteChunk?: (chunkIndex: number) => void;
    updateChunk: (updatedChunk: Chunk, chunkIndex: number) => void;
}

const MathProblem: React.FC<MathProblemProps> = ({ problem, chunkIndex, insertChunk, deleteChunk, updateChunk }) => {
    return (
        <div className={`flex flex-row w-full bg-white dark:bg-gray-700 shadow-md rounded-md `}>
            {problem &&
                <ChunkComponent
                    chunk={problem}
                    insertChunk={insertChunk || undefined}
                    deleteChunk={deleteChunk || undefined}
                    updateChunk={updateChunk}
                    chunkIndex={chunkIndex}
                />}
        </div>
    )
}

export default MathProblem;
