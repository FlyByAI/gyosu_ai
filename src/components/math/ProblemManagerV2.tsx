import React, { useState, useEffect } from 'react';
import MathProblemV2 from './MathProblemV2';
import { ProblemData, Chunk, DocumentAST } from '../../interfaces';

interface ProblemManagerProps {
    setChat: (value: string) => void;
    chunkArray: Chunk[];
    problemData: ProblemData;
}

const ProblemManager: React.FC<ProblemManagerProps> = ({ setChat, chunkArray, problemData }) => {

    const updateProblems = (newProblems: Chunk[]) => {
        console.log("handle change not implemented yet")
        // setProblems(newProblems);
    }

    const updateProblem = (index: number, newProblem: Chunk) => {
        console.log("handle change not implemented yet")
        // const newProblems = [...problems];
        // newProblems[index] = newProblem;
        // updateProblems(newProblems);
    }

    const insertProblem = (indexToInsertAfter: number) => {
        console.log("handle change not implemented yet")
        // const newProblem = {} as Chunk;
        // const newProblems = [...problems];
        // newProblems.splice(indexToInsertAfter + 1, 0, newProblem);
        // updateProblems(newProblems);
    }

    const deleteProblem = (index: number) => {
        console.log("handle change not implemented yet")
        // const newProblems = problems.filter((_, i) => i !== index);
        // updateProblems(newProblems);
    }

    const handleChange = (index: number, problem: Chunk) => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        console.log("handle change not implemented yet")
        // updateProblem(index, { ...problem, text: event.target.value });
    }

    console.log(chunkArray)
    return (
        <div>
            {chunkArray?.map((chunk, index) => {
                console.log(chunk)
                return (
                    <MathProblemV2
                        key={index}
                        index={index}
                        handleChange={handleChange(index, chunk)}
                        deleteProblem={deleteProblem}
                        insertProblem={insertProblem}
                        setChat={setChat}
                        updateProblem={updateProblem}
                        problem={chunk}
                        problemData={problemData}
                    />)
            })}
        </div>
    );
};

export default ProblemManager;
