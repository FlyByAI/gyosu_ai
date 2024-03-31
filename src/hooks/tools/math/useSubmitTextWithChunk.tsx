import { useClerk } from '@clerk/clerk-react';
import { useMutation, UseMutationResult } from '@tanstack/react-query'; // Note the import of UseMutationResult for typings
import humps from 'humps';
import { useLanguage } from '../../../contexts/useLanguage';
import { languageNames } from '../../../helpers/language';
import { Chunk } from '../../../interfaces';

interface SubmitTextWithChunkResponse {
    chunk: Chunk;
    chunkIndex?: number;
}



const useSubmitTextWithChunk = (endpoint: string) => {
    const { session } = useClerk();
    const { language } = useLanguage();
    const options = { site_language: languageNames[language] };

    const submitTextWithChunkMutation: UseMutationResult<SubmitTextWithChunkResponse, Error, { userInput: string; chunk: Chunk, chunkIndex: number, problemBankId?: string }> = useMutation(
        async ({ userInput, chunk, chunkIndex, problemBankId }) => {
            const token = session ? await session.getToken() : "none";
            const body = humps.decamelizeKeys({ userInput, chunk, problemBankId, ...options });

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorResponse: Error = await response.json();
                throw new Error(errorResponse.message || `HTTP error! status: ${response.status}`);
            }
            const responseData = await response.json();
            return humps.camelizeKeys({ ...responseData, chunkIndex }) as SubmitTextWithChunkResponse;

        }
    );

    return {
        submitTextWithChunk: submitTextWithChunkMutation.mutate,
        isLoading: submitTextWithChunkMutation.isLoading,
        error: submitTextWithChunkMutation.error,
        data: submitTextWithChunkMutation.data,
        reset: submitTextWithChunkMutation.reset,
    };
};

export default useSubmitTextWithChunk;
