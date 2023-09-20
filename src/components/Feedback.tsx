import React, { useState } from 'react';
import { ThumbsDownSvg, ThumbsUpSvg } from '../svg/customSVGs';
import { useModal } from '../contexts/useModal';
import { Rating } from '../interfaces';
import FeedbackForm from './forms/FeedbackForm';
import useEnvironment from '../hooks/useEnvironment';
import useSubmitFeedback from '../hooks/useSubmitFeedback';

interface FeedbackProps {
    feedbackLabel: string;
    data: any; // Replace with the proper type
    responseQuestions?: string[];
}

const Feedback: React.FC<FeedbackProps> = ({ feedbackLabel, data, responseQuestions }) => {

    const { apiUrl } = useEnvironment();

    const { submitFeedback } = useSubmitFeedback(`${apiUrl}/math_app/feedback/problem/`)
    const [rating, setRating] = useState<Rating>("");
    const { openModal, closeModal } = useModal();

    const handleThumbUpClick = () => {
        setRating('thumbsUp');
        openModal(
            "feedbackModal",
            <FeedbackForm
                feedbackLabel={feedbackLabel}
                rating='thumbsUp'
                onSubmitFeedback={submitFeedback}
                data={data}
                onClose={closeModal}
                responseQuestions={responseQuestions}
            />
        );
    };

    const handleThumbDownClick = () => {
        setRating('thumbsDown');
        openModal(
            "feedbackModal",
            <FeedbackForm
                feedbackLabel={feedbackLabel}
                rating='thumbsDown'
                onSubmitFeedback={submitFeedback}
                data={data}
                onClose={closeModal}
                responseQuestions={responseQuestions}
            />
        );
    };

    return (
        <div className='w-max'>
            <button onClick={handleThumbUpClick} className="my-2 mx-1" data-tooltip-id="reviewTip">
                <div className={`pe-1 dark:text-gray-200`}>
                    <ThumbsUpSvg rating={rating || ""} />
                </div>
            </button>
            <button onClick={handleThumbDownClick} className="my-2 mx-1">
                <div className={`pe-1 dark:text-gray-200`} data-tooltip-id="reviewTip">
                    <ThumbsDownSvg rating={rating || ""} />
                </div>
            </button>
        </div>
    );
};

export default Feedback;
