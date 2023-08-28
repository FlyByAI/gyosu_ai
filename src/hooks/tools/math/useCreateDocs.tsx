import humps from 'humps';
import { useClerk } from '@clerk/clerk-react';
import { useLanguage } from '../../../contexts/useLanguage';
import { Chunk } from '../../../interfaces';
import { languageNames } from '../../../helpers/language';
import { useMutation } from '@tanstack/react-query';

type DocxAction = "worksheet" | "quiz" | "exam" | "answer";

const useCreateDocx = (endpoint = 'api/math_app/generate_docx/') => {
    const { session } = useClerk();

    const { language } = useLanguage();

    const options = { site_language: languageNames[language] };

    const createDocxMutation = useMutation<Blob, Error, { action: DocxAction, chunks: Chunk[] }>(
        async ({ action, chunks }) => {
            const token = session ? await session.getToken() : 'none';
            const payload = humps.decamelizeKeys({ action, chunks, ...options });
            const response = await fetch(endpoint, {
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

            return response.blob();
        }
    );

    const downloadDocx = (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.docx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return {
        createDocx: (params: { action: DocxAction, chunks: Chunk[] }) => {
            createDocxMutation.mutate(params, {
                onSuccess: (blob) => {
                    downloadDocx(blob);
                }
            });
        },
        isLoading: createDocxMutation.isLoading,
        error: createDocxMutation.error,
    };
};


export default useCreateDocx;