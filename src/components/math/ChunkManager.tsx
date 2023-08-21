import React, { useState } from 'react';
import { ProblemData, Chunk, } from '../../interfaces';
import MathProblem from './MathProblem';

interface ChunkManagerProps {
    chunkArray: Chunk[];
    problemData?: ProblemData;
}

const ChunkManager: React.FC<ChunkManagerProps> = ({ chunkArray, problemData }) => {
    const [chunkArr, setChunkArr] = useState<Chunk[]>(chunkArray); //keep in mind this will not update parent state

    console.log(chunkArray)
    const insertChunk = (index: number, chunk: Chunk) => {
        console.log('test', index, chunk)
    }

    const deleteChunk = (index: number) => {
        console.log('test', index)
    }

    return (
        <div>
            <div className="text-xl text-center text-white">Problem Browser</div>
            {chunkArr?.map((chunk, index) => {
                return (
                    <MathProblem
                        key={index}
                        index={index}
                        problem={chunk}
                        insertChunk={insertChunk}
                        deleteChunk={deleteChunk}
                        problemData={problemData as ProblemData} //fix?
                    />)
            })}
        </div>
    );
};

export default ChunkManager;
