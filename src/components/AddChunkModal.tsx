import React from 'react';
import { useModal } from '../contexts/useModal';
import { Chunk } from '../interfaces';
import PlusIcon from '../svg/PlusIcon';
import AddChunkForm from './forms/AddChunkForm';

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
                className={variant == "button" ? `btn btn-primary z-10 rounded-md tooltip` : ` btn btn-primary flex-row flex w-max tooltip`}
                data-tip='Add this problem to a problem bank.'
            >
                <PlusIcon />
            </button>

            {currentModal === modalId && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-base-100 p-2 rounded shadow-lg w-5/6 md:w-3/4 max-w-2xl">
                        <div className="p-4 rounded shadow-lg">
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
