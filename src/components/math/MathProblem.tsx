import React from 'react';
import { Chunk } from '../../interfaces';
import { ChunkComponent } from '../AST';

interface MathProblemProps {
    problem: Chunk;
    index: number;
}

const MathProblem: React.FC<MathProblemProps> = ({ problem, index }) => {
    return (
        <div className={`flex flex-row w-full bg-white dark:bg-gray-700 shadow-md rounded-md `}>
            {problem && <ChunkComponent chunk={problem} />}
        </div>
    )
}

export default MathProblem;
