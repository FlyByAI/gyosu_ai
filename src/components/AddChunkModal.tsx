import React, { useEffect } from 'react';
import { useModal } from '../contexts/useModal';
import { Chunk } from '../interfaces';
import AddChunkForm from './forms/AddChunkForm';
import PlusIcon from '../svg/PlusIcon';

interface AddChunkModalProps {
    chunk: Chunk;
    modalId: string;
    enabled: boolean;
    variant?: string;
}

const AddChunkModal: React.FC<AddChunkModalProps> = ({ chunk, modalId, variant }) => {
    const { currentModal, closeModal, openModal } = useModal();

    const handleOpenClick = () => {
        openModal(modalId, <AddChunkForm chunk={chunk} />);
    };


    return (
        <>
            <button
                onClick={handleOpenClick}
                className={variant == "button" ? `z-10 bg-blue-500 rounded-md p-1` : `text-green-500 flex-row flex w-max`}
                data-tooltip-id='addChunkTip'
            >
                <PlusIcon />
            </button>

            {currentModal === modalId && (
                <div className="fixed inset-0 flex items-center justify-center z-50 text-white">
                    <div className="bg-gray-800 p-2 rounded shadow-lg w-5/6 md:w-3/4 max-w-2xl">
                        <div className="bg-gray-700 p-4 rounded shadow-lg">
                            <AddChunkForm chunk={chunk} />
                            <button onClick={closeModal} className="mt-4 w-1/2 bg-red-500 hover:bg-red-700 p-2 rounded-md">
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
