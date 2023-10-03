import React from 'react';
import { useModal } from '../contexts/useModal';
import { Document, EmptyDocument } from '../interfaces';
import CreateDocxForm from './forms/CreateDocsForm';
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useScreenSize } from '../contexts/ScreenSizeContext';
import toast, { useToaster } from 'react-hot-toast/headless';

interface CreateDocxModalProps {
    document: Document | EmptyDocument;
    modalId: string;
    enabled: boolean;
}

const CreateDocxModal: React.FC<CreateDocxModalProps> = ({ document, modalId, enabled }) => {
    const { currentModal, closeModal, openModal } = useModal();

    const handleOpenClick = () => {
        if (!enabled) {
            toast("Please select problems first in order to create a worksheet.", {
                id: 'error-toast'
            })
        }
        else {
            openModal(modalId, <CreateDocxForm document={document} />);
        }

    };

    const { isDesktop } = useScreenSize();

    return (
        <div>
            {currentModal === modalId ? (
                <div className="inset-0 flex items-center justify-center z-20 text-white">
                    <div className="bg-gray-800 p-2 rounded shadow-lg w-5/6 md:w-3/4 max-w-2xl max-h-[80vh] overflow-y-auto">
                        <div className="bg-gray-700 p-4 rounded shadow-lg">
                            <CreateDocxForm document={document} />
                            <button onClick={closeModal} className="mt-4 w-64 bg-red-500 hover:bg-red-700 p-2 rounded-md">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            ) :
                <div
                    className="flex flex-col items-center z-5"
                    data-tooltip-id='selectProblemsTip'>
                    <button
                        onClick={handleOpenClick}
                        className={`w-full md:w-1/2 p-4 rounded text-xl font-bold shadow-lg ${enabled ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-blue-600 text-white'}`}
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
                </div>}
        </div>
    );
};

export default CreateDocxModal;
