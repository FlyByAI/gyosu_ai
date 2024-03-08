import { useModal } from '../contexts/useModal';

const AppModal = ({ modalId }: { modalId: string }) => {
    const { currentModal, modalContent, closeModal } = useModal();

    if (currentModal !== modalId) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-2 rounded shadow-lg w-full max-w-2xl mx-auto border border-gray-100">
                <div className="bg-gray-200 p-4 rounded">
                    {modalContent}
                    <button onClick={closeModal} className="mt-4 px-4 py-2 rounded bg-blue-500 text-gray-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppModal;
