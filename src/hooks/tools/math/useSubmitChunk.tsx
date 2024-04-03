import { useClerk } from '@clerk/clerk-react';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import humps from 'humps';
import { useLanguage } from '../../../contexts/useLanguage';
import { languageNames } from '../../../helpers/language';
import { Chunk } from '../../../interfaces';


interface SubmitTextWithTextResponse {
    text: string; 
}


const useSubmitChunk = (endpoint: string, route: string) => {
    const { session } = useClerk();
    const { language } = useLanguage();
    const options = { site_language: languageNames[language] };

    const submitChunkMutation: UseMutationResult<SubmitTextWithTextResponse, Error, ({ userInput: string; chunk: Chunk})> = useMutation(
        async ({ userInput, chunk }) => {
            const token = session ? await session.getToken() : "none";
            const body = humps.decamelizeKeys({ userInput, chunk, ...options });

            const response = await fetch(endpoint + `${route}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                // Assuming the server response includes an error message under a key; adjust as needed
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || `HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            return (humps.camelizeKeys(responseData) as SubmitTextWithTextResponse);

        }
    );

    return {
        submitChunk: submitChunkMutation.mutate,
        isLoading: submitChunkMutation.isLoading,
        error: submitChunkMutation.error,
        data: submitChunkMutation.data,
        reset: submitChunkMutation.reset,
    };
};

export default useSubmitChunk;
