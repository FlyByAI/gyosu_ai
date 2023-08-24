import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Link } from 'react-router-dom';
import { Document, Table, Image, Text, Math } from '../../interfaces';

interface DocumentPreviewProps {
    document: Document;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ document }) => {
    const [isHovering, setIsHovering] = useState(false);

    const { creator, upvotes, tips, id, problemChunks } = document;

    const renderContent = (content: (Text | Math | Table | Image)[]) => {
        return content.map((item, index) => {
            switch (item.type) {
                case "text":
                    return <span key={index}>{item.value}</span>;
                case "math":
                    return <span key={index}>{item.value}</span>; // You can handle math rendering as needed
                case "image":
                    return <img key={index} src={item.value} alt="preview" />;
                case "table":
                    return (
                        <table key={index}>
                            <tbody>
                                <tr>
                                    {item.content.map((cell, cellIndex) => (
                                        <td key={cellIndex}>{cell.value}</td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    );

                default:
                    return null;
            }
        });
    };


    useEffect(() => {
        console.log(document, document.problemChunks)
    })

    return (
        <Link to={`/math-app/document/${id}`}
            className='m-2 bg-white rounded-2xl relative'
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className='p-2'>

                <div className="preview-content overflow-y-auto h-32 p-2 rounded-lg text-xs">
                    {problemChunks?.map((chunk, index) => (
                        <div key={index}>
                            {chunk.content.map((contentItem, contentIndex) => (
                                <div key={contentIndex}>{renderContent(contentItem.content)}</div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="document-footer mt-4 bg-gray-200 p-4 rounded-lg text-sm w-10/12 mx-auto">
                    <h2 className="text-base font-bold">Created by {creator}</h2>
                    {isHovering && (
                        <div className="rounded-b-2xl absolute inset-x-0 top-2/3 bottom-0 bg-gray-600 bg-opacity-70 flex justify-center items-center">
                            <span className="text-white text-xl font-bold">Edit</span>
                        </div>
                    )}
                    {document.title}
                    {upvotes > 0 && <p>Upvotes: {upvotes}</p>}
                    {tips > 0 && <p> Tips: {tips}</p>}
                </div>
            </div>
        </Link>
    );
};

export default DocumentPreview;
