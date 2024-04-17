import { useClerk } from '@clerk/clerk-react';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import humps from 'humps';
import { useLanguage } from '../../../contexts/useLanguage';
import { languageNames } from '../../../helpers/language';
import { Chunk } from '../../../interfaces';

interface SubmitTextWithChunkResponse {
    chunk?: Chunk;
    latex?: string;
    instruction?: string;
    chunkIndex?: number;
}

const useSubmitTextWithChunkLatex = (endpoint: string) => {
    const { session } = useClerk();
    const { language } = useLanguage();
    const options = { site_language: languageNames[language] };

    const submitTextWithChunkMutation: UseMutationResult<SubmitTextWithChunkResponse, Error, { userInput: string; chunkIndex: number, problemBankId?: string }> = useMutation(
        async ({ userInput, chunkIndex, problemBankId }) => {
            const token = session ? await session.getToken() : "none";
            const body = humps.decamelizeKeys({ userInput, problemBankId, ...options });

            const response = await fetch(endpoint, {
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
            return humps.camelizeKeys({ ...responseData, chunkIndex }) as SubmitTextWithChunkResponse;
        }
    );

    return {
        submitTextWithChunkLatex: submitTextWithChunkMutation.mutate,
        isLoading: submitTextWithChunkMutation.isLoading,
        error: submitTextWithChunkMutation.error,
        data: submitTextWithChunkMutation.data,
        reset: submitTextWithChunkMutation.reset,
    };
};

export default useSubmitTextWithChunkLatex;
