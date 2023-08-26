import React from 'react';
import { Chunk } from '../../interfaces';
import { ChunkComponent } from '../AST';
import { useSidebarContext } from '../../contexts/useSidebarContext';

interface MathProblemProps {
    problem: Chunk;
    chunkIndex: number;
    insertChunk?: (chunkIndex: number) => void;
    deleteChunk?: (chunkIndex: number) => void;
    updateChunk: (updatedChunk: Chunk, chunkIndex: number) => void;
}

const MathProblem: React.FC<MathProblemProps> = ({ problem, chunkIndex, insertChunk, deleteChunk, updateChunk }) => {

    const { activeChunkIndices, setActiveChunkIndices } = useSidebarContext();

    const toggleChunkIndex = (chunkIndex: number): number[] => {
        if (activeChunkIndices.includes(chunkIndex)) {
            return activeChunkIndices.filter(index => index !== chunkIndex);
        } else {
            return [...activeChunkIndices, chunkIndex];
        }
    };

    return (
        <div onClick={() => setActiveChunkIndices(toggleChunkIndex(chunkIndex))} className={`flex flex-row w-full bg-white dark:bg-gray-700 shadow-md rounded-md `}>
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
