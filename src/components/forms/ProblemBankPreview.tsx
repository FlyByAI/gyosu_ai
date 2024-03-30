import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import useSubmitDocument from '../../hooks/tools/math/useSubmitDocument';
import useEnvironment from '../../hooks/useEnvironment';
import { Document, Image, Math, Subproblems, Table, Text } from '../../interfaces';
import TrashIcon from '../../svg/TrashIcon';
import { SubproblemsComponent } from '../AST';
import EditTitle from '../document/EditTitle';

interface DocumentPreviewProps {
    document: Document;
    disabledClick?: boolean;
    handleDelete?: (document: Document) => void;
}

const ProblemBankPreview: React.FC<DocumentPreviewProps> = ({ document, disabledClick, handleDelete}) => {
    const [isHovering, setIsHovering] = useState(false);

    const navigate = useNavigate();

    const { apiUrl } = useEnvironment();
    const endpoint2 = `${apiUrl}/math_app/school_document/`;
    const {  updateDocument } = useSubmitDocument(endpoint2);

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

    return (
        <div
            className={`card w-3/4 mx-auto max-h-64 overflow-y-scroll bg-base-100 shadow-xl ${disabledClick ? '' : 'cursor-pointer'}`}
            onClick={() => !disabledClick && navigate(`/math-app/bank/${document.id}`)}
        >
            <div className='card-header'>
                <EditTitle title={document?.title} onUpdateTitle={(title) => updateDocument({ document: { ...document, title: title } })}/>
                {handleDelete && (
                    <div className="card-actions justify-end">
                        <button
                            className="btn btn-error btn-sm tooltip tooltip-left"
                            data-tip="Delete"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(document);
                            }}
                        >
                            <TrashIcon />
                        </button>
                    </div>
                )}
            </div>
            <div className="card-body">

                <h2 className="card-title">{document.title}</h2>
                {document.problemChunks && document.problemChunks.length > 0 ? (
                    document.problemChunks.map((chunk, index) => (
                        <div key={index} className="mb-4">
                            {chunk.content.map((contentItem, contentIndex) => (
                                <div key={contentIndex}>{renderContent(contentItem.content)}</div>
                            ))}
                        </div>
                    ))
                ) : (
                    <div className="flex justify-center items-center text-gray-500">
                        <p>This problem bank is empty.</p>
                    </div>
                )}

            </div>
        </div>

    );


};

export default ProblemBankPreview;
