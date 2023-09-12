import React from 'react';
import { useModal } from '../contexts/useModal';
import { Document, EmptyDocument } from '../interfaces';
import CreateDocxForm from './forms/CreateDocsForm';
import { Tooltip as ReactTooltip } from "react-tooltip";

interface CreateDocxModalProps {
    document: Document | EmptyDocument;
    modalId: string;
    enabled: boolean;
}

const CreateDocxModal: React.FC<CreateDocxModalProps> = ({ document, modalId, enabled }) => {
    const { currentModal, closeModal, openModal } = useModal();

    const handleOpenClick = () => {
        openModal(modalId, <CreateDocxForm document={document} />);
    };

    return (
        <>
            <button
                onClick={handleOpenClick}
                className={`w-full p-2 rounded ${enabled ? 'bg-blue-500 text-white' : 'bg-gray-400 text-gray-700'}`}
                data-tooltip-id='selectProblemsTip'
            >
                Create Worksheet
            </button>
            <ReactTooltip
                id='selectProblemsTip'
                place="top"
                content={`Select some problems to create a worksheet.`}
                variant="light"
                opacity={1}
            />

            {currentModal === modalId && (
                <div className="fixed inset-0 flex items-center justify-center z-50 text-white">
                    <div className="bg-gray-800 p-2 rounded shadow-lg w-3/4 max-w-2xl">
                        <div className="bg-gray-700 p-4 rounded shadow-lg">
                            <CreateDocxForm document={document} />
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

export default CreateDocxModal;
