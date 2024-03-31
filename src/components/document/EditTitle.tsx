import React, { useEffect, useState } from 'react';
import EditIcon from '../../svg/Edit';

interface EditTitleProps {
    title: string;
    onUpdateTitle: (newTitle: string) => void; // Function to call when the title is updated
    onEditingDone?: () => void; // Optional callback for when editing is finished
}

const EditTitle: React.FC<EditTitleProps> = ({ title, onUpdateTitle, onEditingDone }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditedTitle(event.target.value);
    };

    const toggleEdit = (e: any) => {
        console.log('click')
        e.stopPropagation();
        setIsEditing(!isEditing);
    };

    const handleBlur = () => {
        onUpdateTitle(editedTitle);
        setIsEditing(false);
        onEditingDone?.();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleBlur();
            onUpdateTitle(editedTitle);
        }
    };

    useEffect(() => {
        setEditedTitle(title)
    }, [title])

    return (
        <div className='flex-grow'>
            {isEditing ? (
                <input
                    type="text"
                    value={editedTitle}
                    onChange={handleTitleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="input input-bordered input-sm w-full font-medium"
                />
            ) : (
                <div className="flex justify-between items-center w-full">
                    <h3 className="text-lg font-medium truncate">{title}</h3>
                    <button onClick={toggleEdit} className="btn btn-primary tooltip" data-tip="Rename this problem bank.">
                        <EditIcon />
                    </button>
                </div>
            )}
        </div>
    );
};

export default EditTitle;
