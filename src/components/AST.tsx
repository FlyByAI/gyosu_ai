import React, { useEffect, useState } from 'react';
import 'katex/dist/katex.min.css';
import KaTeX from 'katex';
import { CHUNK_DRAG_TYPE, CHUNK_TYPE, Chunk, Document, INSTRUCTION_DRAG_TYPE, INSTRUCTION_TYPE, Instruction, PROBLEM_DRAG_TYPE, PROBLEM_TYPE, Problem } from '../interfaces';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { useDrag, useDrop } from 'react-dnd';
import ToolBadge from './math/ToolBadge';
import ToolWrapper from './math/ToolWrapper';


const borderHoverClasses = " hover:border-gray-100 hover:border-dashed hover:border-2ed p-1 m-1"
const groupHoverClasses = " group-hover:border-2 group-hover:border-gray-200 group-hover:border-dashed"

interface ChunkProps {
    chunk: Chunk;
    edit?: boolean;
}

export const ChunkComponent: React.FC<ChunkProps> = ({ chunk }) => {
    const [content, setContent] = useState<Chunk['content']>(chunk.content);
    const [, ref] = useDrag({
        type: CHUNK_DRAG_TYPE,
        item: { type: CHUNK_TYPE, content: chunk.content } as Chunk
    });

    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    const onDelete = (index: number) => {
        const updatedContent = [...content];
        updatedContent.splice(index, 1);
        setContent(updatedContent);
        setSelectedIndex(null); // Reset selected index after deletion
    };

    const [, drop] = useDrop({
        accept: [INSTRUCTION_DRAG_TYPE, PROBLEM_DRAG_TYPE],
        hover: () => {
            setIsHovered(true);
        },
        drop: (item: Instruction | Problem) => {
            if (item.type === INSTRUCTION_TYPE || item.type === PROBLEM_TYPE) {
                setContent([...content, item]);
            }
        },
    });


    return (
        <div
            ref={(node) => ref(drop(node))}
            onMouseEnter={() => !isHovered && setIsHovered(true)}
            onMouseLeave={() => isHovered && setIsHovered(false)}
            className={"text-gray-600 p-6 m-2 " + (isHovered ? borderHoverClasses : '')}
        >
            {content.map((item, index) => {
                return (
                    <ToolWrapper onDelete={() => onDelete(index)} key={`${item.type}-${index}-${content.length}`}>
                        <div onClick={() => setSelectedIndex(index === selectedIndex ? null : index)}>
                            {(() => {
                                switch (item.type) {
                                    case 'instruction':
                                        return <InstructionComponent instruction={item} onInstructionHover={setIsHovered} />;
                                    case 'problem':
                                        return <ProblemComponent problem={item} onInstructionHover={setIsHovered} />;
                                    default:
                                        console.log("NO MATCH", item);
                                        return null;
                                }
                            })()}
                        </div>
                    </ToolWrapper>
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
                                            className={'text-blue-300 border-2 border-transparent' + borderHoverClasses + groupHoverClasses}
                                            remarkPlugins={[remarkGfm, remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                        >
                                            {`${item.value}`}
                                        </ReactMarkdown>
                                    );
                                case 'math':
                                    return (
                                        <ReactMarkdown
                                            className={'text-yellow-200 border-2 border-transparent' + borderHoverClasses + groupHoverClasses}
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
                                            className={'text-gray-200 border-2 border-transparent' + borderHoverClasses + groupHoverClasses}
                                            remarkPlugins={[remarkGfm, remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                        >
                                            {`${item.value}`}
                                        </ReactMarkdown>
                                    );
                                case 'math':
                                    return (
                                        <ReactMarkdown
                                            className={'text-purple-300 border-gray-100 border-dashed hover:border-2 border-2 border-transparent' + borderHoverClasses + groupHoverClasses}
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
