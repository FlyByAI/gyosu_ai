import React from 'react';
import { Chunk } from '../../interfaces';
import MathProblem from './MathProblem';

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
            <div className="text-xl justify-center flex items-center mb-4 italic">Step 3: Add problems to a problem bank, then open the problem bank.</div>
            {chunkArray?.map((chunk, chunkIndex) => {
                return (
                    <div key={chunkIndex}
                        className='w-full mx-auto flex flex-row mb-4 bg-base-200 p-2'>
                        <div className='w-full rounded-xl'>
                            <MathProblem
                                key={chunkIndex}
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
