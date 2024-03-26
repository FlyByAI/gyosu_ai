import 'katex/dist/katex.min.css';
import React, { useEffect, useState } from 'react';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { useDragContext } from '../contexts/DragContext';
import { useScreenSize } from '../contexts/ScreenSizeContext';
import { useSidebarContext } from '../contexts/useSidebarContext';
import useGetDocument from '../hooks/tools/math/useGetDocument';
import useSubmitDocument from '../hooks/tools/math/useSubmitDocument';
import useSubmitReroll from '../hooks/tools/math/useSubmitReroll';
import useSubmitTextWithChunk from '../hooks/tools/math/useSubmitTextWithChunk';
import useEnvironment from '../hooks/useEnvironment';
import { CHUNK_DRAG_TYPE, Chunk, INSTRUCTION_DRAG_TYPE, INSTRUCTION_TYPE, Instruction, PROBLEM_DRAG_TYPE, PROBLEM_TYPE, Problem, Subproblem, Subproblems } from '../interfaces';
import AddChunkModal from './AddChunkModal';


interface ChunkProps {
    chunk: Chunk;
    edit?: boolean;
    insertChunk?: (chunkIndex: number) => void;
    updateChunk: (updatedChunk: Chunk, chunkIndex: number) => void;
    chunkIndex: number;
    enableTools?: boolean;
    disableInstructionProblemDrag?: boolean;
    selectable?: boolean; //used to disable drag and drop for instructions and problems when on the search
    problemBankId?: string;
}

export const ChunkComponent: React.FC<ChunkProps> = ({ chunk, insertChunk, updateChunk, chunkIndex, enableTools, selectable, disableInstructionProblemDrag, problemBankId }) => {
    const { setDragState } = useDragContext();

    const [currentRerollIndex, setCurrentRerollIndex] = useState(0);

    const { activeChunkIndices, setActiveChunkIndices } = useSidebarContext();
    const { apiUrl } = useEnvironment();

    const endpoint2 = `${apiUrl}/math_app/school_document/`;
    const { isLoading, updateDocument } = useSubmitDocument(endpoint2);

    const [isHovered, setIsHovered] = useState(false);

    const [userInput, setUserInput] = useState("")

    const [, ref] = useDrag({
        type: CHUNK_DRAG_TYPE,
        item: () => {
            setDragState({ isDragging: true, dragType: CHUNK_DRAG_TYPE });
            return { ...chunk, content: chunk.content } as Chunk;
        },
        end: () => {
            setDragState({ isDragging: false, dragType: null });
        },
    });

    //do this in instruction and problem too so they can be dragged on
    const [, drop] = useDrop({
        accept: [INSTRUCTION_DRAG_TYPE, PROBLEM_DRAG_TYPE],
        hover: () => {
            setIsHovered(true);
        },
        drop: (item: Instruction | Problem, monitor: DropTargetMonitor) => {

            const didDrop = monitor.didDrop();
            if (didDrop) {
                return;
            }
            else {
                console.log("dropped on chunk")
            }

            if (item.type === INSTRUCTION_TYPE || item.type === PROBLEM_TYPE) {
                const updatedContent = [...chunk.content, item];
                // Update the content state if you still want to use it elsewhere
                // setContent(updatedContent);

                // Create a new chunk object with the updated content
                const updatedChunk = { ...chunk, content: updatedContent };

                // Use the method from props to update the chunk
                updateChunk(updatedChunk, chunkIndex);
            }
        },
    });

    const { id } = useParams();

    const { document } = useGetDocument(`${apiUrl}/math_app/school_document/`, Number(id));

    const deleteChunk = (index: number) => {
        // Validation for document object
        if (!document || !('id' in document)) {
            return;
        }

        const updatedChunks = [...(document.problemChunks || [])];

        updatedChunks.splice(index, 1);

        const updatedDocument = { ...document, problemChunks: updatedChunks };

        // unset this index in selected
        setActiveChunkIndices(activeChunkIndices.filter(activeIndex => activeIndex !== index));

        // Submit the change, triggering the updateDocument mutation
        updateDocument({ document: updatedDocument });

    };

    const [isOverflowOpen, setIsOverflowOpen] = useState(false);

    const { isDesktop } = useScreenSize();

    const { submitReroll, data: rerollData, reset: resetReroll } = useSubmitReroll(`${apiUrl}/math_app/reroll/`)

    const handleReroll = () => {
        if (!rerollData) {
            submitReroll({ chunk: chunk, action: "reroll", chunkIndex: chunkIndex, problemBankId: problemBankId })
        }
        else {
            // loop 
            setCurrentRerollIndex((prev) => {
                if (prev === rerollData.chunks.length - 1) {
                    return 0
                }
                else {
                    return prev + 1
                }
            })
        }
    }

    const { submitTextWithChunk, data: submitTextData, reset: resetTextChange } = useSubmitTextWithChunk(`${apiUrl}/math_app/chat/problem/`)

    const handleSubmitText = () => {
        submitTextWithChunk({ chunk: chunk, userInput: userInput, chunkIndex: chunkIndex, problemBankId: problemBankId })
    }


    const handleAcceptChunkChange = () => {
        if (rerollData) {
            const updatedChunk = rerollData.chunks[currentRerollIndex]
            updateChunk(updatedChunk, chunkIndex)
            resetReroll()
        }
        if (submitTextData) {
            const updatedChunk = submitTextData.chunk
            updateChunk(updatedChunk, chunkIndex)
            resetTextChange()
        }

    }

    useEffect(() => {
        if (submitTextData) {
            console.log("new text changed chunks", submitTextData)
        }
        if (rerollData) {
            console.log("new rerolled chunks", rerollData)
        }
    }, [submitTextData, rerollData])

    return (
        <>
            <div
                ref={(node) => ref(drop(node))}
                onMouseEnter={() => !isHovered && setIsHovered(true)}
                onMouseLeave={() => isHovered && setIsHovered(false)}
                className={`border relative p-2 w-full transition-all duration-300 ease-in-out ${isHovered ? "border-base-content border-dashed" : "border-transparent"
                    } ${activeChunkIndices.includes(chunkIndex) ? "bg-base-content text-base-100" : ""}`}
                title={!id ? "Click and drag to a problem bank." : "Click to select this problem."}
            >
                <div className="absolute top-0 right-0 flex flex-row gap-2">
                    {!id && <AddChunkModal chunk={chunk} modalId={'addChunkModal' + chunk.chunkId} enabled={false} />}

                    {id && <button
                        className="btn btn-secondary tooltip tooltip-bottom"
                        data-tip="Add problem to problem bank."
                        onClick={handleReroll}
                    >
                        Reroll
                    </button>}

                    {id && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteChunk(chunkIndex);
                            }}
                            className="btn btn-error tooltip tooltip-bottom"
                            data-tip="Delete this problem from bank."
                        >
                            Delete
                        </button>
                    )}

                </div>

                <div className="w-full flex items-center"
                    onClick={() => {
                        setActiveChunkIndices((prev) => {
                            if (prev.includes(chunkIndex)) {
                                return prev.filter((index) => index !== chunkIndex);
                            } else {
                                return [...prev, chunkIndex];
                            }
                        })
                    }}>
                    {selectable && <input
                        type="checkbox"
                        checked={activeChunkIndices.includes(chunkIndex)}
                        className="checkbox checkbox-primary"
                        id={`checkbox-${chunkIndex}`} // Ensure unique ID for labeling
                    />}
                    {selectable && activeChunkIndices.includes(chunkIndex) && (
                        <label htmlFor={`checkbox-${chunkIndex}`} className="text-green-500 ml-2 flex items-center">
                            Selected
                        </label>
                    )}
                    {!selectable && <h3 className="h-12">{ }</h3>}
                </div>

                {chunk?.content?.map((item, index) => {
                    const element = (() => {
                        switch (item.type) {
                            case 'instruction':
                                return <InstructionComponent chunkIndex={chunkIndex} instructionIndex={index} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} instruction={item} onInstructionHover={setIsHovered} disableInstructionProblemDrag={disableInstructionProblemDrag} />;
                            case 'problem':
                                return <ProblemComponent chunkIndex={chunkIndex} problemIndex={index} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} problem={item} onInstructionHover={setIsHovered} disableInstructionProblemDrag={disableInstructionProblemDrag} />;
                            default:
                                return null;
                        }
                    })();

                    return (
                        <div key={`${item.type}-${index}-${chunk.content.length}`}>
                            {element}
                        </div>
                    );
                })}

                {chunkIndex == rerollData?.chunkIndex &&
                    <div>
                        Rerolled Chunk:
                        {rerollData?.chunks[currentRerollIndex].content.map((rerolledItem, rerollIndex) => {
                            const rerollElement = (() => {
                                switch (rerolledItem.type) {
                                    case 'instruction':
                                        return <InstructionComponent debug={true} chunkIndex={chunkIndex} instructionIndex={rerollIndex} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} instruction={rerolledItem} onInstructionHover={setIsHovered} disableInstructionProblemDrag={disableInstructionProblemDrag} />;
                                    case 'problem':
                                        return <ProblemComponent chunkIndex={chunkIndex} problemIndex={rerollIndex} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} problem={rerolledItem} onInstructionHover={setIsHovered} disableInstructionProblemDrag={disableInstructionProblemDrag} />;
                                    default:
                                        return <div>None</div>;
                                }
                            })();

                            return (
                                <div key={`${rerolledItem.type}-${rerollIndex}-${chunk.content.length}`}>
                                    {chunkIndex == rerollData?.chunkIndex && rerollElement}
                                </div>
                            );
                        })}
                    </div>

                }

                {chunkIndex == submitTextData?.chunkIndex &&
                    <div>
                        Text changed:
                        {
                            submitTextData?.chunk.content.map((changedItem, changedIndex) => {
                                const rerollElement = (() => {
                                    switch (changedItem.type) {
                                        case 'instruction':
                                            return <InstructionComponent debug={true} chunkIndex={chunkIndex} instructionIndex={changedIndex} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} instruction={changedItem} onInstructionHover={setIsHovered} disableInstructionProblemDrag={disableInstructionProblemDrag} />;
                                        case 'problem':
                                            return <ProblemComponent chunkIndex={chunkIndex} problemIndex={changedIndex} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} problem={changedItem} onInstructionHover={setIsHovered} disableInstructionProblemDrag={disableInstructionProblemDrag} />;
                                        default:
                                            return <div>None</div>;
                                    }
                                })();

                                return (
                                    <div key={`${changedItem.type}-${changedIndex}-${chunk.content.length}`}>
                                        {chunkIndex == submitTextData?.chunkIndex && rerollElement}
                                    </div>
                                );
                            })}
                    </div>}

                {id && (submitTextData || rerollData) && <>
                    <button
                        className="btn btn-secondary tooltip tooltip-bottom"
                        data-tip="Accept this change."
                        onClick={handleAcceptChunkChange}
                    >
                        Accept
                    </button>
                </>}

                {id && !submitTextData && !rerollData && <>
                    <input
                        type="text"
                        placeholder="Please make this problem easier."
                        value={userInput} // Assuming userInput is your state variable
                        onChange={(e) => setUserInput(e.target.value)} // And setUserInput is the setter
                        className="input input-bordered w-full max-w-lg m-2"
                    />
                    <button
                        className="btn btn-secondary tooltip tooltip-bottom"
                        data-tip="Send your input."
                        onClick={handleSubmitText}
                    >
                        Send
                    </button>
                </>}

            </div>
        </>
    );

};


interface InstructionProps {
    parentChunk: Chunk;
    parentChunkIndex: number;
    updateChunk: (updatedChunk: Chunk, chunkIndex: number) => void;

    instruction: Instruction;
    instructionIndex: number;
    edit?: boolean;
    onInstructionHover: (hovered: boolean) => void; // Function to change the parent's hover state
    disableInstructionProblemDrag?: boolean; //used to disable drag and drop for instructions and problems when on the search

    chunkIndex: number;
    debug?: boolean;
}

const InstructionComponent: React.FC<InstructionProps> = ({ debug, chunkIndex, parentChunk, parentChunkIndex, updateChunk, instruction, instructionIndex, disableInstructionProblemDrag }) => {
    const { setDragState } = useDragContext();

    const [, ref] = useDrag({
        type: INSTRUCTION_DRAG_TYPE,
        item: () => {
            setDragState({ isDragging: true, dragType: INSTRUCTION_DRAG_TYPE });
            return { ...instruction, content: instruction.content } as Instruction;
        },
        end: () => {
            setDragState({ isDragging: false, dragType: null });
        },
    });

    const [, drop] = useDrop({
        accept: [INSTRUCTION_DRAG_TYPE, PROBLEM_DRAG_TYPE],
        hover: () => {
            console.log('hover problem')
        },
        drop: (item: Instruction | Problem) => {
            const updatedContent = [...parentChunk.content];

            const targetIndex = instructionIndex !== undefined ? instructionIndex : updatedContent.length;
            updatedContent.splice(targetIndex, 0, item);

            const markedContent = updatedContent.map((contentItem, index) => ({
                ...contentItem,
                isDuplicate:
                    ('instructionId' in contentItem && 'instructionId' in item)
                        ? contentItem.instructionId === item.instructionId && index !== targetIndex
                        : ('problemId' in contentItem && 'problemId' in item)
                            ? contentItem.problemId === item.problemId && index !== targetIndex
                            : false
            }));

            const filteredContent = markedContent.filter(contentItem => !contentItem.isDuplicate);

            const updatedChunk = { ...parentChunk, content: filteredContent };
            updateChunk(updatedChunk, parentChunkIndex);
        }

    });

    if (debug) { console.log(instruction.content) }

    return (
        <div
            ref={(node) => disableInstructionProblemDrag ? ref(drop(node)) : node}
            className="flex group flex-row flex-wrap cursor-pointer"
        >
            {instruction.content.map((item, index) => (
                <span key={index} style={{ display: 'inline' }}>
                    {(() => {
                        switch (item.type) {
                            case 'text':
                                return (
                                    <div
                                        className="text-sm z-10 bg-transparent p-1 m-1 rounded-lg transition duration-300 ease-in-out group- group"
                                    >
                                        {item.value}
                                    </div>
                                );
                            case 'math':
                                return (
                                    <ReactMarkdown
                                        className="text-sm z-10 bg-transparent p-1 m-1 rounded-lg transition duration-300 ease-in-out group- group-"
                                        remarkPlugins={[remarkGfm, remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                    >
                                        {`${item.value}`}
                                    </ReactMarkdown>
                                );
                            case 'table':
                                return (
                                    <ReactMarkdown
                                        className="text-sm z-10 bg-transparent p-1 m-1 rounded-lg transition duration-300 ease-in-out group- group-"
                                        remarkPlugins={[remarkGfm, remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                    >
                                        {String.raw`${item.value}`}
                                    </ReactMarkdown>
                                );
                            case 'image':
                                //todo: get better descriptions added to the ASTs
                                // console.log("image", item)
                                return (
                                    <img
                                        src={item.value}
                                        alt="Description"
                                        className="z-10 p-1 m-1 border-2 border-transparent border-dashed  rounded-lg transition duration-300 ease-in-out group-"
                                    />
                                );
                            case 'subproblems':
                                return <SubproblemsComponent subproblems={item} />;
                            default:
                                return null;
                        }
                    })()}
                </span>
            ))}
        </div>
    );


};


interface ProblemProps {
    parentChunk: Chunk;
    parentChunkIndex: number;
    updateChunk: (updatedChunk: Chunk, chunkIndex: number) => void;

    problem: Problem;
    problemIndex: number;
    edit?: boolean;
    onInstructionHover: (hovered: boolean) => void; // Function to change the parent's hover state

    disableInstructionProblemDrag?: boolean; //used to disable drag and drop for instructions and problems when on the search
    chunkIndex: number;
}

const ProblemComponent: React.FC<ProblemProps> = ({ chunkIndex, parentChunk, parentChunkIndex, updateChunk, problem, problemIndex, disableInstructionProblemDrag }) => {
    const { setDragState } = useDragContext();

    const [, ref] = useDrag({
        type: PROBLEM_DRAG_TYPE,
        item: () => {
            setDragState({ isDragging: true, dragType: PROBLEM_DRAG_TYPE });
            return { ...problem, content: problem.content } as Problem;
        },
        end: () => {
            setDragState({ isDragging: false, dragType: null });
        },
    });

    const [, drop] = useDrop({
        accept: [INSTRUCTION_DRAG_TYPE, PROBLEM_DRAG_TYPE],
        hover: () => {
            console.log('hover instruction')
        },
        drop: (item: Instruction | Problem) => {
            const updatedContent = [...parentChunk.content];

            const targetIndex = problemIndex !== undefined ? problemIndex : updatedContent.length;
            updatedContent.splice(targetIndex, 0, item);

            const markedContent = updatedContent.map((contentItem, index) => ({
                ...contentItem,
                isDuplicate:
                    ('instructionId' in contentItem && 'instructionId' in item)
                        ? contentItem.instructionId === item.instructionId && index !== targetIndex
                        : ('problemId' in contentItem && 'problemId' in item)
                            ? contentItem.problemId === item.problemId && index !== targetIndex
                            : false
            }));

            const filteredContent = markedContent.filter(contentItem => !contentItem.isDuplicate);

            const updatedChunk = { ...parentChunk, content: filteredContent };
            updateChunk(updatedChunk, parentChunkIndex);
        }
    });


    return (

        <div

            ref={(node) => disableInstructionProblemDrag ? ref(drop(node)) : node}
            className="flex group flex-row flex-wrap cursor-pointer">
            {problem.content.map((item, index) => (
                <span key={index} style={{ display: 'inline' }}>
                    {(() => {
                        switch (item.type) {
                            case 'text':
                                return (
                                    <div
                                        className={'text-xs md:text-lg z-10  border-2 border-transparent border-dashed hover:border-2 p-1 m-1 group-hover:border-2 group-hover:border-dashed'}
                                    >
                                        {item.value}
                                    </div>
                                );
                            case 'math':
                                return (
                                    <ReactMarkdown
                                        className={"text-xs md:text-lg z-10  border-gray-100 border-2 border-transparent border-dashed hover:border-2 p-1 m-1 group-hover:border-2 group-hover:border-dashed"}
                                        remarkPlugins={[remarkGfm, remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                    >
                                        {`${item.value}`}
                                    </ReactMarkdown>
                                );
                            case 'table':
                                return (
                                    <ReactMarkdown
                                        className={"text-xs md:text-lg z-10  border-gray-100 border-2 border-transparent border-dashed hover:border-2 p-1 m-1 group-hover:border-2 group-hover:border-dashed"}
                                        remarkPlugins={[remarkGfm, remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                    >
                                        {String.raw`${item.value}`}
                                    </ReactMarkdown>
                                );
                            case 'image':
                                //todo: get better descriptions added to the ASTs
                                // console.log("image", item)
                                return (
                                    <img
                                        src={item.value}
                                        alt="Description"
                                        className="text-xs md:text-lg z-10 p-1 m-1 border-2 border-transparent border-dashed hover:border-2 group-hover:border-2 group-hover:border-dashed"
                                    />
                                );
                            case 'subproblems':
                                return <SubproblemsComponent subproblems={item} />;
                            default:
                                return null;
                        }
                    })()}
                </span>
            ))}
        </div>

    );
};

interface SubproblemsProps {
    subproblems: Subproblems;
}

const SubproblemsComponent: React.FC<SubproblemsProps> = ({ subproblems }) => {
    return (
        <div className="flex flex-col">
            {subproblems.content.map((subproblem, index) => (
                <SubproblemComponent key={index} subproblem={subproblem} />
            ))}
        </div>
    );
};

interface SubproblemProps {
    subproblem: Subproblem
}

const SubproblemComponent: React.FC<{ subproblem: Subproblem }> = ({ subproblem }: SubproblemProps) => {
    return (
        <div className="flex flex-col items-center text-xs md:text-lg z-10 p-1 m-1 border-2 border-transparent border-dashed hover:border-2 group-hover:border-2 group-hover:border-dashed">
            <div className="mb-2 font-bold">{subproblem.label}</div>
            {subproblem.content.map((item, index) => (
                <span key={index}>
                    {(() => {
                        switch (item.type) {
                            case 'text':
                                return (
                                    <div
                                        className="text-xs md:text-lg z-10 border-2 border-transparent border-dashed hover:border-purple-500 p-1 m-1 group-hover:border-purple-500"
                                    >
                                        {item.value}
                                    </div>
                                );
                            case 'math':
                                return (
                                    <ReactMarkdown
                                        className="prose prose-sm md:prose-lg z-10 border-2 border-transparent border-dashed hover:border-purple-500 p-1 m-1 group-hover:border-purple-500"
                                        remarkPlugins={[remarkGfm, remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                    >
                                        {`${item.value}`}
                                    </ReactMarkdown>
                                );
                            case 'table':
                                return (
                                    <ReactMarkdown
                                        className="prose prose-sm md:prose-lg z-10 border-2 border-transparent border-dashed hover:border-purple-500 p-1 m-1 group-hover:border-purple-500"
                                        remarkPlugins={[remarkGfm, remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                    >
                                        {String.raw`${item.value}`}
                                    </ReactMarkdown>
                                );
                            case 'image':
                                //todo: get better descriptions added to the ASTs
                                // console.log("image", item)
                                return (
                                    <img
                                        src={item.value}
                                        alt="Description"
                                        className="text-xs md:text-lg z-10 p-1 m-1 border-2 border-transparent border-dashed hover:border-purple-500 group-hover:border-purple-500"
                                    />
                                );
                            default:
                                return null;
                        }
                    })()}
                </span>
            ))}
        </div>
    );
};

export default SubproblemComponent;

