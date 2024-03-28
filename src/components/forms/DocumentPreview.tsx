import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { Document, Image, Math, Subproblems, Table, Text } from '../../interfaces';
import TrashIcon from '../../svg/TrashIcon';
import { SubproblemsComponent } from '../AST';

interface DocumentPreviewProps {
    document: Document;
    disabledClick?: boolean;
    handleDelete?: (document: Document) => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ document, disabledClick, handleDelete }) => {
    const [isHovering, setIsHovering] = useState(false);

    const { creator, upvotes, tips, id, problemChunks } = document;

    const renderContent = (content: (Text | Math | Table | Image | Subproblems)[]) => {
        return content.map((item) => {
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
        });
    };



    useEffect(() => {
        console.log(document, document.problemChunks)
    })

    const contentEmpty = !problemChunks || problemChunks.length === 0;

    const navigate = useNavigate();

    return (
        <div
            className={`relative ${disabledClick ? '' : 'cursor-pointer'} card shadow-xl`}
            onClick={() => navigate(`/math-app/bank/${id}`)}
        >
            <div className="card-header">
                <div className="card-title">{document.title}</div>
                <div className="absolute top-0 right-0 flex gap-2 p-2">
                    {/* <button
                        onClick={(e) => { e.stopPropagation(); handleEditClick(); }}
                        className="btn btn-sm btn-ghost tooltip tooltip-left"
                        data-tip="Edit"
                    >
                        <EditIcon />
                    </button> */}
                    {handleDelete &&
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(document);
                            }}
                            className="btn btn-sm btn-ghost tooltip tooltip-left"
                            data-tip="Delete"
                        >
                            <TrashIcon />
                        </button>
                    }
                </div>
            </div>
            <div className="card-body">
                {contentEmpty ? (
                    <div className="preview-content flex items-center justify-center italic">
                        <span>This problem bank is empty</span>
                    </div>
                ) : (
                    <div className="preview-content overflow-y-auto min-h-64 hover:border">
                        {problemChunks?.map((chunk, index) => (
                            <div key={index}>
                                {chunk.content.map((contentItem, contentIndex) => (
                                    <div key={contentIndex}>{renderContent(contentItem.content)}</div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

    );


};

export default DocumentPreview;
