import React, { useState, FormEvent } from 'react';
import { ChunkInstructionProblem, IFeedbackData, ProblemData, Rating } from '../../interfaces';
import { ThumbsDownSvg, ThumbsUpSvg } from '../../svg/customSVGs';

interface FeecbackFormProps {
    toolName: string;
    responseText: string | null;
    rating: Rating;
    onSubmitFeedback: (data: IFeedbackData) => void;
    data: ProblemData | ChunkInstructionProblem | null;
    onClose: () => void;
}

const FeecbackForm: React.FC<FeecbackFormProps> = ({ toolName, responseText, rating, onSubmitFeedback, data, onClose }) => {
    const [comment, setComment] = useState<string>("");

    const [issueType, setIssueType] = useState<{ [key: string]: boolean }>({});

    const issueTypesThumbsDown = [
        'How was the problem quality?',
        'Were there typos?',
        'Was the answer incorrect?'
    ];

    const issueTypesThumbsUp = [
        'Did you like the problem quality?',
        'Was it easy to understand?'
    ];

    const toggleIssue = (issueName: string, thumbRating: 'thumbsUp' | 'thumbsDown') => {
        setIssueType((prevIssueType) => {
            return { ...prevIssueType, [issueName]: thumbRating === 'thumbsUp' };
        });
    };



    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const feedbackData: IFeedbackData = {
            toolName,
            responseText,
            rating,
            userFeedback: comment,
            data,
            ...issueType,
        };

        await onSubmitFeedback(feedbackData);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                {rating === 'thumbsDown' && issueTypesThumbsDown.map((issue, index) => (
                    <div key={index} className="space-y-2 flex items-center">
                        <label>{issue}</label>
                        <div onClick={() => toggleIssue(issue, 'thumbsDown')}>
                            <ThumbsDownSvg rating={issueType[issue] == false ? 'thumbsDown' : ''} />
                        </div>
                        <div onClick={() => toggleIssue(issue, 'thumbsUp')}>
                            <ThumbsUpSvg rating={issueType[issue] == true ? 'thumbsUp' : ''} />
                        </div>
                    </div>
                ))}
                {rating === 'thumbsUp' && issueTypesThumbsUp.map((issue, index) => (
                    <div key={index} className="space-y-2 flex items-center">
                        <label>{issue}</label>
                        <div onClick={() => toggleIssue(issue, 'thumbsDown')}>
                            <ThumbsDownSvg rating={issueType[issue] == false ? 'thumbsDown' : ''} />
                        </div>
                        <div onClick={() => toggleIssue(issue, 'thumbsUp')}>
                            <ThumbsUpSvg rating={issueType[issue] == true ? 'thumbsUp' : ''} />
                        </div>
                    </div>
                ))}
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-white">Comment</label>
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

export default FeecbackForm;
