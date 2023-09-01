import React, { useState } from 'react';
import { ProblemData, Chunk, } from '../../interfaces';
import MathProblem from './MathProblem';
import AIChatSmallWrapper from './AIChatSmallWrapper';
import ChunkSidebarWrapper from './ChunkSidebarWrapper';

interface ChunkManagerProps {
    chunkArray: Chunk[];
    setChunkArray: (value: React.SetStateAction<Chunk[]>) => void
}

const ChunkManager: React.FC<ChunkManagerProps> = ({ chunkArray, setChunkArray }) => {

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
            <div className="text-xl justify-center text-white flex items-center">Problem Browser</div>
            <ChunkSidebarWrapper
                document={{ problemChunks: chunkArray }}
            >
                {chunkArray?.map((chunk, chunkIndex) => {
                    return (
                        <div key={chunkIndex}
                            className='w-3/4 mx-auto flex flex-row mb-4 bg-gray-900 p-2'>
                            <div className='w-full rounded-xl'>
                                <MathProblem
                                    key={chunkIndex}
                                    chunkIndex={chunkIndex}
                                    problem={chunk}
                                    updateChunk={updateChunk} />
                            </div>

                        </div>
                    )
                })}
            </ChunkSidebarWrapper>
        </div>
    );
};

export default ChunkManager;
