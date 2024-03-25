import React from 'react';
import { useSidebarContext } from '../../contexts/useSidebarContext';
import { Chunk } from '../../interfaces';
import { ChunkComponent } from '../AST';

interface MathProblemProps {
    problem: Chunk;
    chunkIndex: number;
    insertChunk?: (chunkIndex: number) => void;
    updateChunk: (updatedChunk: Chunk, chunkIndex: number) => void;
    enableTools?: boolean;
    selectable?: boolean;
    disableInstructionProblemDrag?: boolean;
    problemBankId?: number;
}

const MathProblem: React.FC<MathProblemProps> = ({ problem, chunkIndex, insertChunk, updateChunk, enableTools, selectable, problemBankId }) => {

    const { activeChunkIndices, setActiveChunkIndices } = useSidebarContext();



    const toggleChunkIndex = (chunkIndex: number): number[] => {
        if (activeChunkIndices.includes(chunkIndex)) {
            return activeChunkIndices.filter(index => index !== chunkIndex);
        } else {
            return [...activeChunkIndices, chunkIndex];
        }
    };

    return (
        <div className={`flex flex-row w-full `}>
            {problem &&
                <ChunkComponent
                    problemBankId={problemBankId}
                    selectable={false}
                    chunk={problem}
                    insertChunk={insertChunk || undefined}
                    updateChunk={updateChunk}
                    chunkIndex={chunkIndex}
                    enableTools={enableTools}
                />}
        </div>
    )
}

export default MathProblem;
