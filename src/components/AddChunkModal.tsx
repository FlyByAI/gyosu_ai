import React from 'react';
import { useModal } from '../contexts/useModal';
import { Document, Chunk, Problem, Instruction } from '../interfaces';
import { Tooltip as ReactTooltip } from 'react-tooltip';

interface AddChunkModalProps {
    document: Document;
    modalId: string;
    enabled: boolean;
}

const AddChunkModal: React.FC<AddChunkModalProps> = ({ document, modalId, enabled }) => {
    const { currentModal, closeModal, openModal } = useModal();

    const handleOpenClick = () => {
        openModal(modalId, <AddChunkForm document={document} />);
    };

    return (
        <>
            <button
                onClick={handleOpenClick}
                className={`w-full p-2 rounded ${enabled ? 'bg-blue-500 text-white' : 'bg-gray-400 text-gray-700'}`}
                data-tooltip-id='addChunkTip'
            >
                Add Chunk
            </button>
            <ReactTooltip
                id='addChunkTip'
                place="top"
                content={`Click to add a new chunk to the document.`}
                variant="light"
                opacity={1}
            />

            {currentModal === modalId && (
                <div className="fixed inset-0 flex items-center justify-center z-50 text-white">
                    <div className="bg-gray-800 p-2 rounded shadow-lg w-3/4 max-w-2xl">
                        <div className="bg-gray-700 p-4 rounded shadow-lg">
                            <AddChunkForm document={document} />
                            <button onClick={closeModal} className="mt-4 w-64 bg-red-500 hover:bg-red-700 p-2 rounded-md">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddChunkModal;
