import React, { useEffect } from 'react';
import { Chunk } from '../../interfaces';
import { ChunkComponent } from '../AST';
import { useSidebarContext } from '../../contexts/useSidebarContext';
import { Tooltip as ReactTooltip } from "react-tooltip";

interface MathProblemProps {
    problem: Chunk;
    chunkIndex: number;
    insertChunk?: (chunkIndex: number) => void;
    updateChunk: (updatedChunk: Chunk, chunkIndex: number) => void;
    enableTools?: boolean;
    selectable?: boolean;
    disableInstructionProblemDrag?: boolean;
}

const MathProblem: React.FC<MathProblemProps> = ({ problem, chunkIndex, insertChunk, updateChunk, enableTools, selectable }) => {

    const { activeChunkIndices, setActiveChunkIndices } = useSidebarContext();

    useEffect(() => {
        if (!selectable) {
            setActiveChunkIndices([]);
        }
    }, [selectable, setActiveChunkIndices])

    const toggleChunkIndex = (chunkIndex: number): number[] => {
        if (activeChunkIndices.includes(chunkIndex)) {
            return activeChunkIndices.filter(index => index !== chunkIndex);
        } else {
            return [...activeChunkIndices, chunkIndex];
        }
    };

    return (
        <div onClick={() => selectable && setActiveChunkIndices(toggleChunkIndex(chunkIndex))} className={`flex flex-row w-full bg-white dark:bg-gray-700 shadow-md rounded-md `}>
            {problem &&
                <ChunkComponent
                    selectable={selectable}
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
