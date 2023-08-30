import humps from 'humps';
import { useClerk } from '@clerk/clerk-react';
import { useLanguage } from '../../../contexts/useLanguage';
import { Chunk } from '../../../interfaces';
import { languageNames } from '../../../helpers/language';
import { useMutation } from '@tanstack/react-query';

type DocxAction = "worksheet" | "quiz" | "exam" | "answer";

interface MutationResponse {
    docx_url: string;
    pdf_url: string;
    file_name: string;
}

const useCreateDocx = (endpoint = 'api/math_app/generate_docx/') => {
    const { session } = useClerk();
    const { language } = useLanguage();
    const options = { site_language: languageNames[language] };

    const createDocxMutation = useMutation<MutationResponse, Error, { action: DocxAction; chunks: Chunk[] }>(
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

            return response.json();
        }
    );

    const downloadFromUrl = (url: string, fileName: string) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return {
        createDocx: (params: { action: DocxAction; chunks: Chunk[] }) => {
            createDocxMutation.mutate(params, {
                onSuccess: (data) => {
                    downloadFromUrl(data.docx_url, `${data.file_name}.docx`);
                    downloadFromUrl(data.pdf_url, `${data.file_name}.pdf`);
                },
            });
        },
        isLoading: createDocxMutation.isLoading,
        error: createDocxMutation.error,
    };
};


export default useCreateDocx;