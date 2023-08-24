import React from 'react';
import TrashIcon from '../../svg/TrashIcon';
import PlusIcon from '../../svg/PlusIcon';
import ResponseFeedback from '../ResponseFeedback';
import EditIcon from '../../svg/Edit';
import ViewIcon from '../../svg/ViewIcon';
import { Chunk, ProblemData } from '../../interfaces';
import { MathProblemDragItem } from '../document/DocumentShelf';
import { useDrag } from 'react-dnd';
import ResponseBox from './ResponseBox';
import LatexIcon from '../../svg/LatexIcon';
import RefreshIcon from '../../svg/RefreshIcon';

interface MathProblemProps {
    index: number;
    problem: Chunk;
    problemData: ProblemData;
    insertChunk: (index: number, problem: Chunk) => void;
    deleteChunk: (index: number) => void;
}

const MathProblem: React.FC<MathProblemProps> = ({ index, problem, problemData, insertChunk, deleteChunk }) => {


    return (
        <div className='flex justify-center'>
            {/* first section */}
            <div className={` m-4 flex flex-col w-full bg-white dark:bg-gray-900 shadow-md rounded-md mb-2 pe-0  max-w-4xl`}>
                <div className="flex space-y-4 p-2">
                    <div className="flex flex-col w-full space-y-4">
                        <ResponseBox
                            key={index}
                            data={problemData}
                            problemIndex={index}
                            showChat={true}
                            chunk={problem}
                            className=" bg-gray-100 dark:bg-gray-700 dark:text-white rounded-md"
                        />

                    </div>
                    <div className="flex flex-grow flex-col w-1/6 space-y-4 justify-center items-center">
                        {/* <div className="flex flex-row justify-center items-center">
                            <div className="mr-2 group relative dark:text-green-300">
                                <button onClick={() => insertChunk(index, {} as Chunk)}><PlusIcon /></button>
                                <div className="hidden group-hover:block group-hover:left-12 absolute bg-gray-700 text-white py-1 px-2 rounded text-l">Insert Problem</div>
                            </div>
                            <div className="group relative dark:text-yellow-300">
                                <button onClick={() => console.log("not implemented")}><LatexIcon /> </button>
                                <div className="hidden group-hover:block group-hover:left-12 absolute bg-gray-700 text-white py-1 px-2 rounded text-l">Fix Latex Formatting</div>
                            </div>
                        </div>
                        <div className="flex flex-row justify-center items-center">
                            <div className="mr-2 group relative dark:text-gray-300">
                                <button onClick={() => console.log("not implemented")}><RefreshIcon /> </button>
                                <div className="hidden group-hover:block group-hover:left-12 absolute bg-gray-700 text-white py-1 px-2 rounded text-l">Reroll Result</div>
                            </div>
                            <div className="group relative dark:text-red-300">
                                <button onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this problem?')) {
                                        deleteChunk(index);
                                    }
                                }}><TrashIcon /></button>
                                <div className="hidden group-hover:block group-hover:left-12 absolute bg-gray-700 text-white py-1 px-2 rounded text-l">Delete Problem</div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MathProblem;
