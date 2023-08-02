import React, { useEffect } from 'react';
import ResponseBox from './ResponseBox';
import ArrowLeft from '../../svg/ArrowLeftIcon';
import ArrowRight from '../../svg/ArrowRightIcon';
import RerollResult from './RerollResult';
import TrashIcon from '../../svg/TrashIcon';
import PlusIcon from '../../svg/PlusIcon';
import ResponseFeedback from '../ResponseFeedback';
import FixLatex from './FixLatex';
import EditIcon from '../../svg/Edit';
import ViewIcon from '../../svg/ViewIcon';

interface MathProblemProps {
    index: number;
    problem: string;
    handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    deleteProblem: (index: number) => void;
    insertProblem: (index: number) => void;
    setChat: (value: string) => void;
    updateProblem: (index: number, newProblem: string) => void
    problemType: string;
}

const MathProblem: React.FC<MathProblemProps> = ({ updateProblem, index, problem, handleChange, deleteProblem, insertProblem, setChat, problemType }) => {
    const [edit, setEdit] = React.useState<boolean>(true);

    const handleResize = () => {
        if (window.innerWidth < 768) {
            setEdit(false);
        } else {
            setEdit(true);
        }
    }

    useEffect(() => {
        handleResize(); // Set the initial value
        window.addEventListener('resize', handleResize); // Update the value whenever the window is resized

        // Return a function that will remove the listener when the component is unmounted
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className='flex'>
            {/* first section */}
            <div className={`flex flex-col p-4 bg-white dark:bg-gray-900 shadow-md rounded-md mb-2 pe-0 w-full md:w-3/5`}>
                <div className="flex space-y-4 w-full">
                    <div className="flex flex-col w-5/6 space-y-4">
                        <div className="relative" key={index}>
                            <ResponseBox
                                problemType={problemType}
                                problemIndex={index}
                                edit={edit}
                                showChat={true}
                                value={problem}
                                handleChange={handleChange}
                                className="p-2 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-md"
                                updateProblem={updateProblem}
                            />
                            <div className='block md:hidden absolute top-3 right-2 flex bg-black bg-opacity-50 text-white rounded p-1'>
                                <button className='block md:hidden text-white' onClick={() => setEdit(!edit)}>
                                    {!edit ? <EditIcon /> : <ViewIcon />}
                                </button>
                                {/* <button className="ms-1" onClick={() => console.log("left")}><ArrowLeft /></button>
                                1/1
                                <button className="me-1" onClick={() => console.log("right")}><ArrowRight /></button> */}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-grow flex-col w-1/6 p-4 space-y-4 justify-center items-center">

                        <ResponseFeedback responseText={problem} toolName={'math_app'} className='mt-4' size={6} />
                        <div className="flex flex-row justify-center items-center">
                            <div className="mr-2 group relative dark:text-green-300">
                                <button onClick={() => insertProblem(index)}><PlusIcon /></button>
                                <div className="hidden group-hover:block group-hover:left-12 absolute bg-gray-700 text-white py-1 px-2 rounded text-l">Insert Problem</div>
                            </div>
                            <div className="group relative dark:text-yellow-300">
                                <FixLatex setChat={setChat} problem={problem} problemIndex={index} updateProblem={updateProblem} problemType={problemType} />
                                <div className="hidden group-hover:block group-hover:left-12 absolute bg-gray-700 text-white py-1 px-2 rounded text-l">Fix Latex Formatting</div>
                            </div>
                        </div>
                        <div className="flex flex-row justify-center items-center">
                            <div className="mr-2 group relative dark:text-gray-300">
                                <RerollResult setChat={setChat} problem={problem} problemIndex={index} updateProblem={updateProblem} problemType={problemType} />
                                <div className="hidden group-hover:block group-hover:left-12 absolute bg-gray-700 text-white py-1 px-2 rounded text-l">Reroll Result</div>
                            </div>
                            <div className="group relative dark:text-red-300">
                                <button onClick={() => deleteProblem(index)}><TrashIcon /></button>
                                <div className="hidden group-hover:block group-hover:left-12 absolute bg-gray-700 text-white py-1 px-2 rounded text-l">Delete Problem</div>
                            </div>
                        </div>
                    </div>
                    {/* first section end */}
                </div>
            </div>
            {/* SECOND SECTION: This is the preview, and should have the same height as first section */}
            <div className="ms-4 hidden md:block flex flex-col px-6 py-4 bg-white dark:bg-gray-900 dark:text-white shadow-md rounded-md space-x-4 mb-2 md:w-2/5">
                <div className="relative" key={index}>
                    <ResponseBox
                        problemIndex={index}
                        problemType={problemType}
                        edit={false}
                        showChat={false}
                        value={problem}
                        handleChange={handleChange}
                        className="p-2 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-md"
                        updateProblem={updateProblem}
                    />

                </div>
            </div>
        </div>
    )
}

export default MathProblem;
