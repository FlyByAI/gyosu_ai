import React, { useEffect, useState } from 'react';
import { Chunk, EmptyDocument, } from '../../interfaces';
import MathProblem from './MathProblem';
import CreateDocxModal from '../CreateDocxModal';
import { useSidebarContext } from '../../contexts/useSidebarContext';

interface ChunkManagerProps {
    chunkArray: Chunk[];
    setChunkArray: (value: React.SetStateAction<Chunk[]>) => void
}

const ChunkManager: React.FC<ChunkManagerProps> = ({ chunkArray, setChunkArray }) => {

    const { activeChunkIndices, setActiveChunkIndices } = useSidebarContext();

    const updateChunk = (updatedChunk: Chunk, index: number) => {
        console.log("update chunk: ", chunkArray[index], "new chunk:", updatedChunk, index)

        setChunkArray(prevChunks => {
            const newChunks = [...prevChunks];
            newChunks[index] = updatedChunk;
            return newChunks;
        });
    };

    return (
        <div className='flex flex-col'>
            <div className="text-xl justify-center text-white flex items-center mb-4">Problem Search Results</div>
            {chunkArray?.map((chunk, chunkIndex) => {
                return (
                    <div key={chunkIndex}
                        className='w-full mx-auto flex flex-row mb-4 bg-gray-900 p-2'>
                        <div className='w-full rounded-xl'>
                            <MathProblem
                                key={chunkIndex}
                                selectable={false}
                                disableInstructionProblemDrag={true}
                                chunkIndex={chunkIndex}
                                problem={chunk}
                                updateChunk={updateChunk}
                                enableTools={false}
                            />
                        </div>

                    </div>
                )
            })}
        </div>
    );
};

export default ChunkManager;
