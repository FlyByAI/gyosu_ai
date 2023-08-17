import React from 'react';
import 'katex/dist/katex.min.css';
import KaTeX from 'katex';
import { Chunk, DocumentAST, Instruction, Problem } from '../interfaces';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface DocumentASTProps {
    content: DocumentAST;
    edit?: boolean;
}

export const DocumentComponent: React.FC<DocumentASTProps> = ({ content }) => (
    <div>
        {content.content.map((chunk, index) => (
            <ChunkComponent key={index} content={chunk} />
        ))}
    </div>
);

interface ChunkProps {
    content: Chunk;
    edit?: boolean;
}

export const ChunkComponent: React.FC<ChunkProps> = ({ content }) => (
    <div className="bg-gray-600 p-2">
        {content.content.map((item, index) => {
            switch (item.type) {
                case 'instruction':
                    return <InstructionComponent key={index} content={item} />;
                case 'problem':
                    return <ProblemComponent key={index} content={item} />;
                // Add other cases here if you have other types
                default:
                    return null;
            }
        })}
    </div>
);

interface InstructionProps {
    content: Instruction;
    edit?: boolean;
}

const InstructionComponent: React.FC<InstructionProps> = ({ content }) => (
    <div className="flex">
        {content.content.map((item, index) => {
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


interface ProblemProps {
    content: Problem;
    edit?: boolean;
}

const ProblemComponent: React.FC<ProblemProps> = ({ content }) => (
    <div className="flex">
        {content.content.map((item, index) => {
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
