import React from 'react';
import { Chunk } from '../../interfaces';
import { ChunkComponent } from '../AST';

interface MathProblemProps {
    problem: Chunk;
    chunkIndex: number;
    insertChunk?: (chunkIndex: number) => void;
    updateChunk: (updatedChunk: Chunk, chunkIndex: number) => void;
    enableTools?: boolean;
    disableInstructionProblemDrag?: boolean;
    problemBankId?: string;
}

const MathProblem: React.FC<MathProblemProps> = ({ problem, chunkIndex, insertChunk, updateChunk, problemBankId }) => {

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
                />}
        </div>
    )
}

export default MathProblem;
