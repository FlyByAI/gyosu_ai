import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useClerk } from '@clerk/clerk-react';
import humps from 'humps';
import { Document } from '../../../interfaces';
import { MathFormData } from './useSubmitMathForm';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/useLanguage';
import { languageNames } from '../../../helpers/language';

interface DocumentData {
    document: Document;
    formData?: MathFormData;
}

const useSubmitDocument = (endpoint: string) => {
    const { session } = useClerk();
    const queryClient = useQueryClient();

    const { language } = useLanguage();

    const options = { language: languageNames[language] };

    const submitDocumentMutation = useMutation<any, Error, DocumentData>(
        async (documentData: DocumentData) => {
            const token = session ? await session.getToken() : 'none';
            const payload = humps.decamelizeKeys({ document: documentData.document, ...documentData.formData, ...options });
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

            const responseData = await response.json();
            return humps.camelizeKeys(responseData) as MathFormData;
        },
        {
            onSuccess: () => {
                // Invalidate 'documents' query when submitting a new document
                queryClient.invalidateQueries(['documents']);
            },
        }
    );

    const updateDocumentMutation = useMutation<any, Error, DocumentData>(
        async (documentData: DocumentData) => {
            const token = session ? await session.getToken() : 'none';
            const payload = humps.decamelizeKeys({ document: documentData.document, ...documentData.formData });

            const response = await fetch(`${endpoint}${documentData.document.id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();

            return humps.camelizeKeys(responseData) as MathFormData;
        },
        {
            onSuccess: (_, context) => {
                // Invalidate 'document' query when updating a document
                // Assuming that context contains the documentData
                if (context) {
                    queryClient.invalidateQueries(['document', context.document.id]);
                }
            },
        }
    );

    const shareDocumentMutation = useMutation<any, Error, { id: number, shared: boolean }>(
        async ({ id, shared }) => {
            const token = session ? await session.getToken() : 'none';

            const response = await fetch(`${endpoint}${id}/share/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify({ shared: !!shared }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(humps.camelizeKeys(errorData))}`);
            }

            const responseData = await response.json();
            return humps.camelizeKeys(responseData);
        },
        {
            onSuccess: (_, { id }) => {
                queryClient.invalidateQueries(['document', id]);
                queryClient.refetchQueries(['document', id]);
            },
        }
    );

    const titleMutation = useMutation<any, Error, { id: number, title: string }>(
        async ({ id, title }) => {
            const token = session ? await session.getToken() : 'none';

            const response = await fetch(`${endpoint}${id}/update_title/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify({ title }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(humps.camelizeKeys(errorData))}`);
            }

            const responseData = await response.json();
            return humps.camelizeKeys(responseData);
        },
        {
            onSuccess: (_, { id }) => {
                queryClient.invalidateQueries(['document', id]);
                queryClient.refetchQueries(['document', id]);
            },
        }
    );


    const navigate = useNavigate();

    const deleteDocumentMutation = useMutation<void, Error, Document>(
        async (document: Document) => {
            const token = session ? await session.getToken() : 'none';

            const response = await fetch(`${endpoint}${document.id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        },
        {
            onSuccess: (_, context) => {
                // Invalidate 'documents' query when deleting a document
                queryClient.invalidateQueries(['documents']);
                queryClient.invalidateQueries(['document', context.id]);
                navigate('/math-app/bank');
            },
        }
    );


    return {
        submitDocument: submitDocumentMutation.mutate,
        updateDocument: updateDocumentMutation.mutate,
        shareDocument: shareDocumentMutation.mutate,
        updateTitle: titleMutation.mutate,
        isLoading: submitDocumentMutation.isLoading || updateDocumentMutation.isLoading,
        error: submitDocumentMutation.error || updateDocumentMutation.error,
        data: submitDocumentMutation.data || updateDocumentMutation.data,
        //delete
        deleteDocument: deleteDocumentMutation.mutate,
        isDeleting: deleteDocumentMutation.isLoading,
        deleteError: deleteDocumentMutation.error,
    };
};

export default useSubmitDocument;
