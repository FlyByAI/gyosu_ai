import React from 'react';
import { Chunk } from '../../interfaces';
import { ChunkComponent } from '../ast/ChunkComponent';

interface ChunkManagerProps {
    chunkArray: Chunk[];
}

const MathProblems: React.FC<ChunkManagerProps> = ({chunkArray}) => {
    return (
        <div className='flex flex-col'>
            {chunkArray.map((chunk, chunkIndex) => {
                return (
                    <div key={chunkIndex}
                        className='w-full mx-auto flex flex-row mb-4 bg-base-200 p-2'>
                        <div className='w-full rounded-xl'>
                            <div className={`flex flex-row w-full `}>
                                {chunk &&
                                    <ChunkComponent
                                        chunk={chunk}
                                        chunkIndex={chunkIndex}
                                    />}
                            </div>
                        </div>

                    </div>
                )
            })}
        </div>
    );
};

export default MathProblems;
