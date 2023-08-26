

import 'katex/dist/katex.min.css'; // Import KaTeX CSS

import { Chunk, Instruction, Problem, Document } from '../../interfaces';
import ReactMarkdown from 'react-markdown';

import React, { createRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useGetDocument from '../../hooks/tools/math/useGetDocument';
import { notSecretConstants } from '../../constants/notSecretConstants';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import DownloadDocx from '../../components/exports/DownloadDocx';
import DownloadPDF from '../../components/exports/DownloadPDF';

interface ChunkProps {
    chunk: Chunk;
}

export const PrintableChunkComponent: React.FC<ChunkProps> = ({ chunk }) => {
    return (
        <div>
            {chunk.content.map((item, index) => (
                <div key={`${item.type}-${index}-${chunk.content.length}`}>
                    {(() => {
                        switch (item.type) {
                            case 'instruction':
                                return <PrintableInstructionComponent instruction={item} />;
                            case 'problem':
                                return <PrintableProblemComponent problem={item} />;
                            default:
                                return null;
                        }
                    })()}
                </div>
            ))}
        </div>
    );
};

interface InstructionProps {
    instruction: Instruction;
}

const PrintableInstructionComponent: React.FC<InstructionProps> = ({ instruction }) => {
    return (
        <div>
            {instruction.content.map((item, index) => (
                <div key={index}>
                    {(() => {
                        switch (item.type) {
                            case 'text':
                                return <ReactMarkdown>{`${item.value}`}</ReactMarkdown>;
                            case 'math':
                                return <ReactMarkdown>{`$$${item.value}$$`}</ReactMarkdown>;
                            case 'table':
                                return <span key={index}>Table content here</span>;
                            default:
                                return null;
                        }
                    })()}
                </div>
            ))}
        </div>
    );
};

interface ProblemProps {
    problem: Problem;
}

const PrintableProblemComponent: React.FC<ProblemProps> = ({ problem }) => {

    return (
        <div>
            {problem.content.map((item, index) => (
                <div key={index}>
                    {(() => {
                        switch (item.type) {
                            case 'text':
                                return <ReactMarkdown>{`${item.value}`}</ReactMarkdown>;
                            case 'math':
                                return <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                >
                                    {`$$${item.value}$$`}
                                </ReactMarkdown>;
                            case 'table':
                                return <span key={index}>Table content here</span>;
                            default:
                                return null;
                        }
                    })()}
                </div>
            ))}
        </div>
    );
};


const PrintableDocumentComponent: React.FC = () => {
    const { id } = useParams();
    const { document } = useGetDocument(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/school_document/`, Number(id));

    const ref = createRef<HTMLDivElement>();
    const [html, setHtml] = useState<string>('');

    useEffect(() => {
        setHtml(ref.current?.innerHTML || '');
        console.log(ref.current)
    }, [document, ref])


    return (
        <div className='flex flex-col items-center'>
            <div className='flex flex-row my-4'>
                <DownloadDocx html={html} />
            </div>
            <DownloadPDF htmlContent={html} />
            <div ref={ref} className="flex flex-col items-center">
                {document ? <div className='bg-white max-w-4xl'>
                    <p>Document: {document?.title}</p>
                    {document?.problemChunks?.map((chunk, index) => (
                        <PrintableChunkComponent key={index} chunk={chunk} />
                    ))}
                </div> : null}
            </div>
        </div>
    );
};

export default PrintableDocumentComponent;
