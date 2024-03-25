import { useClerk } from '@clerk/clerk-react';
import { useMutation } from '@tanstack/react-query';
import humps from 'humps';
import { useLanguage } from '../../../contexts/useLanguage';
import { languageNames } from '../../../helpers/language';
import { Chunk, Instruction, Problem } from '../../../interfaces';

interface SubmitRerollParams {
    action: string;
    chunk: Chunk;
    instruction?: Instruction;
    problem?: Problem;
    chunkIndex?: number;
    problemBankId?: string;
}

interface SubmitRerollResponse {
    chunks: Chunk[]
    chunkIndex?: number
}

const useSubmitReroll = (endpoint: string) => {
    const { session } = useClerk();

    const { language } = useLanguage();
    const options = { site_language: languageNames[language] };

    const submitRerollMutation = useMutation<SubmitRerollResponse, Error, SubmitRerollParams>(
        async ({ chunk, action, instruction, problem, chunkIndex, problemBankId }): Promise<SubmitRerollResponse> => {
            const token = session ? await session.getToken() : "none";
            const body = humps.decamelizeKeys({ chunk, action, instruction, problem, problemBankId, ...options });

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.statusText} ${response.status}`);
            }

            const responseData = await response.json();
            return humps.camelizeKeys({...responseData, chunkIndex}) as SubmitRerollResponse;
        }
    );

    return {
        submitReroll: submitRerollMutation.mutateAsync, // Use mutateAsync here
        isLoading: submitRerollMutation.isLoading,
        error: submitRerollMutation.error,
        data: submitRerollMutation.data,
    };
};

export default useSubmitReroll;
