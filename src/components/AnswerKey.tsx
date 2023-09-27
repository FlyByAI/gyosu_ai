import React from 'react';
import useCreateAnswerKey from '../hooks/tools/math/useCreateAnswerKey';
import useEnvironment from '../hooks/useEnvironment';

interface AnswerKeyProps {
    id: string;
    blobName?: string;
}

const AnswerKey: React.FC<AnswerKeyProps> = ({ id, blobName }) => {

    const { apiUrl } = useEnvironment();
    const { createAnswerKey, isLoading, error } = useCreateAnswerKey(`${apiUrl}/math_app/generate_answer_key/`);

    const handleAnswerKeyClick = () => {
        const newWindow = window.open('', '_blank'); // Preemptively open a new window
        if (blobName) {
            // Fetch the document and populate the new window
            // Your existing logic for fetching and downloading goes here
        } else {
            createAnswerKey(null, blobName);
            // Listen for successful key creation and fetch the new blobName and URL
        }
    };

    return (
        <div onClick={handleAnswerKeyClick}>
            <span className="text-yellow-300 hover:underline cursor-pointer">
                {blobName ? 'Download Answer Key' : 'Generate Answer Key'}
            </span>
        </div>
    );
};

export default AnswerKey;
