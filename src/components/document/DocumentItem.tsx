import { MathProblemDragItem } from "./ProblemBankShelf";
import { CHUNK_DRAG_TYPE, CHUNK_TYPE, Chunk, Document, INSTRUCTION_DRAG_TYPE, Instruction, PROBLEM_DRAG_TYPE, Problem } from '../../interfaces';
import EditIcon from "../../svg/Edit";
import TrashIcon from "../../svg/TrashIcon";


import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { useParams, useNavigate } from 'react-router-dom';
import useSubmitDocument from '../../hooks/tools/math/useSubmitDocument';
import useGetDocument from '../../hooks/tools/math/useGetDocument';
import { Tooltip as ReactTooltip } from "react-tooltip";
import useEnvironment from '../../hooks/useEnvironment';
import OverflowMenu from "../OverflowMenu";
// ... other imports

interface DocumentItemProps {
    document: Document;
    onDropChunk: (documentId: number, node: Chunk) => void;
    isExporting: boolean;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ document, onDropChunk, isExporting }) => {
    const navigate = useNavigate();
    const { apiUrl } = useEnvironment();
    const endpoint2 = `${apiUrl}/math_app/school_document/`;
    const { updateDocument } = useSubmitDocument(endpoint2);
    const { id } = useParams();

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');

    const { document: fetchedDocument } = useGetDocument(`${apiUrl}/math_app/school_document/`, Number(id));

    const { deleteDocument, isDeleting, shareDocument } = useSubmitDocument(`${apiUrl}/math_app/school_document/`);

    useEffect(() => {
        setTitle(fetchedDocument?.title || '');
    }, [fetchedDocument]);

    const [, dropRef] = useDrop({
        accept: [CHUNK_DRAG_TYPE, PROBLEM_DRAG_TYPE, INSTRUCTION_DRAG_TYPE],
        drop: (item: Instruction | Problem | Chunk) => {
            if (document.id) {
                // If the item is a Chunk, pass it directly to onDropChunk
                if (item.type === CHUNK_TYPE) {
                    onDropChunk(document.id, item);
                } else {
                    // If the item is an Instruction or Problem, create a Chunk and add the item to its content
                    const newChunk: Chunk = {
                        type: "chunk",
                        content: [item],
                    };
                    onDropChunk(document.id, newChunk);
                }
            }
        },
    });

    const handleClick = () => {
        navigate(`/math-app/document/${document.id}/${isExporting ? "export" : ""}`);
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setTitle(document?.title || '');
        setIsEditing(!isEditing);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (document) {
            const confirmDelete = window.confirm('Are you sure you want to delete this document? This action cannot be undone.');
            if (confirmDelete) {
                deleteDocument(document);
            }
        }
    };

    useEffect(() => {
        setTitle(document?.title || '');
    }, [document])

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



    return (
        <li ref={dropRef} key={document.id} className={`${id == document.id ? "bg-blue-900" : "bg-gray-700"} text-white h-16 p-1 rounded-md overflow-clip relative cursor-pointer`} onClick={handleClick}>
            <div className="z-10 absolute top-1 right-1 flex space-x-2">
                <OverflowMenu
                    variant="bottom"
                >
                    <button onClick={handleEditClick}
                        className="p-1 text-green-700 rounded"
                        data-tooltip-id="editDocumentTip"
                    >
                        <EditIcon />
                        <ReactTooltip
                            id='editDocumentTip'
                            place="bottom"
                            positionStrategy="fixed"
                            variant="light"
                            opacity={1}
                            content={`Rename`} />
                    </button>
                    <button className='text-red-500 px-1 rounded'
                        data-tooltip-id="deleteDocumentTip"
                        onClick={handleDeleteClick}>
                        <TrashIcon />
                        <ReactTooltip
                            id='deleteDocumentTip'
                            place="bottom"
                            positionStrategy="fixed"
                            variant="light"
                            opacity={1}
                            content={`Delete`} />
                    </button>
                </OverflowMenu>
            </div>
            {document && document.problemChunks && (
                <div className="p-1">
                    <div className="flex h-4">
                        {
                            <div className="text-white rounded-full text-xs">
                                {document.problemChunks.length || "No"} Problems
                            </div>
                        }
                    </div>
                    <div className="absolute text-sm flex flex-col">
                        <div className="w-100 truncate">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={title}
                                    onChange={handleTitleChange}
                                    onBlur={handleTitleBlur}
                                    onKeyDown={handleKeyDown}
                                    autoFocus
                                    className="w-full text-black cursor-text"
                                />
                            ) : (
                                <h1
                                    onClick={handleEditClick}
                                    className="truncate cursor-text">
                                    {document.title}
                                </h1>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </li>
    );
};

export default DocumentItem;
