import React, { useState } from 'react';
import { ProblemData, Chunk, } from '../../interfaces';
import MathProblem from './MathProblem';

interface ChunkManagerProps {
    setChat: (value: string) => void;
    chunkArray: Chunk[];
    problemData?: ProblemData;
}

const ChunkManager: React.FC<ChunkManagerProps> = ({ setChat, chunkArray, problemData }) => {
    const [chunkArr, setChunkArr] = useState<Chunk[]>(chunkArray); //keep in mind this will not update parent state

    console.log(chunkArray)
    const insertChunk = (index: number, chunk: Chunk) => {
        console.log('test')
    }

    const deleteChunk = (index: number) => {
        console.log('test')
    }

    return (
        <div>
            {chunkArr?.map((chunk, index) => {
                return (
                    <MathProblem
                        key={index}
                        index={index}
                        setChat={setChat}
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
