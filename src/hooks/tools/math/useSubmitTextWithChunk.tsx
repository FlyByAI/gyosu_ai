import { useMutation } from '@tanstack/react-query';
import { useClerk } from '@clerk/clerk-react';
import humps from 'humps';
import { Chunk } from '../../../interfaces';
import { useLanguage } from '../../../contexts/useLanguage';

const useSubmitTextWithChunk = (endpoint: string) => {
    const { session } = useClerk();

    const { language } = useLanguage();

    const options = { language: language, topic: "none" };

    const submitTextWithChunkMutation = useMutation(
        async ({ userInput, chunk }: { userInput: string; chunk: Chunk }) => {
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

            return response.json().then((json) => humps.camelizeKeys(json));
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
