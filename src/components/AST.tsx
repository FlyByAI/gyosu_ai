import React, { useEffect, useState } from 'react';
import 'katex/dist/katex.min.css';
import KaTeX from 'katex';
import { CHUNK_DRAG_TYPE, CHUNK_TYPE, Chunk, Document, INSTRUCTION_DRAG_TYPE, INSTRUCTION_TYPE, Instruction, PROBLEM_DRAG_TYPE, PROBLEM_TYPE, Problem } from '../interfaces';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { useDrag, useDrop } from 'react-dnd';
import ToolWrapper from './math/ToolWrapper';
import ChunkSidebarWrapper from './math/ChunkSidebarWrapper';
import { useSidebarContext } from '../contexts/useSidebarContext';
import CheckmarkIcon from '../svg/CheckmarkIcon';


interface ChunkProps {
    chunk: Chunk;
    edit?: boolean;
    insertChunk?: (chunkIndex: number) => void;
    deleteChunk?: (chunkIndex: number) => void;
    updateChunk: (updatedChunk: Chunk, chunkIndex: number) => void;
    chunkIndex: number;
}

export const ChunkComponent: React.FC<ChunkProps> = ({ chunk, insertChunk, deleteChunk, updateChunk, chunkIndex }) => {

    const { activeChunkIndices, setActiveChunkIndices } = useSidebarContext();

    const [, ref] = useDrag({
        type: CHUNK_DRAG_TYPE,
        item: { type: CHUNK_TYPE, content: chunk.content } as Chunk
    });

    const [isHovered, setIsHovered] = useState(false);

    const [, drop] = useDrop({
        accept: [INSTRUCTION_DRAG_TYPE, PROBLEM_DRAG_TYPE],
        hover: () => {
            setIsHovered(true);
        },
        drop: (item: Instruction | Problem) => {
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

    return (

        <div
            ref={(node) => ref(drop(node))}
            onMouseEnter={() => !isHovered && setIsHovered(true)}
            onMouseLeave={() => isHovered && setIsHovered(false)}
            className={"border-2 border-transparent p-4 " + (isHovered ? " hover:border-green-200 border-dashed hover:border-2 hover:border-purple-dashed" : '')}
        >

            {activeChunkIndices.includes(chunkIndex) ?
                <div className='flex text-green-300'>
                    <CheckmarkIcon />
                </div> :
                <div className='flex'>
                    <input
                        type="checkbox"
                        defaultChecked={activeChunkIndices.includes(chunkIndex)}
                        className="focus:ring-green-500 h-4 w-4 text-green-600 rounded"
                    />
                </div>
            }

            {chunk.content.length === 0 && <div className="text-gray-400 p-4">Drag and drop instructions or problems here</div>}
            {chunk.content.map((item, index) => {
                return (
                    <div key={`${item.type}-${index}-${chunk.content.length}`}>
                        {(() => {
                            switch (item.type) {
                                case 'instruction':
                                    return (
                                        <ToolWrapper
                                            key={`${item.type}-${index}-${chunk.content.length}`}
                                            insertChunk={insertChunk}
                                            deleteChunk={deleteChunk}
                                            updateChunk={updateChunk}
                                            chunkIndex={chunkIndex}
                                            chunk={chunk}
                                            instruction={item}
                                        >
                                            <InstructionComponent instruction={item} onInstructionHover={setIsHovered} />
                                        </ToolWrapper>
                                    );
                                case 'problem':
                                    return (
                                        <ToolWrapper
                                            key={`${item.type}-${index}-${chunk.content.length}`}
                                            insertChunk={insertChunk}
                                            deleteChunk={deleteChunk}
                                            updateChunk={updateChunk}
                                            chunkIndex={chunkIndex}
                                            chunk={chunk}
                                            problem={item}
                                        >
                                            <ProblemComponent problem={item} onInstructionHover={setIsHovered} />
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
    instruction: Instruction;
    edit?: boolean;
    onInstructionHover: (hovered: boolean) => void; // Function to change the parent's hover state
}

const InstructionComponent: React.FC<InstructionProps> = ({ instruction, onInstructionHover }) => {
    const [, ref] = useDrag({
        type: INSTRUCTION_DRAG_TYPE,
        item: { type: INSTRUCTION_TYPE, content: instruction.content } as Instruction,
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
        <div ref={ref} className="flex group"
            onMouseEnter={() => onInstructionHover(false)} // Turn off parent's hover state
            onMouseLeave={() => onInstructionHover(true)} // Turn on parent's hover state
        >
            {
                instruction.content.map((item, index) => (
                    <div className="me-2" key={index}>
                        {(() => {
                            switch (item.type) {
                                case 'text':
                                    return (
                                        <ReactMarkdown
                                            className={"text-blue-300 border-2 border-transparent border-dashed hover:border-2 hover:border-purple-dashed p-1 m-1 group-hover:border-2 group-hover:border-blue-500 group-hover:border-dashed"}
                                            remarkPlugins={[remarkGfm, remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                        >
                                            {`${item.value}`}
                                        </ReactMarkdown>
                                    );
                                case 'math':
                                    return (
                                        <ReactMarkdown
                                            className={"text-yellow-200 border-2 border-transparent border-dashed hover:border-2 hover:border-purple-dashed p-1 m-1 group-hover:border-2 group-hover:border-yellow-300 group-hover:border-dashed"}
                                            remarkPlugins={[remarkGfm, remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                        >
                                            {`$$${processLatexString(item.value)}$$`}
                                        </ReactMarkdown>
                                    );
                                case 'table':
                                    // You can render tables here, or add a custom Table component
                                    return <span key={index}>Table content here</span>;
                                default:
                                    return null;
                            }
                        })()}
                    </div>
                ))
            }
        </div >
    );
};


interface ProblemProps {
    problem: Problem;
    edit?: boolean;
}

interface ProblemProps {
    problem: Problem;
    edit?: boolean;
    onInstructionHover: (hovered: boolean) => void; // Function to change the parent's hover state
}

const ProblemComponent: React.FC<ProblemProps> = ({ problem, onInstructionHover }) => {
    const [, ref] = useDrag({
        type: PROBLEM_DRAG_TYPE,
        item: { type: PROBLEM_TYPE, content: problem.content } as Problem,
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
        <div ref={ref} className="flex group"
            onMouseEnter={() => onInstructionHover(false)} // Turn off parent's hover state
            onMouseLeave={() => onInstructionHover(true)} // Turn on parent's hover state
        >
            {
                problem.content.map((item, index) => (
                    <div className="me-2" key={index}>
                        {(() => {
                            switch (item.type) {
                                case 'text':
                                    return (
                                        <ReactMarkdown
                                            className={'text-gray-200 border-2 border-transparent border-dashed hover:border-2 hover:border-purple-dashed p-1 m-1 group-hover:border-2 group-hover:border-white group-hover:border-dashed'}
                                            remarkPlugins={[remarkGfm, remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                        >
                                            {`${item.value}`}
                                        </ReactMarkdown>
                                    );
                                case 'math':
                                    return (
                                        <ReactMarkdown
                                            className={"text-purple-300 border-gray-100  border-2 border-transparent border-dashed hover:border-2 hover:border-purple-dashed p-1 m-1 group-hover:border-2 group-hover:border-purple-500 group-hover:border-dashed"}
                                            remarkPlugins={[remarkGfm, remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                        >
                                            {`$$${processLatexString(item.value)}$$`}
                                        </ReactMarkdown>
                                    );
                                case 'table':
                                    // You can render tables here, or add a custom Table component
                                    return <span key={index}>Table content here</span>;
                                default:
                                    return null;
                            }
                        })()}
                    </div>
                ))
            }
        </div >
    );
};

export default ProblemComponent;
