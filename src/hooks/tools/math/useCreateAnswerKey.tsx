import humps from 'humps';
import { useClerk } from '@clerk/clerk-react';
import { useLanguage } from '../../../contexts/useLanguage';
import { languageNames } from '../../../helpers/language';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import fetchInterceptor from '../../../helpers/fetchInterceptor';

interface AnswerKeyResponse {
    blobName: string;
    signedUrl?: string;
}

const useCreateAnswerKey = (endpoint: string) => {
    const { session } = useClerk();
    const { language } = useLanguage();
    const options = { site_language: languageNames[language] };
    const queryClient = useQueryClient();

    const createAnswerKeyMutation = useMutation<AnswerKeyResponse, Error, { id: string | number; blobName: string }>(
        async ({ id, blobName }) => {
            const token = session ? await session.getToken() : 'none';
            const payload = humps.decamelizeKeys({ id, blobName, ...options });
            const response = await fetchInterceptor(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json().then((json) => humps.camelizeKeys(json));
            return responseData as AnswerKeyResponse;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['documentDownloads']);
            },
        }
    );

    return {
        createAnswerKey: (id: string | number, blobName: string) => {
            createAnswerKeyMutation.mutate({ id, blobName });
        },
        isLoading: createAnswerKeyMutation.isLoading,
        error: createAnswerKeyMutation.error,
    };
};

export default useCreateAnswerKey;
