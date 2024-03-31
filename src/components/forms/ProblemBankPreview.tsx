import React from 'react';
import { useNavigate } from 'react-router-dom';
import { renderContent } from '../../helpers/AstRender';
import useSubmitDocument from '../../hooks/tools/math/useSubmitDocument';
import useEnvironment from '../../hooks/useEnvironment';
import { Document } from '../../interfaces';

interface DocumentPreviewProps {
    document: Document;
    disabledClick?: boolean;
}

const ProblemBankPreview: React.FC<DocumentPreviewProps> = ({ document, disabledClick}) => {

    const navigate = useNavigate();

    const { apiUrl } = useEnvironment();
    const endpoint2 = `${apiUrl}/math_app/school_document/`;
    const {  updateDocument } = useSubmitDocument(endpoint2);

    

    return (
        <div
            className={`card w-full mx-auto max-h-64 overflow-y-scroll bg-base-100 shadow-xl ${disabledClick ? '' : 'cursor-pointer'}`}
            
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
