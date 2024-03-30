import { useClerk } from '@clerk/clerk-react';
import { useMutation } from '@tanstack/react-query';
import humps from 'humps';
import { useLanguage } from '../../../contexts/useLanguage';
import { languageNames } from '../../../helpers/language';
import { Chunk, GenerateFormData } from '../../../interfaces';

import { UseMutationResult } from '@tanstack/react-query';

interface SubmitMathFormResponse {
    response: Chunk[]
}

const useSubmitMathForm = (endpoint: string) => {
    const { session } = useClerk();
    const { language } = useLanguage();
    const options = { site_language: languageNames[language] };

    const submitMathFormMutation: UseMutationResult<SubmitMathFormResponse, Error, GenerateFormData, unknown> = useMutation(
        async (formData: GenerateFormData): Promise<SubmitMathFormResponse> => {
            const token = session ? await session.getToken() : "none";

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify(humps.decamelizeKeys({ ...formData.data, ...options }))
            });

            if (!response.ok) {
                const errorResponse: Error = await response.json();
                throw new Error(errorResponse.message || `HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            return humps.camelizeKeys(responseData) as SubmitMathFormResponse;
        }
    );

    return {
        submitMathForm: submitMathFormMutation.mutate,
        isLoading: submitMathFormMutation.isLoading,
        error: submitMathFormMutation.error,
        data: submitMathFormMutation.data,
        reset: submitMathFormMutation.reset,
    };
};

export default useSubmitMathForm;
