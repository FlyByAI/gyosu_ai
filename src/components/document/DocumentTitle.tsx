import React, { useEffect, useState } from 'react';
import useSubmitDocument from '../../hooks/tools/math/useSubmitDocument';
import { notSecretConstants } from '../../constants/notSecretConstants';
import { Document } from '../../interfaces'
import useGetDocument from '../../hooks/tools/math/useGetDocument';
import { useParams } from 'react-router-dom';
import { Tooltip as ReactTooltip } from "react-tooltip";

const DocumentTitle: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const endpoint2 = `${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/school_document/`;
    const { updateDocument } = useSubmitDocument(endpoint2);

    const [title, setTitle] = useState('');

    const { id } = useParams();

    const { document } = useGetDocument(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/school_document/`, Number(id));

    useEffect(() => {
        setTitle(document?.title || '');
    }, [document])

    const handleTitleClick = () => {
        setIsEditing(true);
    };

    const handleTitleBlur = () => {
        setIsEditing(false);
        if (document) {
            updateDocument({ document: { ...document, title } });
        }
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            setIsEditing(false);
            if (document) {
                updateDocument({ document: { ...document, title } });
            }
        }
    };

    console.log(title)

    return (
        <div className="w-64 text-lg font-bold font-mono border border-gray-500 shadow-sm ps-1"
        >
            {isEditing ? (
                <input
                    data-tooltip-id='changeTitleTip'
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    onBlur={handleTitleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="w-full text-black ps-1"
                />
            ) : (
                <h1 onClick={handleTitleClick} data-tooltip-id='changeTitleTip' className="truncate">{title}</h1>
            )}
            <ReactTooltip
                id='changeTitleTip'
                place="bottom"
                content={`Rename problem bank`} />
        </div>
    );

};

export default DocumentTitle;
