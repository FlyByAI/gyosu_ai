import { useClerk } from '@clerk/clerk-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import humps from 'humps';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../../../contexts/useLanguage';
import { languageNames } from '../../../helpers/language';
import { Document } from '../../../interfaces';
import { MathFormData } from './useSubmitMathForm';

interface DocumentData {
    document: Document;
    formData?: MathFormData;
}

const useSubmitDocument = (endpoint: string) => {
    const { session } = useClerk();
    const queryClient = useQueryClient();

    const { language } = useLanguage();

    const options = { site_language: languageNames[language] };

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

    const updateDocumentMutation = useMutation<Document, Error, DocumentData>(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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
            // eager updates the cache before the mutation is executed
            onMutate: async (newDocumentData: DocumentData) => {
                queryClient.cancelQueries(['document', newDocumentData.document.id]);

                const prevDocument = queryClient.getQueryData<Document>(['document', newDocumentData.document.id]);

                // Optimistically update the cache before the respnose comes back
                queryClient.setQueryData(['document', newDocumentData.document.id], newDocumentData.document);

                return { prevDocument };
            },
            onError: (_: Error, newDocumentData: DocumentData, context: { prevDocument: Document }) => {
                // Revert to the previous data if mutation fails
                queryClient.setQueryData(['document', newDocumentData.document.id], context.prevDocument);
            },
            onSuccess: (_, context: { prevDocument: Document }) => {
                // Invalidate the query to refetch and confirm
                if (context) {
                    queryClient.invalidateQueries(['document', context.prevDocument?.id]);
                    queryClient.invalidateQueries(['documents']);
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
    const { id } = useParams();

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
                // if deleting the bank you're currently on, navigate to search
                if (id == context.id) {
                    navigate('/math-app');
                }
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
