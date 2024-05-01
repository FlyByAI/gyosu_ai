import { useClerk } from '@clerk/clerk-react';
import { useMutation } from '@tanstack/react-query';
import humps from 'humps';
import { DetailedResponse } from '../../../components/SurveyComponent';
import fetchInterceptor from '../../../helpers/fetchInterceptor';

interface SurveyResponse {
    surveyId: string;
    responses: DetailedResponse[];
}

interface SubmitSurveyResponse {
    message: string; // Assuming the response contains a message
}

const useSubmitSurvey = (endpoint: string): {
    submitSurvey: (data: SurveyResponse) => void;
    isLoading: boolean;
    error: Error | null;
    data: SubmitSurveyResponse | undefined;
    reset: () => void;
} => {
    const { session } = useClerk();

    const {
        mutate: submitSurvey,
        isLoading,
        error,
        data,
        reset,
    } = useMutation<SubmitSurveyResponse, Error, SurveyResponse>(
        async (data: SurveyResponse) => {
            const token = session ? await session.getToken() : "none";
            const body = humps.decamelizeKeys(data);

            const response = await fetchInterceptor(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorResponse: Error = await response.json();
                throw new Error(errorResponse.message || `HTTP error! Status: ${response.status}`);
            }
            const responseData = await response.json();
            return humps.camelizeKeys(responseData) as SubmitSurveyResponse;
        }
    );

    return { submitSurvey, isLoading, error, data, reset };
};

export default useSubmitSurvey;
