import React from 'react';
import { useModal } from '../contexts/useModal';
import { Document, EmptyDocument } from '../interfaces';
import CreateDocxForm from './forms/CreateDocsForm';
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useScreenSize } from '../contexts/ScreenSizeContext';

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

    const { isDesktop } = useScreenSize();

    return (
        <div className='overflow-y-auto'>
            <div
                className="flex flex-col items-center z-5"
                data-tooltip-id='selectProblemsTip'>
                <button
                    onClick={handleOpenClick}
                    disabled={!enabled}
                    className={`w-full md:w-1/2 p-4 rounded text-lg font-bold shadow-lg ${enabled ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-gray-400 text-gray-700'}`}
                >
                    Create Worksheet
                </button>
                {isDesktop && <ReactTooltip
                    id='selectProblemsTip'
                    place="right"
                    offset={-40}
                    children={<><div className='flex flex-row items-center justify-center'>Select some problems</div>
                        <div className='flex flex-row items-center justify-center'>to create a worksheet.</div>
                    </>}
                    variant="light"
                    opacity={1}
                />}
            </div>

            {currentModal === modalId && (
                <div className="fixed inset-0 flex items-center justify-center z-40 text-white">
                    <div className="bg-gray-800 p-2 rounded shadow-lg w-5/6 md:w-3/4 max-w-2xl max-h-[80vh] overflow-y-auto">
                        <div className="bg-gray-700 p-4 rounded shadow-lg">
                            <CreateDocxForm document={document} />
                            <button onClick={closeModal} className="mt-4 w-64 bg-red-500 hover:bg-red-700 p-2 rounded-md">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateDocxModal;
