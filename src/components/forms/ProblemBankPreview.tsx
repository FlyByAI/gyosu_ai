import React from 'react';
import { useNavigate } from 'react-router-dom';
import { renderContent } from '../../helpers/AstRender';
import { Document } from '../../interfaces';

interface DocumentPreviewProps {
    document: Document;
}

const ProblemBankPreview: React.FC<DocumentPreviewProps> = ({ document }) => {

    const navigate = useNavigate();
    
    return (
        <div
            className={`card w-full mx-auto max-h-64 overflow-y-scroll bg-base-100 shadow-xl`}
            onClick={() => navigate(`/math-app/bank/${document.id}`)}
        >
            <div className='card-header'>
            </div>
            <div className="card-body">
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
