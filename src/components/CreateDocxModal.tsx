import React from 'react';
import { useScreenSize } from '../contexts/ScreenSizeContext';
import { useModal } from '../contexts/useModal';
import { Document, EmptyDocument } from '../interfaces';
import CreateDocxForm from './forms/CreateDocsForm';

interface CreateDocxModalProps {
    document: Document | EmptyDocument;
    modalId: string;
}

const CreateDocxModal: React.FC<CreateDocxModalProps> = ({ document, modalId }) => {
    const { currentModal, closeModal, openModal } = useModal();

    const handleOpenClick = () => {
            openModal(modalId, <CreateDocxForm document={document} />);
    };

    const { isDesktop } = useScreenSize();

    return (
        <div>
        {currentModal === modalId ? (
            <div className="fixed inset-x-0 z-20 flex justify-center">
                <div className="p-2 bg-base-200 rounded shadow-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto">
                    <div className="p-4 rounded shadow">
                        <CreateDocxForm document={document} />
                        <button onClick={closeModal} className="btn btn-error mt-4 w-full">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        ) : (
            <div className="fixed inset-x-0 bottom-8 z-20 flex justify-center">
                <div className="flex flex-col items-center z-5 w-full max-w-xs md:max-w-4xl">
                    <button
                        onClick={handleOpenClick}
                        className={`btn w-full md:w-1/2 text-xl btn-info`}
                        title="Select some problems to create a worksheet."
                    >
                        Export Problems
                    </button>
                </div>
            </div>
        )}
    </div>
    );
};

export default CreateDocxModal;
