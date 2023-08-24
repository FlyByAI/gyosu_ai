import React, { useState } from 'react';
import { IFeedbackData, ProblemData, Rating } from '../interfaces';

interface FeedbackModalProps {
    rating: Rating;
    toolName: string;
    responseText: string | null;
    isOpen: boolean;
    onSubmitFeedback: (feedbackData: IFeedbackData) => void;
    onClose: () => void;
    data: ProblemData | null
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ rating, toolName, responseText, isOpen, onSubmitFeedback, onClose, data }) => {
    const [userFeedback, setUserFeedback] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const feedbackData: IFeedbackData = { toolName, responseText, rating, userFeedback, ...data };
        onSubmitFeedback(feedbackData);
    };

    return isOpen ? (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-700"></div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:mx-auto md:w-1/2 lg:w-1/3">
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="mb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200" id="modal-title">
                            Submit Feedback
                        </h3>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Feedback</label>
                        <textarea id="feedback" onChange={e => setUserFeedback(e.target.value)} className="mt-1 p-2 block w-full border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse items-center justify-center">
                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm" onClick={handleSubmit}>
                        Submit
                    </button>
                    <button onClick={onClose} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    ) : null;
};

export default FeedbackModal;
