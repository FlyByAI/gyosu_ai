import { useClerk } from '@clerk/clerk-react';
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

export interface Survey {
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
    introText?: string;
}

interface ResponsesState {
    [questionId: string]: string | string[];
}

const testSurvey = {
    id: 'testSurvey2',
    questions: [
        {
            id: '1',
            type: 'text',
            text: 'What subject do you teach?',
        },
        {
            id: '2',
            type: 'radio',
            text: 'How did you hear about us?',
            options: [
                { id: 'teacher', text: 'another teacher' },
                { id: 'google', text: 'google search' },
                { id: 'tiktok-gyosuai', text: 'tiktok - gyosu.ai' },
                { id: 'tiktok-teach2ai', text: 'tiktok - teach2AI' },
                { id: 'other', text: 'other' },
            ],
        },
        {
            id: '3',
            type: 'radio',
            text: 'What type of document are you most eager to create for class?',
            options: [
                { id: 'worksheet', text: 'worksheet' },
                { id: 'homework', text: 'homework' },
                { id: 'lesson plans', text: 'lesson plan' },
                { id: 'quiz-or-test', text: 'quiz/test' },
            ],
        },
        {
            id: '4',
            type: 'text',
            text: 'What type of document are you most eager to create for class?',
        }
    ],
};

const SurveyComponent: React.FC<SurveyComponentProps> = ({ introText = "", survey = testSurvey }) => {

    const [responses, setResponses] = useState<ResponsesState>({});

    const { apiUrl } = useEnvironment();

    const { user } = useClerk();

    const { submitSurvey, data } = useSubmitSurvey(`${apiUrl}/math_app/feedback/survey/`)

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
        setSurveySubmitted(true);
    }, [data])

    useEffect(() => {
        // survey 1 is done now. 
        localStorage.setItem(`survey_submitted_${"survey1"}`, 'true');

        if (surveySubmitted) {
            localStorage.setItem(`survey_submitted_${survey.id}`, 'true');
        }
    }, [surveySubmitted, survey.id]);

    if (!surveySubmitted && user?.id) {

        return (
            <DaisyModal canCloseBeforeSubmit={false} openDefault>
                <h2 className='text-lg font-bold mb-4'>{introText}</h2>
                <hr className="mb-4" />
                <form onSubmit={handleSubmit} className="survey space-y-2">
                    {survey.questions.map((question) => (
                        <div key={question.id} className="question">
                            <p>{question.text}</p>
                            {question.type === 'text' && (
                                <input
                                    type="text"
                                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                                    className="input input-bordered w-full"
                                />
                            )}
                            {question.type === 'radio' && question.options?.map((option) => (
                                <div key={option.id} className="form-control">
                                    <label className="flex space-x-4 items-center my-2">
                                        <input
                                            type="radio"
                                            name={question.id}
                                            className="radio radio-secondary"
                                            onChange={() => handleInputChange(question.id, option.id)}
                                            checked={responses[question.id] === option.id}
                                        />
                                        <span className="">{option.text}</span>
                                    </label>
                                </div>
                            ))}
                            {question.type === 'checkbox' && question.options?.map((option) => (
                                <div key={option.id} className="form-control">
                                    <label className="flex space-x-4 items-center my-2">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-secondary"
                                            onChange={(e) => handleOptionChange(question.id, option.id, e.target.checked)}
                                            checked={(responses[question.id] as string[])?.includes(option.id)}
                                        />
                                        <span className="">{option.text}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    ))}
                    <button type="submit" className="btn btn-primary mx-auto w-full mt-2" disabled={!canSubmit()}>
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