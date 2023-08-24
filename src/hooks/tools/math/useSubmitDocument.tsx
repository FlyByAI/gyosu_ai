import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useClerk } from '@clerk/clerk-react';
import humps from 'humps';
import { Document } from '../../../interfaces';
import { MathFormData } from './useSubmitMathForm';

interface DocumentData {
    document: Document;
    formData?: MathFormData;
}

const useSubmitDocument = (endpoint: string) => {
    const { session } = useClerk();
    const queryClient = useQueryClient();

    const submitDocumentMutation = useMutation<any, Error, DocumentData>(
        async (documentData: DocumentData) => {
            const token = session ? await session.getToken() : 'none';
            const payload = humps.decamelizeKeys({ document: documentData.document, ...documentData.formData });
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

            console.log(payload)

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

            console.log(responseData)

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


    return {
        submitDocument: submitDocumentMutation.mutate,
        updateDocument: updateDocumentMutation.mutate,
        isLoading: submitDocumentMutation.isLoading || updateDocumentMutation.isLoading,
        error: submitDocumentMutation.error || updateDocumentMutation.error,
        data: submitDocumentMutation.data || updateDocumentMutation.data,
    };
};

export default useSubmitDocument;
