import { useClerk } from '@clerk/clerk-react';
import { useMutation } from '@tanstack/react-query';
import humps from 'humps';
import { useLanguage } from '../../../contexts/useLanguage';
import { languageNames } from '../../../helpers/language';
import { Chunk } from '../../../interfaces';

interface SubmitTextWithChunkResponse {
    chunk?: Chunk
    latex?: string
    chunkIndex?: number
}

const useSubmitTextWithChunk = (endpoint: string) => {
    const { session } = useClerk();

    const { language } = useLanguage();

    const options = { site_language: languageNames[language] };

    const submitTextWithChunkMutation = useMutation(
        async ({ userInput, chunkIndex, problemBankId }: { userInput: string; chunkIndex: number, problemBankId?: string }) => {
            const token = session ? await session.getToken() : "none";
            const body = humps.decamelizeKeys({ userInput, problemBankId, ...options });

            const response = await fetch(endpoint + "text_to_latex/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
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

export default useSubmitTextWithChunk;
