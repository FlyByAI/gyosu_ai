import React, { useState, FormEvent } from 'react';
import { Chunk, ChunkInstructionProblem, IFeedbackData, ProblemData, Rating } from '../../interfaces';
import { ThumbsDownSvg, ThumbsUpSvg } from '../../svg/customSVGs';

interface FeedbackFormProps {
    feedbackLabel: string;
    rating: Rating;
    onSubmitFeedback: (data: IFeedbackData) => void;
    data: ChunkInstructionProblem;
    onClose: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ feedbackLabel, rating, onSubmitFeedback, data, onClose }) => {
    const [comment, setComment] = useState<string>("");

    const [issueType, setIssueType] = useState<{ [key: string]: boolean }>({});

    const responseQuestions = [ // can extend this to be more dynamic as a prop
        'How was the problem quality?',
        'Was this problem mistake-free?',
        'Was it easy to understand?',
        'Was the answer correct?',
    ];

    const toggleIssue = (issueName: string, thumbRating: 'thumbsUp' | 'thumbsDown') => {
        setIssueType((prevIssueType) => {
            return { ...prevIssueType, [issueName]: thumbRating === 'thumbsUp' };
        });
    };



    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const issueResponses = responseQuestions.map(question => {
            return {
                question,
                response: issueType[question] ? 'thumbsUp' : 'thumbsDown' as Rating
            };
        });

        const feedbackData: IFeedbackData = {
            feedbackLabel,
            rating,
            userFeedback: comment,
            issueResponses,
            ...data,
        };

        await onSubmitFeedback(feedbackData);
        onClose();
    };

    const renderIssue = (issue: string, index: number) => (
        <div key={index} className="space-y-2 flex items-center">
            <label>{issue}</label>
            <div className="ms-4" onClick={() => toggleIssue(issue, 'thumbsDown')}>
                <ThumbsDownSvg rating={issueType[issue] == false ? 'thumbsDown' : ''} />
            </div>
            <div className="ps-2" onClick={() => toggleIssue(issue, 'thumbsUp')}>
                <ThumbsUpSvg rating={issueType[issue] == true ? 'thumbsUp' : ''} />
            </div>
        </div>
    );

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-6">
                {(() => {
                    switch (rating) {
                        case 'thumbsDown':
                            return responseQuestions.map((issue, index) => renderIssue(issue, index));
                        case 'thumbsUp':
                            return responseQuestions.map((issue, index) => renderIssue(issue, index));
                        default:
                            return null;
                    }
                })()}
            </div>
            <div className="mb-4">
                <label className="block text-md text-white mb-2">
                    The feedback we receive from our users will help us to improve the quality of our content. Please let us know what you think.
                </label>
                <textarea
                    className="mt-1 p-2 w-full border rounded-md text-black"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                ></textarea>
            </div>

            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                Submit
            </button>
        </form>
    );
};

export default FeedbackForm;
