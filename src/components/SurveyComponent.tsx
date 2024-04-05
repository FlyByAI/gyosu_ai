import React, { useEffect, useState } from 'react';
import useSubmitSurvey from '../hooks/tools/math/useSubmitSurvey';
import useEnvironment from '../hooks/useEnvironment';
import DaisyModal from './DaisyModal';
interface Option {
    id: string;
    text: string;
}

interface Question {
    id: string;
    type: 'text' | 'radio' | 'checkbox';
    text: string;
    options?: Option[];
}

interface Survey {
    id: string;
    questions: Question[];
}

export interface DetailedResponse {
    question: {
        id: string;
        type: 'text' | 'radio' | 'checkbox';
        text: string;
        options?: Option[];
    };
    answer: string | string[];
}

interface SurveyComponentProps {
    survey?: Survey;
}

interface ResponsesState {
    [questionId: string]: string | string[];
}

const testSurvey = {
    id: 'testSurvey',
    questions: [
        {
            id: '1',
            type: 'text',
            text: 'What did you come here for?',
        },
        {
            id: '2',
            type: 'radio',
            text: 'What subject do you teach?',
            options: [
                { id: 'red', text: 'Red' },
                { id: 'blue', text: 'Blue' },
                { id: 'green', text: 'Green' },
            ],
        },
        {
            id: '3',
            type: 'checkbox',
            text: 'What are your favorite foods?',
            options: [
                { id: 'pizza', text: 'Pizza' },
                { id: 'tacos', text: 'Tacos' },
                { id: 'ice-cream', text: 'Ice Cream' },
            ],
        },
    ],
};

const SurveyComponent: React.FC<SurveyComponentProps> = ({ survey = testSurvey }) => {
    const [responses, setResponses] = useState<ResponsesState>({});

    const { apiUrl } = useEnvironment();

    const { submitSurvey, data } = useSubmitSurvey(`${apiUrl}/math_app/feedback/problem/`)

    const [surveySubmitted, setSurveySubmitted] = useState<boolean>(() => {
        return localStorage.getItem(`survey_submitted_${survey.id}`) === 'true';
    });

    const handleInputChange = (questionId: string, value: string) => {
        setResponses(prev => ({ ...prev, [questionId]: value }));
    };

    const handleOptionChange = (questionId: string, optionId: string, isChecked: boolean) => {
        setResponses(prevResponses => {
            // Asserting that the response for this question is an array of strings.
            const currentResponse = (prevResponses[questionId] || []) as string[];

            const updatedResponse = isChecked
                ? [...currentResponse, optionId] // Add optionId if checked
                : currentResponse.filter(id => id !== optionId); // Remove optionId if unchecked

            return { ...prevResponses, [questionId]: updatedResponse };
        });
    };

    const canSubmit = () => {
        for (const question of survey.questions) {
            const response = responses[question.id];

            // Debugging output to see responses
            console.log(`Question ID: ${question.id}, Type: ${question.type}, Response:`, response);

            if (question.type === 'text' && (!response || response === '')) {
                console.log(`Failing on text input for question ID ${question.id}`);
                return false;
            }

            if (question.type === 'radio' && !response) {
                console.log(`Failing on radio for question ID ${question.id}`);
                return false;
            }

            if (question.type === 'checkbox' && (!response || (Array.isArray(response) && response.length === 0))) {
                console.log(`Failing on checkbox for question ID ${question.id}`);
                return false;
            }
        }
        console.log("All validations passed.");
        return true;
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit()) return;

        const detailedResponses: DetailedResponse[] = survey.questions.map((question) => ({
            question: {
                id: question.id,
                type: question.type as 'text' | 'radio' | 'checkbox',
                text: question.text,
                options: question.options,
            },
            answer: responses[question.id] as string | string[],
        }));

        submitSurvey({ surveyId: survey.id, responses: detailedResponses })
        setSurveySubmitted(true);

    };

    useEffect(() => {
        data && console.log(data);
        console.log("should set survey submitted on success here once development finished")
        // setSurveySubmitted(true);
    })

    useEffect(() => {
        if (surveySubmitted) {
            localStorage.setItem(`survey_submitted_${survey.id}`, 'true');
        }
    }, [surveySubmitted, survey.id]);

    if (!surveySubmitted) {

        return (
            <DaisyModal canCloseBeforeSubmit={false} openDefault>
                <form onSubmit={handleSubmit} className="survey">
                    {survey.questions.map((question) => (
                        <div key={question.id} className="question">
                            <p>{question.text}</p>
                            {question.type === 'text' && (
                                <input
                                    type="text"
                                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                                    className="input input-bordered w-full max-w-xs"
                                />
                            )}
                            {question.type === 'radio' && question.options?.map((option) => (
                                <div key={option.id} className="form-control">
                                    <label className="label cursor-pointer">
                                        <input
                                            type="radio"
                                            name={question.id}
                                            className="radio radio-primary"
                                            onChange={() => handleInputChange(question.id, option.id)}
                                            checked={responses[question.id] === option.id}
                                        />
                                        <span className="label-text">{option.text}</span>
                                    </label>
                                </div>
                            ))}
                            {question.type === 'checkbox' && question.options?.map((option) => (
                                <div key={option.id} className="form-control">
                                    <label className="label cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-primary"
                                            onChange={(e) => handleOptionChange(question.id, option.id, e.target.checked)}
                                            checked={(responses[question.id] as string[])?.includes(option.id)}
                                        />
                                        <span className="label-text">{option.text}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    ))}
                    <button type="submit" className="btn btn-primary" disabled={!canSubmit()}>
                        Submit
                    </button>
                </form>
            </DaisyModal>
        )
    }
    else {
        return null
    }
};

export default SurveyComponent;