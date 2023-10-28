import { useMutation } from '@tanstack/react-query';
import { useClerk } from '@clerk/clerk-react';
import humps from 'humps';

interface MutationResponse {
    docxUrl: string;
    pdfUrl: string;
    fileName: string;
}

interface CreateDocxFromMarkdownParams {
    markdown: string;
}

interface CreateDocxOptions {
    onSuccess?: (data: MutationResponse) => void;
}

const useCreateDocxFromMarkdown = (endpoint = 'api/markdown_to_docx/') => {
    const { session } = useClerk();

    const createDocxMutation = useMutation<MutationResponse, Error, CreateDocxFromMarkdownParams>(
        async ({ markdown }) => {
            const token = session ? await session.getToken() : 'none';
            const payload = humps.decamelizeKeys({ markdown });

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
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
        createDocx: (params: CreateDocxFromMarkdownParams, options?: CreateDocxOptions) => {
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

export default useCreateDocxFromMarkdown;
