import { useClerk } from '@clerk/clerk-react';
import { useMutation } from '@tanstack/react-query';
import humps from 'humps';
import { useLanguage } from '../../../contexts/useLanguage';
import { languageNames } from '../../../helpers/language';
import { Chunk } from '../../../interfaces';

const useSubmitTextWithChunk = (endpoint: string) => {
    const { session } = useClerk();

    const { language } = useLanguage();

    const options = { site_language: languageNames[language] };

    const submitTextWithChunkMutation = useMutation(
        async ({ userInput, chunk, chunkIndex }: { userInput: string; chunk: Chunk, chunkIndex: number, problemBankId?: number }) => {
            const token = session ? await session.getToken() : "none";
            const body = humps.decamelizeKeys({ userInput, chunk, ...options });

            const response = await fetch(endpoint, {
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

            return response.json().then((json) => humps.camelizeKeys({...json, chunkIndex}));
        }
    );

    return {
        submitTextWithChunk: submitTextWithChunkMutation.mutate,
        isLoading: submitTextWithChunkMutation.isLoading,
        error: submitTextWithChunkMutation.error,
        data: submitTextWithChunkMutation.data,
    };
};

export default useSubmitTextWithChunk;
