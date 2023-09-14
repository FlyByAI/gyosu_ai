
import React from 'react';
import { useModal } from '../contexts/useModal';

const AppModal = ({ modalId }: { modalId: string }) => {
    const { currentModal, modalContent, closeModal } = useModal();

    if (currentModal !== modalId) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 text-white">
            <div className="bg-gray-800 p-2 rounded shadow-lg w-full max-w-2xl mx-auto">
                <div className="bg-gray-700 p-4 rounded shadow-lg">
                    {modalContent}
                    <button onClick={closeModal} className="mt-4">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppModal;