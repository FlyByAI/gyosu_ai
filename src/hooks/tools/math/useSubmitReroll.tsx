import { useMutation } from '@tanstack/react-query';
import { useClerk } from '@clerk/clerk-react';
import humps from 'humps';
import { Chunk, ChunkInstructionProblem, Instruction, Problem } from '../../../interfaces';
import { useLanguage } from '../../../contexts/useLanguage';

interface SubmitRerollParams {
    action: string;
    chunk: Chunk;
    instruction?: Instruction;
    problem?: Problem;
}

interface SubmitRerollResponse {
    chunk: Chunk;
}

const useSubmitReroll = (endpoint: string) => {
    const { session } = useClerk();

    const { language } = useLanguage();
    const options = { language: language, topic: "none" };

    const submitRerollMutation = useMutation<SubmitRerollResponse, Error, SubmitRerollParams>(
        async ({ chunk, action, instruction, problem }): Promise<SubmitRerollResponse> => {
            const token = session ? await session.getToken() : "none";
            const body = humps.decamelizeKeys({ chunk, action, instruction, problem, ...options });

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
            return humps.camelizeKeys(responseData) as SubmitRerollResponse;
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
