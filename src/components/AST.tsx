import React from 'react';
import 'katex/dist/katex.min.css';
import KaTeX from 'katex';
import { CHUNK_DRAG_TYPE, CHUNK_TYPE, Chunk, DocumentAST, INSTRUCTION_DRAG_TYPE, INSTRUCTION_TYPE, Instruction, PROBLEM_DRAG_TYPE, PROBLEM_TYPE, Problem } from '../interfaces';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { useDrag } from 'react-dnd';


interface DocumentASTProps {
    document: DocumentAST;
    edit?: boolean;
}

export const DocumentComponent: React.FC<DocumentASTProps> = ({ document }) => (
    <div>
        {document.content.map((chunk, index) => (
            <ChunkComponent key={index} chunk={chunk} />
        ))}
    </div>
);

interface ChunkProps {
    chunk: Chunk;
    edit?: boolean;
}

export const ChunkComponent: React.FC<ChunkProps> = ({ chunk }) => {
    const [, ref] = useDrag({
        type: CHUNK_DRAG_TYPE,
        item: { type: CHUNK_TYPE, chunk },
    });

    return (
        <div ref={ref} className="bg-gray-600 p-2">
            {chunk.content.map((item, index) => {
                switch (item.type) {
                    case 'instruction':
                        return <InstructionComponent key={index} instruction={item} />;
                    case 'problem':
                        return <ProblemComponent key={index} problem={item} />;
                    // Add other cases here if you have other types
                    default:
                        return null;
                }
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
}

const InstructionComponent: React.FC<InstructionProps> = ({ instruction }) => {
    const [, ref] = useDrag({
        type: INSTRUCTION_DRAG_TYPE,
        item: { type: INSTRUCTION_TYPE, instruction },
    });

    return (
        <div ref={ref} className="flex">
            {instruction.content.map((item, index) => {
                switch (item.type) {
                    case 'text':
                        return <ReactMarkdown
                            className='bg-purple-100'
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                        >
                            {`${item.value}`}
                        </ReactMarkdown>;
                    case 'math':
                        return <ReactMarkdown
                            className='bg-purple-100'
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                        >
                            {`$$${item.value}$$`}
                        </ReactMarkdown>;
                    case 'table':
                        // You can render tables here, or add a custom Table component
                        return <span key={index}>Table content here</span>;
                    default:
                        return null;
                }
            })}
        </div>
    );
};


interface ProblemProps {
    problem: Problem;
    edit?: boolean;
}

interface ProblemProps {
    problem: Problem;
    edit?: boolean;
}

const ProblemComponent: React.FC<ProblemProps> = ({ problem }) => {
    const [, ref] = useDrag({
        type: PROBLEM_DRAG_TYPE,
        item: { type: PROBLEM_TYPE, problem },
    });

    return (
        <div ref={ref} className="flex">
            {problem.content.map((item, index) => {
                switch (item.type) {
                    case 'text':
                        return <span className="bg-yellow-200" key={index}>{item.value}</span>;
                    case 'math':
                        return <ReactMarkdown
                            className='bg-purple-200'
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                        >
                            {`$$${item.value}$$`}
                        </ReactMarkdown>;
                    case 'image':
                        // You can render images here, or add a custom Image component
                        return <img key={index} src={item.value} alt="Problem content" />;
                    default:
                        return null;
                }
            })}
        </div>
    );
};

export default ProblemComponent;
