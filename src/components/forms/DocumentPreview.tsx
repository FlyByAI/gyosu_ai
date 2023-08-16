import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Link } from 'react-router-dom';

interface DocumentPreviewProps {
    creator: string;
    upvotes: number;
    tips: number;
    modifiedBy: string[];
    index: number;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ creator, upvotes, tips, modifiedBy, index }) => {
    const [isHovering, setIsHovering] = useState(false);

    return (

        <Link to={`/document/${index}`}
            className='m-2 bg-white rounded-2xl relative'
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className='p-2'>

                <div className="document-footer mt-4 bg-gray-200 p-4 rounded-lg text-sm w-10/12 mx-auto">
                    <h2 className="text-base font-bold">Created by {creator}</h2>
                    {/* {isHovering && (
                        <div className="absolute inset-0 bg-gray-600 bg-opacity-70 flex justify-center items-center">
                            <span className="text-white text-xl font-bold">Edit</span>
                        </div>
                    )} */}
                    {isHovering && (
                        <div className=" rounded-b-2xl absolute inset-x-0 top-2/3 bottom-0 bg-gray-600 bg-opacity-70 flex justify-center items-center">
                            <span className="text-white text-xl font-bold">Edit</span>
                        </div>
                    )}
                    {upvotes > 0 && <p>Upvotes: {upvotes}</p>}
                    {tips > 0 && <p> Tips: {tips}</p>}
                    {modifiedBy.length > 0 &&
                        <>
                            <h3>Modified by:</h3>
                            <ul>
                                {modifiedBy.map((user, index) => (
                                    <li key={index}>{user}</li>
                                ))}
                            </ul>
                        </>
                    }
                </div>
            </div>
        </Link>)
}

export default DocumentPreview;
