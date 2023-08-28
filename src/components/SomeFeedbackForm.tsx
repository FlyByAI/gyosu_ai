import React, { useState } from 'react';
import { IFeedbackData, Rating, ProblemData, ChunkInstructionProblem } from '../interfaces';

interface SomeFeedbackFormProps {
    toolName: string;
    responseText: string | null;
    rating: Rating;
    onSubmitFeedback: (feedbackData: IFeedbackData) => void;
    data: ProblemData | ChunkInstructionProblem | null;
}

const SomeFeedbackForm: React.FC<SomeFeedbackFormProps> = ({ toolName, responseText, rating, onSubmitFeedback, data }) => {
    const [userFeedback, setUserFeedback] = useState('');

    const handleSubmit = () => {
        const feedbackData: IFeedbackData = { toolName, responseText, rating, userFeedback, data };
        onSubmitFeedback(feedbackData);
    };

    return (
        <>
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
                <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm" onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        </>
    );
};

export default SomeFeedbackForm;
