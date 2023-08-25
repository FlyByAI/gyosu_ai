import React, { useEffect, useState } from 'react';
import useSubmitFeedback from '../hooks/useSubmitFeedback';
import FeedbackModal from './FeedbackModal';
import { ChunkInstructionProblem, IFeedbackData, ProblemData, Rating } from '../interfaces';
import { ThumbsDownSvg, ThumbsUpSvg } from '../svg/customSVGs';
import { notSecretConstants } from '../constants/notSecretConstants';



interface IResponseFeedbackProps {
    responseText: string | null;
    toolName: string;
    className?: string;
    size?: 6 | 10 | 15;
    data: ProblemData | ChunkInstructionProblem | null;
}
const ResponseFeedback = ({ responseText, toolName, className, size = 10, data }: IResponseFeedbackProps) => {
    const [thumbUpSelected, setThumbUpSelected] = useState(false);
    const [thumbDownSelected, setThumbDownSelected] = useState(false);
    const [rating, setRating] = useState<Rating>("");
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        setThumbUpSelected(false);
        setThumbDownSelected(false);
        setRating("");
    }, [responseText])

    const { submitFeedback } = useSubmitFeedback(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/feedback/problem`);

    const handleThumbUpClick = () => {
        setThumbUpSelected(!thumbUpSelected);
        setThumbDownSelected(false);
        setRating('thumbsUp')
        setModalOpen(true)
    };

    const handleThumbDownClick = () => {
        setThumbDownSelected(!thumbDownSelected);
        setThumbUpSelected(false);
        setRating('thumbsDown')
        setModalOpen(true)
    };

    const handleSubmitFeedback = (feedbackData: IFeedbackData) => {
        submitFeedback(feedbackData);
        setModalOpen(false);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };



    return (
        <div className={"flex justify-center" + className}>
            <button onClick={handleThumbUpClick} className="mr-2">
                <div className={`w-${size} dark:text-gray-700`}>
                    <ThumbsUpSvg rating={rating} />
                </div>
            </button>
            <button onClick={handleThumbDownClick} className="">
                <div className={`w-${size} dark:text-gray-700`}>
                    <ThumbsDownSvg rating={rating} />
                </div>
            </button>
            <FeedbackModal
                rating={rating}
                isOpen={isModalOpen}
                onSubmitFeedback={handleSubmitFeedback}
                onClose={handleCloseModal}
                toolName={toolName}
                responseText={responseText}
                data={data || null}
            />
        </div>
    );
};

export default ResponseFeedback;
