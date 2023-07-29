import React, { useState, useEffect } from 'react';
import MathProblem from './MathProblem';
import MyPlotly from './MyPlotly';
import ResponseBox from './ResponseBox';
import ResponseFeedback from '../ResponseFeedback';
import RefreshResult from './RefreshResult';
import TrashIcon from '../../svg/TrashIcon';
import LatexIcon from '../../svg/LatexIcon';
import PlusIcon from '../../svg/PlusIcon';
import ArrowLeft from '../../svg/ArrowLeftIcon';
import ArrowRight from '../../svg/ArrowRightIcon';

interface ProblemManagerProps {
    initialMarkdown: string;
    onMarkdownChange: (newMarkdown: string) => void;
    setChat: (value: string) => void;
}

interface GraphData {
    index: number; // which problem it goes with
    title: string;
    data: any;
}

const ProblemManager: React.FC<ProblemManagerProps> = ({ initialMarkdown, onMarkdownChange, setChat, }) => {


    const [graphData, setGraphData] = useState<GraphData[]>([]);
    const [problems, setProblems] = useState<string[]>(markdownToProblemsArr(initialMarkdown));

    useEffect(() => {
        const updateMarkdown = (problems: string[]) => {
            onMarkdownChange(problems.join("\n\n"));
        }
        updateMarkdown(problems)
    }, [problems, onMarkdownChange]);

    function markdownToProblemsArr(markdown: string) {
        const spacedMarkdown = markdown.replace(/(\*\*Problem \d+\*\*)/g, "<br>$1");
        const array = spacedMarkdown.split("<br>");
        return array.slice(1);
    }

    const updateProblems = (newProblems: string[]) => {
        setProblems(newProblems);
    }

    const updateProblem = (index: number, newProblem: string) => {
        const newProblems = [...problems];
        newProblems[index] = newProblem.trim();
        updateProblems(newProblems);
    }

    const insertProblem = (indexToInsertAfter: number) => {
        const newProblem = "**Problem New**\nInstructions: \n";
        const newProblems = [...problems];
        newProblems.splice(indexToInsertAfter + 1, 0, newProblem);
        updateProblems(newProblems);
    }

    const deleteProblem = (index: number) => {
        const newProblems = problems.filter((_, i) => i !== index);
        updateProblems(newProblems);
    }

    const handleChange = (index: number, event: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateProblem(index, event.target.value);
    }

    const handleFixLatexFormatting = () => {
        console.log("fix formatting");
    }

    const handleAddNewGraph = (index: number, data: { graphTitle: string, graphData: any }) => {
        setGraphData([...graphData, { index: index, title: data.graphTitle, data: data.graphData }]);
    }
    return (
        <>
            <div>
                {problems.map((problem, index) => (
                    <>
                        <div className='flex space-x-4'>
                            {/* first section */}
                            <div className={`flex flex-col px-6 py-4 bg-white dark:bg-gray-900 shadow-md rounded-md space-x-4 mb-2 w-3/5`}>
                                <div className="flex space-y-4 w-full">
                                    <div className="flex flex-col w-5/6 space-y-4">
                                        <div className="relative" key={index}>
                                            <ResponseBox
                                                problemIndex={index}
                                                edit={true}
                                                value={problem}
                                                handleChange={(event) => handleChange(index, event)}
                                                className="p-2 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-md"
                                            />
                                            <div className='absolute top-3 right-2 flex bg-black bg-opacity-50 text-white rounded p-1'>
                                                <button className="ms-1" onClick={() => console.log("left")}><ArrowLeft /></button>
                                                1/1
                                                <button className="me-1" onClick={() => console.log("right")}><ArrowRight /></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-1/6 p-4 space-y-4">
                                        <ResponseFeedback responseText={problem} toolName={'math_app'} className='mt-4' size={6} />
                                        <div className="flex flex-row">
                                            <div className="mr-2 group relative dark:text-green-300">
                                                <button onClick={() => insertProblem(index)}><PlusIcon /></button>
                                                <div className="hidden group-hover:block group-hover:left-12 absolute bg-gray-700 text-white py-1 px-2 rounded text-l">Insert Problem</div>
                                            </div>
                                            <div className="group relative dark:text-yellow-300">
                                                <button onClick={handleFixLatexFormatting}><LatexIcon /></button>
                                                <div className="hidden group-hover:block group-hover:left-12 absolute bg-gray-700 text-white py-1 px-2 rounded text-l">Fix Latex Formatting</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-row">
                                            <div className="mr-2 group relative dark:text-gray-300">
                                                <RefreshResult setChat={setChat} problem={problem} problemIndex={index} updateProblem={updateProblem} />
                                                <div className="hidden group-hover:block group-hover:left-12 absolute bg-gray-700 text-white py-1 px-2 rounded text-l">Reroll Result</div>
                                            </div>
                                            <div className="group relative dark:text-red-300">
                                                <button onClick={() => deleteProblem(index)}><TrashIcon /></button>
                                                <div className="hidden group-hover:block group-hover:left-12 absolute bg-gray-700 text-white py-1 px-2 rounded text-l">Delete Problem</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col px-6 py-4 bg-white dark:bg-gray-900 dark:text-white shadow-md rounded-md space-x-4 mb-2 w-2/5">
                                <div className="relative" key={index}>
                                    <ResponseBox
                                        problemIndex={index}
                                        edit={false}
                                        value={problem}
                                        handleChange={(event) => handleChange(index, event)}
                                        className="p-2 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-md"
                                    />
                                    <MyPlotly problem={problem} problemIndex={index} updateProblem={updateProblem}
                                        graphData={graphData.filter((graph) => {
                                            return (graph.index === index) // multiple graphs can have this index so that we can have multiple graphs per problem
                                        })}
                                        handleAddNewGraph={handleAddNewGraph} />
                                </div>
                            </div>
                        </div>
                    </>
                ))}
            </div>

            <div id="markdownToPrint">
                {problems.map((problem, index) => {
                    return (
                        <div className="relative" key={index}>
                            <ResponseBox
                                problemIndex={index}
                                edit={false}
                                value={problem}
                                handleChange={(event) => handleChange(index, event)}
                                className="p-2 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-md"
                            />
                            <MyPlotly problem={problem} problemIndex={index} updateProblem={updateProblem}
                                graphData={graphData.filter((graph) => {
                                    return (graph.index === index) // multiple graphs can have this index so that we can have multiple graphs per problem
                                })}
                                handleAddNewGraph={handleAddNewGraph}
                                preview={true} />
                        </div>)
                })}
            </div>
        </>
    );
};

export default ProblemManager;
