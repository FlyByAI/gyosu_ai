import { useClerk } from "@clerk/clerk-react";
import { Chunk } from "../../interfaces";
import humps from "humps";
import { useMutation } from "@tanstack/react-query";
import { useLanguage } from "../../contexts/useLanguage";
import { languageNames } from "../../helpers/language";

interface SubmitChunkSidebarParams {
    tone: string;
    topic: string;
    gradeLevel: string;
    language: string;
    chunks: Chunk[];
}

export interface SubmitChunkSidebarResponse {
    chunks: Chunk[];
    // Add any other properties that you expect in the response
}


const useSubmitChunkSidebarForm = (endpoint: string) => {
    const { session } = useClerk();

    const { language } = useLanguage();

    const options = { site_language: languageNames[language] };

    const submitFormMutation = useMutation<SubmitChunkSidebarResponse, Error, SubmitChunkSidebarParams>(
        async (formParams): Promise<SubmitChunkSidebarResponse> => {
            const token = session ? await session.getToken() : "none";
            const body = humps.decamelizeKeys({ ...formParams, ...options });

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
            return humps.camelizeKeys(responseData) as SubmitChunkSidebarResponse;
        }
    );

    return {
        submitForm: submitFormMutation.mutateAsync,
        isLoading: submitFormMutation.isLoading,
        error: submitFormMutation.error,
        data: submitFormMutation.data,
    };
};

export default useSubmitChunkSidebarForm;
