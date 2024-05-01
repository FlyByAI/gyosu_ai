import humps from 'humps';
import { useClerk } from '@clerk/clerk-react';
import { useLanguage } from '../../../contexts/useLanguage';
import { Chunk } from '../../../interfaces';
import { languageNames } from '../../../helpers/language';
import { useMutation } from '@tanstack/react-query';
import fetchInterceptor from '../../../helpers/fetchInterceptor';

export type DocxAction = "worksheet" | "quiz" | "exam" | "answer";

interface MutationResponse {
    docxUrl: string;
    pdfUrl: string;
    fileName: string;
}

interface CreateDocxParams {
    action: DocxAction;
    chunks: Chunk[];
    title: string;
    persona: string;
    theme: string;
}

interface CreateDocxOptions {
    onSuccess?: (data: MutationResponse) => void;
}

const useCreateDocx = (endpoint = 'api/math_app/generate_docx/') => {
    const { session } = useClerk();
    const { language } = useLanguage();
    const options = { site_language: languageNames[language] };

    const createDocxMutation = useMutation<MutationResponse, Error, CreateDocxParams>(
        async ({ action, chunks, title, persona, theme }) => {
            const token = session ? await session.getToken() : 'none';
            const payload = humps.decamelizeKeys({ action, chunks, title, persona, theme, ...options });
            const response = await fetchInterceptor(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
                }
            }

            const responseData = await response.json().then((json) => humps.camelizeKeys(json));
            return responseData as MutationResponse;
        }
    );

    const downloadFromUrl = (url: string, fileName: string) => {
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return {
        createDocx: (params: CreateDocxParams, options?: CreateDocxOptions) => {
            createDocxMutation.mutate(params, {
                onSuccess: (data) => {
                    downloadFromUrl(data.docxUrl, `${data.fileName}.docx`);
                    downloadFromUrl(data.pdfUrl, `${data.fileName}.pdf`);

                    if (options?.onSuccess) {
                        options.onSuccess(data);
                    }
                },
            });
        },
        isLoading: createDocxMutation.isLoading,
        error: createDocxMutation.error,
    };
};

export default useCreateDocx;
