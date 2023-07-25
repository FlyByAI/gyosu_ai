import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface DocumentPreviewProps {
    markdown: string;
    creator: string;
    upvotes: number;
    tips: number;
    modifiedBy: string[];
    index: number;
    onDocumentClick: (markdown: string, index: number) => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ markdown, creator, upvotes, tips, modifiedBy, index, onDocumentClick }) => (
    <div key={index ? index : ""} className="document-preview bg-white" onClick={() => onDocumentClick(markdown, index)}>
        <div className="document-header text-center pt-4">
            <button onClick={() => onDocumentClick(markdown, index)} className="px-3 py-2 bg-blue-700 text-white rounded">View</button>
        </div>

        <ReactMarkdown
            className="document-body text-left m-4 max-h-32 overflow-hidden overflow-y-scroll"
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
        >
            {markdown}
        </ReactMarkdown>


        <div className="document-footer mt-4 bg-gray-200 p-4 rounded-lg text-sm w-10/12 mx-auto mb-4">
            <h2 className="text-base font-bold">Created by {creator}</h2>
            <p>Upvotes: {upvotes}</p>
            <p>Tips: {tips}</p>
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
);

export default DocumentPreview;
