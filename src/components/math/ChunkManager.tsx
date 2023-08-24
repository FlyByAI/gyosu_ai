import React, { useState } from 'react';
import { ProblemData, Chunk, } from '../../interfaces';
import MathProblem from './MathProblem';
import AIChatSmallWrapper from './AIChatSmallWrapper';

interface ChunkManagerProps {
    chunkArray: Chunk[];
    problemData?: ProblemData;
}

const ChunkManager: React.FC<ChunkManagerProps> = ({ chunkArray, problemData }) => {
    const [chunkArr, setChunkArr] = useState<Chunk[]>(chunkArray); //keep in mind this will not update parent state

    const insertChunk = (index: number, chunk: Chunk) => {
        console.log('test', index, chunk)
    }

    const deleteChunk = (index: number) => {
        console.log('test', index)
    }

    return (
        <div className='flex flex-col'>
            <div className="text-xl justify-center text-white flex items-center">Problem Browser</div>
            {chunkArr?.map((chunk, index) => {
                return (
                    <div className='w-3/4 mx-auto flex flex-row mb-4 bg-gray-900 p-2'>
                        <div className='w-5/6  rounded-xl'>

                            <AIChatSmallWrapper chunk={chunk} index={index} >
                                <MathProblem
                                    key={index}
                                    index={index}
                                    problem={chunk}
                                />
                            </AIChatSmallWrapper>
                        </div>
                        <div className='w-1/6 bg-gray-900 p-2'>
                            <div className='w-full h-full  text-white'>
                                test
                            </div>
                        </div>

                    </div>
                )
            })}
        </div>
    );
};

export default ChunkManager;
