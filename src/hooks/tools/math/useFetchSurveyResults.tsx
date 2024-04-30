import { useClerk } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import humps from 'humps';
import fetchInterceptor from '../../../helpers/fetchInterceptor';

interface SurveyResult {
    _id: string; // MongoDB ObjectId represented as a string
    surveyId: string;
    responses: DetailedResponse[];
    username: string; // Optional, depending on whether you track which user submitted the response
}

interface DetailedResponse {
    question: {
        id: string;
        type: 'text' | 'radio' | 'checkbox';
        text: string;
        options?: Option[];
    };
    answer: string | string[]; // For 'checkbox' type, this will be string[]
}

interface Option {
    id: string;
    text: string;
}

const useFetchSurveyResults = (endpoint: string, surveyId: string) => {
    const { session } = useClerk();

    const getSurveyResults = async (): Promise<SurveyResult[]> => {
        const token = session ? await session.getToken() : 'none';

        const response = await fetchInterceptor(endpoint + `${surveyId}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        return humps.camelizeKeys(responseData) as SurveyResult[];
    };

    const { data: surveyResults, isLoading, error } = useQuery<SurveyResult[], Error>(
        ['surveyResults', endpoint], // The first element of the array is a unique key for the query
        () => getSurveyResults()
    );

    return { surveyResults, isLoading, error };
};

export default useFetchSurveyResults;
