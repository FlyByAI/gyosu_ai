import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import KaTeX from 'katex';
import { CHUNK_DRAG_TYPE, CHUNK_TYPE, Chunk, Document, INSTRUCTION_DRAG_TYPE, INSTRUCTION_TYPE, Instruction, PROBLEM_DRAG_TYPE, PROBLEM_TYPE, Problem } from '../interfaces';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { useDrag } from 'react-dnd';


interface DocumentASTProps {
    document: Document;
    edit?: boolean;
}

export const DocumentComponent: React.FC<DocumentASTProps> = ({ document }) => (
    <div>
        {document.problemChunks?.map((chunk, index) => (
            <ChunkComponent key={index} chunk={chunk} />
        ))}
    </div>
);

interface ChunkProps {
    chunk: Chunk;
    edit?: boolean;
}

export const ChunkComponent: React.FC<ChunkProps> = ({ chunk }) => {
    const [, ref] = useDrag({ type: CHUNK_DRAG_TYPE, item: { type: CHUNK_TYPE, chunk } });
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            ref={ref}
            onMouseEnter={() => !isHovered && setIsHovered(true)}
            onMouseLeave={() => isHovered && setIsHovered(false)}
            className={"text-gray-600 p-6 m-2 " + (isHovered ? borderHoverClasses : '')}
        >
            {chunk.content.map((item, index) => {
                switch (item.type) {
                    case 'instruction':
                        return <InstructionComponent key={index} instruction={item} onInstructionHover={setIsHovered} />;
                    case 'problem':
                        return <ProblemComponent key={index} problem={item} onInstructionHover={setIsHovered} />;
                    default:
                        return null;
                }
            })}
        </div>
    );
};

const borderHoverClasses = " border-gray-100 border-dashed hover:border-2 hover:border-purple-dashed p-1 m-1"
const groupHoverClasses = " group-hover:border-2 group-hover:border-gray-200 group-hover:border-dashed"
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
        item: { type: INSTRUCTION_TYPE, instruction },
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
                                            className={'text-blue-300' + borderHoverClasses + groupHoverClasses}
                                            remarkPlugins={[remarkGfm, remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                        >
                                            {`${item.value}`}
                                        </ReactMarkdown>
                                    );
                                case 'math':
                                    return (
                                        <ReactMarkdown
                                            className={'text-yellow-200' + borderHoverClasses + groupHoverClasses}
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
        item: { type: PROBLEM_TYPE, problem },
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
                                            className={'text-gray-200' + borderHoverClasses + groupHoverClasses}
                                            remarkPlugins={[remarkGfm, remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                        >
                                            {`${item.value}`}
                                        </ReactMarkdown>
                                    );
                                case 'math':
                                    return (
                                        <ReactMarkdown
                                            className={'text-purple-300 border-gray-100 border-dashed hover:border-2 hover:border-purple-dashed' + borderHoverClasses + groupHoverClasses}
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
