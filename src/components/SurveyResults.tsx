import React from 'react';
import useFetchSurveyResults from '../hooks/tools/math/useFetchSurveyResults';
import useEnvironment from '../hooks/useEnvironment';
import SurveyChart from './SurveyChart';

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

interface DetailedResponse {
    question: Question;
    answer: string | string[];
}

interface SurveyResponse {
    surveyId: string;
    responses: DetailedResponse[];
    username: string;
}

interface SurveyResultsProps {
    surveyId: string;
}

const SurveyResults: React.FC<SurveyResultsProps> = ({ surveyId }) => {

    const { mathAppApiUrl } = useEnvironment();

    const { surveyResults } = useFetchSurveyResults(`${mathAppApiUrl}/feedback/survey/`, surveyId)

    const countResponses = (surveyResponses: SurveyResponse[]) => {
        const counts: Record<string, Record<string, number>> = {};

        surveyResponses.forEach((response) => {
            response.responses.forEach((answer) => {
                const questionId = answer.question.id;
                const responseTypes = answer.question.type !== 'text' ? (Array.isArray(answer.answer) ? answer.answer : [answer.answer]) : ['textResponse'];

                if (!counts[questionId]) {
                    counts[questionId] = {};
                }

                responseTypes.forEach((resp) => {
                    if (answer.question.type === 'text') {
                        // For text responses, you might want to increment a counter or handle differently
                        counts[questionId]['textResponses'] = (counts[questionId]['textResponses'] || 0) + 1;
                    } else {
                        // For radio and checkbox types
                        counts[questionId][resp] = (counts[questionId][resp] || 0) + 1;
                    }
                });
            });
        });

        return counts;
    };

    const responseCounts = surveyResults ? countResponses(surveyResults) : {};

    return (
        <div>
            Total responses: {surveyResults?.length}
            {Object.entries(responseCounts).map(([questionId, answers]) => (
                <div className='flex'>
                    <div className="w-1/2" key={questionId}>
                        <h3>Question ID {questionId}:</h3>
                        <ul>
                            {Object.entries(answers).map(([answer, count]) => (
                                <li key={answer}>
                                    Answer '{answer}': {count} times
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-1/2">
                        <SurveyChart key={questionId} questionId={questionId} answers={answers} />
                    </div>
                </div>
            ))}

        </div>
    );
};

export default SurveyResults;
