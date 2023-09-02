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
import ChunkSidebarWrapper from './math/ChunkSidebarWrapper';
import { useSidebarContext } from '../contexts/useSidebarContext';
import CheckmarkIcon from '../svg/CheckmarkIcon';
import TrashIcon from '../svg/TrashIcon';
import { notSecretConstants } from '../constants/notSecretConstants';
import useSubmitDocument from '../hooks/tools/math/useSubmitDocument';
import useGetDocument from '../hooks/tools/math/useGetDocument';
import { useParams } from 'react-router-dom';


interface ChunkProps {
    chunk: Chunk;
    edit?: boolean;
    insertChunk?: (chunkIndex: number) => void;
    updateChunk: (updatedChunk: Chunk, chunkIndex: number) => void;
    chunkIndex: number;
}

export const ChunkComponent: React.FC<ChunkProps> = ({ chunk, insertChunk, updateChunk, chunkIndex }) => {

    const { activeChunkIndices, setActiveChunkIndices } = useSidebarContext();

    const endpoint2 = `${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/school_document/`;
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

    const { document } = useGetDocument(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/school_document/`, Number(id));

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

        <div
            ref={(node) => ref(drop(node))}
            onMouseEnter={() => !isHovered && setIsHovered(true)}
            onMouseLeave={() => isHovered && setIsHovered(false)}
            className={"p-4 w-full relative " + ((activeChunkIndices.includes(chunkIndex)) ? " bg-blue-900 " : '')}
        >
            {isHovered && <button
                onClick={(e) => {
                    e.stopPropagation();
                    deleteChunk(chunkIndex);
                }}
                data-tooltip-id="deleteTip"
                className="absolute top-0 right-0 pe-2 pt-2 text-red-500 z-10"
            >
                <TrashIcon />
            </button>}

            {activeChunkIndices.includes(chunkIndex) ?
                <div className='flex text-green-300 h-4 w-6'>
                    <CheckmarkIcon />
                </div> :
                <div className='flex'>
                    <input
                        type="checkbox"
                        defaultChecked={activeChunkIndices.includes(chunkIndex)}
                        className="focus:ring-green-500 h-4 w-6 text-green-600 rounded"
                    />
                </div>

            }
            {/* {chunk.parentChunkId && <div className='text-gray-400 text-xs'>Parent: {chunk.parentChunkId}</div>} */}

            {chunk.content.length === 0 && <div className="text-gray-400 p-4">Drag and drop instructions or problems here</div>}
            {chunk.content.map((item, index) => {
                return (
                    <div key={`${item.type}-${index}-${chunk.content.length}`}>
                        {/* put at upper right, and show on hover */}

                        {(() => {
                            switch (item.type) {
                                case 'instruction':
                                    return (
                                        <ToolWrapper
                                            key={`${item.type}-${index}-${chunk.content.length}`}
                                            insertChunk={insertChunk}
                                            updateChunk={updateChunk}
                                            chunkIndex={chunkIndex}
                                            chunk={chunk}
                                            instruction={item}
                                        >
                                            <InstructionComponent instructionIndex={index} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} instruction={item} onInstructionHover={setIsHovered} />
                                        </ToolWrapper>
                                    );
                                case 'problem':
                                    return (
                                        <ToolWrapper
                                            key={`${item.type}-${index}-${chunk.content.length}`}
                                            insertChunk={insertChunk}
                                            updateChunk={updateChunk}
                                            chunkIndex={chunkIndex}
                                            chunk={chunk}
                                            problem={item}
                                        >
                                            <ProblemComponent problemIndex={index} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} problem={item} onInstructionHover={setIsHovered} />
                                        </ToolWrapper>
                                    );
                                default:
                                    return null;
                            }
                        })()}
                    </div>
                );
            })}
        </div>
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
        drop: (item: Instruction | Problem, monitor: DropTargetMonitor) => {
            const updatedContent = [...parentChunk.content];

            // Insert at target index and shift other elements down
            const targetIndex = instructionIndex ? instructionIndex : updatedContent.length;
            updatedContent.splice(targetIndex, 0, item);

            console.log(targetIndex)

            // Mark duplicates for removal except the newly inserted one
            const markedContent = updatedContent.map((contentItem, index) => {
                let isDuplicate = false;
                if ('instructionId' in contentItem && 'instructionId' in item) {
                    console.log(contentItem.instructionId, item.instructionId)
                    isDuplicate = contentItem.instructionId === item.instructionId && index !== targetIndex;
                } else if ('problemId' in contentItem && 'problemId' in item) {
                    isDuplicate = contentItem.problemId === item.problemId && index !== targetIndex;
                    console.log(contentItem.problemId, item.problemId)
                }
                return { ...contentItem, isDuplicate };
            });
            console.log(markedContent)

            // Remove duplicates
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
                                        className={"z-10 text-blue-300 border-2 border-transparent border-dashed hover:border-2 hover:border-purple-dashed p-1 m-1 group-hover:border-2 group-hover:border-blue-500 group-hover:border-dashed"}
                                        remarkPlugins={[remarkGfm, remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                    >
                                        {item.value}
                                    </ReactMarkdown>
                                );
                            case 'math':
                                return (
                                    <ReactMarkdown
                                        className={"z-10 text-yellow-200 border-2 border-transparent border-dashed hover:border-2 hover:border-purple-dashed p-1 m-1 group-hover:border-2 group-hover:border-yellow-300 group-hover:border-dashed"}
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
        drop: (item: Instruction | Problem, monitor: DropTargetMonitor) => {
            const updatedContent = [...parentChunk.content];

            // Insert at target index and shift other elements down
            const targetIndex = problemIndex ? problemIndex : updatedContent.length;
            updatedContent.splice(targetIndex, 0, item);

            // Mark duplicates for removal except the newly inserted one
            const markedContent = updatedContent.map((contentItem, index) => {
                let isDuplicate = false;
                if ('instructionId' in contentItem && 'instructionId' in item) {
                    console.log(contentItem.instructionId, item.instructionId)
                    isDuplicate = contentItem.instructionId === item.instructionId && index !== targetIndex;
                } else if ('problemId' in contentItem && 'problemId' in item) {
                    isDuplicate = contentItem.problemId === item.problemId && index !== targetIndex;
                    console.log(contentItem.problemId, item.problemId)
                }
                console.log(contentItem, item)

                return { ...contentItem, isDuplicate };
            });
            console.log(markedContent)

            // Remove duplicates
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
                                        className={'z-10 text-gray-200 border-2 border-transparent border-dashed hover:border-2 hover:border-purple-dashed p-1 m-1 group-hover:border-2 group-hover:border-white group-hover:border-dashed'}
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
