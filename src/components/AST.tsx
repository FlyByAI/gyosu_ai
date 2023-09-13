import React, { useEffect, useState } from 'react';
import 'katex/dist/katex.min.css';
import KaTeX from 'katex';
import { CHUNK_DRAG_TYPE, CHUNK_TYPE, Chunk, Document, INSTRUCTION_DRAG_TYPE, INSTRUCTION_TYPE, Instruction, PROBLEM_DRAG_TYPE, PROBLEM_TYPE, Problem } from '../interfaces';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import ToolWrapper from './math/ToolWrapper';
import { useSidebarContext } from '../contexts/useSidebarContext';
import CheckmarkIcon from '../svg/CheckmarkIcon';
import TrashIcon from '../svg/TrashIcon';
import useSubmitDocument from '../hooks/tools/math/useSubmitDocument';
import useGetDocument from '../hooks/tools/math/useGetDocument';
import { useParams } from 'react-router-dom';
import useEnvironment from '../hooks/useEnvironment';
import { Tooltip as ReactTooltip } from "react-tooltip";
import OverflowMenu from './OverflowMenu';
import PlusIcon from '../svg/PlusIcon';
import ArrowLeft from '../svg/ArrowLeftIcon';
import { useModal } from '../contexts/useModal';
import AddChunkModal from './AddChunkModal';


interface ChunkProps {
    chunk: Chunk;
    edit?: boolean;
    insertChunk?: (chunkIndex: number) => void;
    updateChunk: (updatedChunk: Chunk, chunkIndex: number) => void;
    chunkIndex: number;
    enableTools?: boolean;
    selectable?: boolean;
}

export const ChunkComponent: React.FC<ChunkProps> = ({ chunk, insertChunk, updateChunk, chunkIndex, enableTools, selectable }) => {

    const { activeChunkIndices, setActiveChunkIndices } = useSidebarContext();
    const { apiUrl } = useEnvironment();

    const { openModal } = useModal();

    const endpoint2 = `${apiUrl}/math_app/school_document/`;
    const { isLoading, updateDocument } = useSubmitDocument(endpoint2);

    const [, ref] = useDrag({
        type: CHUNK_DRAG_TYPE,
        item: { ...chunk, content: chunk.content } as Chunk
    });

    const [isHovered, setIsHovered] = useState(false);

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


    return (
        <>
            <ReactTooltip
                id='chunkDragTip'
                place="right"
                offset={8}
                children={<><div className='flex flex-row items-center justify-center'>Click and drag to</div>
                    <div className='flex flex-row items-center justify-center'>a problem bank.</div>
                </>}
                variant="light"
            />
            <ReactTooltip
                id='addChunkTip'
                place="bottom"
                content={`Add problem to problem bank.`}
                variant="light"
            />
            <ReactTooltip
                id='deleteChunkTip'
                place="bottom"
                content={`Delete this problem from bank.`}
                variant="light"
            />
            <div
                ref={(node) => ref(drop(node))}
                onMouseEnter={() => !isHovered && setIsHovered(true)}
                onMouseLeave={() => isHovered && setIsHovered(false)}
                data-tooltip-id='chunkDragTip'
                className={"border-2 relative border-transparent p-4 w-full " + (isHovered ? " hover:border-white border-dashed hover:border-2 hover:border-purple-dashed" : '') + ((activeChunkIndices.includes(chunkIndex)) ? " bg-blue-900 " : '')}
            >
                <div className="absolute top-0 right-0 pe-2 mt-2 text-white">
                    <OverflowMenu
                    >
                        {id && <button
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteChunk(chunkIndex);
                            }}
                            data-tooltip-id="deleteChunkTip"
                            className="text-red-500 flex-row flex w-max"
                        >
                            <TrashIcon className='ms-2' />
                        </button>}
                        <AddChunkModal chunk={chunk} modalId={'addChunkModal'} enabled={false} />
                    </OverflowMenu>
                </div>

                {selectable && (activeChunkIndices.includes(chunkIndex) ?
                    <div className='flex text-green-300 h-4 w-6'>
                        <CheckmarkIcon />
                    </div> :
                    <div className='flex'>
                        <input
                            type="checkbox"
                            defaultChecked={activeChunkIndices.includes(chunkIndex)}
                            className="focus:ring-green-500 h-4 w-6 text-green-600 rounded"
                        />
                    </div>)

                }
                {/* {chunk.parentChunkId && <div className='text-gray-400 text-xs'>Parent: {chunk.parentChunkId}</div>} */}

                {chunk.content.map((item, index) => {
                    const element = (() => {
                        switch (item.type) {
                            case 'instruction':
                                return <InstructionComponent instructionIndex={index} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} instruction={item} onInstructionHover={setIsHovered} />;
                            case 'problem':
                                return <ProblemComponent problemIndex={index} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} problem={item} onInstructionHover={setIsHovered} />;
                            default:
                                return null;
                        }
                    })();

                    const wrappedElement = enableTools ? (
                        <ToolWrapper
                            key={`${item.type}-${index}-${chunk.content.length}`}
                            insertChunk={insertChunk}
                            updateChunk={updateChunk}
                            chunkIndex={chunkIndex}
                            chunk={chunk}
                            {...(item.type === 'instruction' ? { instruction: item } : { problem: item })}
                        >
                            {element}
                        </ToolWrapper>
                    ) : element;

                    return (
                        <div key={`${item.type}-${index}-${chunk.content.length}`}>
                            {wrappedElement}
                        </div>
                    );
                })}

            </div >
        </>
    );

};


interface InstructionProps {
    instruction: Instruction;
    edit?: boolean;
}

interface InstructionProps {
    parentChunk: Chunk;
    parentChunkIndex: number;
    updateChunk: (updatedChunk: Chunk, chunkIndex: number) => void;

    instruction: Instruction;
    instructionIndex: number;
    edit?: boolean;
    onInstructionHover: (hovered: boolean) => void; // Function to change the parent's hover state
}

const InstructionComponent: React.FC<InstructionProps> = ({ parentChunk, parentChunkIndex, updateChunk, instruction, instructionIndex }) => {
    const [, ref] = useDrag({
        type: INSTRUCTION_DRAG_TYPE,
        item: { ...instruction, content: instruction.content } as Instruction,
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

    function processLatexString(latex_string: string): string {
        const result = latex_string.replace(/^\\\(/, '')
            .replace(/\\\)$/g, '')
            .replace(/^\\\\$/gm, '')
            .replace(/\\\\\n/g, '')
            .replace(/\n/g, '')
            .trim();
        return result;
    }

    return (
        <div ref={(node) => ref(drop(node))} className="flex group flex-row flex-wrap">
            {instruction.content.map((item, index) => (
                <span key={index} style={{ display: 'inline' }}>
                    {(() => {
                        switch (item.type) {
                            case 'text':
                                return (
                                    <ReactMarkdown
                                        className={"z-1 text-blue-300 border-2 border-transparent border-dashed hover:border-2 hover:border-purple-dashed p-1 m-1 group-hover:border-2 group-hover:border-blue-500 group-hover:border-dashed"}
                                        remarkPlugins={[remarkGfm, remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                    >
                                        {item.value}
                                    </ReactMarkdown>
                                );
                            case 'math':
                                return (
                                    <ReactMarkdown
                                        className={"z-1 text-yellow-200 border-2 border-transparent border-dashed hover:border-2 hover:border-purple-dashed p-1 m-1 group-hover:border-2 group-hover:border-yellow-300 group-hover:border-dashed"}
                                        remarkPlugins={[remarkGfm, remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                    >
                                        {`$$${processLatexString(item.value)}$$`}
                                    </ReactMarkdown>
                                );
                            case 'table':
                                return (
                                    <ReactMarkdown
                                        className={"z-10 text-purple-300 border-gray-100  border-2 border-transparent border-dashed hover:border-2 hover:border-purple-dashed p-1 m-1 group-hover:border-2 group-hover:border-purple-500 group-hover:border-dashed"}
                                        remarkPlugins={[remarkGfm, remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                    >
                                        {`${item.value}`}
                                    </ReactMarkdown>
                                );
                            case 'image':
                                return (
                                    <img
                                        src={item.value}
                                        alt="Description"
                                        className="z-10 p-1 m-1 border-2 border-transparent border-dashed hover:border-2 hover:border-purple-dashed group-hover:border-2 group-hover:border-purple-500 group-hover:border-dashed"
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


interface ProblemProps {
    parentChunk: Chunk;
    parentChunkIndex: number;
    updateChunk: (updatedChunk: Chunk, chunkIndex: number) => void;

    problem: Problem;
    problemIndex: number;
    edit?: boolean;
    onInstructionHover: (hovered: boolean) => void; // Function to change the parent's hover state
}

const ProblemComponent: React.FC<ProblemProps> = ({ parentChunk, parentChunkIndex, updateChunk, problem, problemIndex }) => {
    const [, ref] = useDrag({
        type: PROBLEM_DRAG_TYPE,
        item: { ...problem, content: problem.content } as Problem,
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

    function processLatexString(latex_string: string): string {
        const result = latex_string.replace(/^\\\(/, '')
            .replace(/\\\)$/g, '')
            .replace(/^\\\\$/gm, '')
            .replace(/\\\\\n/g, '')
            .replace(/\n/g, '')
            .trim();
        return result;
    }

    return (
        <div ref={(node) => ref(drop(node))} className="flex group flex-row flex-wrap">
            {problem.content.map((item, index) => (
                <span key={index} style={{ display: 'inline' }}>
                    {(() => {
                        switch (item.type) {
                            case 'text':
                                return (
                                    <ReactMarkdown
                                        className={'z-10 text-yellow-100 border-2 border-transparent border-dashed hover:border-2 hover:border-purple-dashed p-1 m-1 group-hover:border-2 group-hover:border-yellow-100 group-hover:border-dashed'}
                                        remarkPlugins={[remarkGfm, remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                    >
                                        {item.value}
                                    </ReactMarkdown>
                                );
                            case 'math':
                                return (
                                    <ReactMarkdown
                                        className={"z-10 text-purple-300 border-gray-100 border-2 border-transparent border-dashed hover:border-2 hover:border-purple-dashed p-1 m-1 group-hover:border-2 group-hover:border-purple-500 group-hover:border-dashed"}
                                        remarkPlugins={[remarkGfm, remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                    >
                                        {`$$${processLatexString(item.value)}$$`}
                                    </ReactMarkdown>
                                );
                            case 'table':
                                return (
                                    <ReactMarkdown
                                        className={"z-10 text-purple-300 border-gray-100 border-2 border-transparent border-dashed hover:border-2 hover:border-purple-dashed p-1 m-1 group-hover:border-2 group-hover:border-purple-500 group-hover:border-dashed"}
                                        remarkPlugins={[remarkGfm, remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                    >
                                        {item.value}
                                    </ReactMarkdown>
                                );
                            case 'image':
                                return (
                                    <img
                                        src={item.value}
                                        alt="Description"
                                        className="z-10 p-1 m-1 border-2 border-transparent border-dashed hover:border-2 hover:border-purple-dashed group-hover:border-2 group-hover:border-purple-500 group-hover:border-dashed"
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

export default ProblemComponent;
