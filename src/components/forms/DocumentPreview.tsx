import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Link } from 'react-router-dom';
import { Document, Table, Image, Text, Math } from '../../interfaces';

interface DocumentPreviewProps {
    document: Document;
    disabledClick?: boolean;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ document, disabledClick }) => {
    const [isHovering, setIsHovering] = useState(false);

    const { creator, upvotes, tips, id, problemChunks } = document;

    const renderContent = (content: (Text | Math | Table | Image)[]) => {
        return content.map((item, index) => {
            switch (item.type) {
                case 'text':
                    return (
                        <ReactMarkdown
                            key={index}
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
                            key={index}
                            className={"z-10 text-purple-300 border-gray-100 border-2 border-transparent border-dashed hover:border-2 hover:border-purple-dashed p-1 m-1 group-hover:border-2 group-hover:border-purple-500 group-hover:border-dashed"}
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                        >
                            {`$$${item.value}$$`}
                        </ReactMarkdown>
                    );
                case 'table':
                    <ReactMarkdown
                        className={"z-10 text-purple-300 border-gray-100 border-2 border-transparent border-dashed hover:border-2 hover:border-purple-dashed p-1 m-1 group-hover:border-2 group-hover:border-purple-500 group-hover:border-dashed"}
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                    >
                        {item.value}
                    </ReactMarkdown>

                    break;
                case 'image':
                    return (
                        <img
                            key={index}
                            src={item.value}
                            alt="Description"
                            className="z-10 p-1 m-1 border-2 border-transparent border-dashed hover:border-2 hover:border-purple-dashed group-hover:border-2 group-hover:border-purple-500 group-hover:border-dashed"
                        />
                    );
                default:
                    return null;
            }
        });
    };



    useEffect(() => {
        console.log(document, document.problemChunks)
    })

    const contentEmpty = !problemChunks || problemChunks.length === 0;

    return (
        <div
            className={`m-2 bg-white rounded-2xl relative ${disabledClick ? '' : 'cursor-pointer'}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={(e) => { if (disabledClick) e.preventDefault(); }}
        >
            <div className='p-2'>
                {contentEmpty ? (
                    <div className="preview-content h-32 p-2 rounded-lg text-xs bg-gray-800 text-center flex items-center justify-center">
                        <span>This document is empty</span>
                    </div>
                ) : (
                    <div className="preview-content overflow-y-auto h-32 p-2 rounded-lg text-xs bg-gray-800">
                        {problemChunks?.map((chunk, index) => (
                            <div key={index}>
                                {chunk.content.map((contentItem, contentIndex) => (
                                    <div key={contentIndex}>{renderContent(contentItem.content)}</div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}

                {!contentEmpty && !disabledClick && <div className="document-footer mt-4 bg-gray-200 p-4 rounded-lg text-sm w-10/12 mx-auto">
                    <h2 className="text-base font-bold">Created by {document.creator || "unknown"}</h2>
                    {!disabledClick && isHovering && (
                        <div className="rounded-b-2xl absolute inset-x-0 top-2/3 bottom-0 bg-gray-600 bg-opacity-70 flex justify-center items-center">
                            <span className="text-white text-xl font-bold">View</span>
                        </div>
                    )}
                    {document.title}
                </div>}
            </div>
        </div>
    );


};

export default DocumentPreview;
