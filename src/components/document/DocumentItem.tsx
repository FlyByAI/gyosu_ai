import { CHUNK_DRAG_TYPE, CHUNK_TYPE, Chunk, Document, INSTRUCTION_DRAG_TYPE, Instruction, PROBLEM_DRAG_TYPE, Problem } from '../../interfaces';
import EditIcon from "../../svg/Edit";
import TrashIcon from "../../svg/TrashIcon";


import React, { useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useNavigate, useParams } from 'react-router-dom';
import { useDragContext } from "../../contexts/DragContext";
import { useScreenSize } from "../../contexts/ScreenSizeContext";
import useGetDocument from '../../hooks/tools/math/useGetDocument';
import useSubmitDocument from '../../hooks/tools/math/useSubmitDocument';
import useEnvironment from '../../hooks/useEnvironment';
import OverflowMenu from "../OverflowMenu";

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

    const [{ isOver, canDrop }, dropRef] = useDrop({
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
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    const getDropStyle = (): string => {
        if (isOver && canDrop) {
            return "bg-green-500";  // your custom style when element can be dropped
        }
        if (isOver) {
            return "bg-yellow-500";
        }
        return "";
    };

    const { dragState } = useDragContext();

    const getDragStyle = (): string => {
        if (dragState.isDragging && dragState.dragType === CHUNK_DRAG_TYPE) {
            return "border-green-400 border-dashed";
        }
        return "border-transparent";
    };

    const handleClick = () => {
        navigate(`/math-app/bank/${document.id}/${isExporting ? "export" : ""}`);
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setTitle(document?.title || '');
        setIsEditing(true);
        setIsOverflowOpen(false);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (document) {
            const confirmDelete = window.confirm('Are you sure you want to delete this document? This action cannot be undone.');
            if (confirmDelete) {
                deleteDocument(document);
            }
            setIsOverflowOpen(false);
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

    const [isOverflowOpen, setIsOverflowOpen] = useState(false);

    const { isDesktop } = useScreenSize();

    return (
        <>
            <li ref={dropRef}
                className={`${id === document.id ? "bg-primary" : "bg-base-200"} p-2 rounded-lg overflow-hidden relative cursor-pointer border border-base-300 hover:border-primary transition-all duration-300 ${getDropStyle()} ${getDragStyle()}`}
                onClick={handleClick}
            >
                <div className="absolute top-2 right-2 flex space-x-2 z-20">
                    <OverflowMenu variant="bottom" isOpen={isOverflowOpen} setIsOpen={setIsOverflowOpen}>
                        <button onClick={handleEditClick} className="btn tooltip tooltip-left" data-tip="Edit">
                            <EditIcon />
                        </button>
                        <button onClick={handleDeleteClick} className="btn tooltip tooltip-left" data-tip="Delete">
                            <TrashIcon />
                        </button>
                    </OverflowMenu>
                </div>
                <div className="flex flex-col h-full justify-between">
                    <div className="flex-1">
                        {isEditing ? (
                            <input
                                type="text"
                                value={title}
                                onClick={(e) => e.stopPropagation()} // Prevent li click event
                                onChange={handleTitleChange}
                                onBlur={handleTitleBlur}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                className="input input-bordered input-sm w-full font-medium"
                            />
                        ) : (
                            <h3 className="text-lg font-medium truncate">{document.title}</h3>
                        )}
                    </div>
                    <div className="mt-2">
                        <span className={`badge font-medium`}>{document.problemChunks?.length || "No"} Problems</span>
                    </div>
                </div>
            </li>

        </>
    );
};

export default DocumentItem;
