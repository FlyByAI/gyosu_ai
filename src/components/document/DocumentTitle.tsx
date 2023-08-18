import React, { useState } from 'react';
import useSubmitDocument from '../../hooks/tools/math/useSubmitDocument';
import { notSecretConstants } from '../../constants/notSecretConstants';
import { Document } from '../../interfaces'

interface DocumentTitleProps {
    document: Document;
}

const DocumentTitle: React.FC<DocumentTitleProps> = ({ document }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(document.title);
    const endpoint2 = `${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/school_document/`;
    const { updateDocument } = useSubmitDocument(endpoint2);

    const handleTitleClick = () => {
        setIsEditing(true);
    };

    const handleTitleBlur = () => {
        setIsEditing(false);
        updateDocument({ document: { ...document, title } });
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            setIsEditing(false);
            updateDocument({ document: { ...document, title } });
        }
    };


    return (
        <div className="w-64 text-lg font-bold font-mono border border-gray-500 shadow-sm ps-1">
            {isEditing ? (
                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    onBlur={handleTitleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="w-full text-black ps-1"
                />
            ) : (
                <h1 onClick={handleTitleClick} className="truncate">{title}</h1>
            )}
        </div>
    );

};

export default DocumentTitle;
