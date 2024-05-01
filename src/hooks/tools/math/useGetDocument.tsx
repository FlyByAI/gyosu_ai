import { useClerk } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import humps from 'humps';
import { Document } from '../../../interfaces';
import fetchInterceptor from '../../../helpers/fetchInterceptor';

const fetchDocument = async (endpoint: string, documentId: number, token: string | null) => {
    const response = await fetchInterceptor(`${endpoint}${documentId}/`, {
        method: 'GET',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return humps.camelizeKeys(responseData) as Document;
};

const useGetDocument = (endpoint: string, documentId: number) => {
    const { session } = useClerk();

    const query = useQuery<Document, Error>(['document', documentId], async () => {
        const token = session ? await session.getToken() : 'none';
        return fetchDocument(endpoint, documentId, token);
    }, {
        enabled: !!session && !isNaN(documentId) && documentId !== undefined,
    });


    return {
        isLoading: query.isLoading,
        error: query.error,
        document: query.data,
    };
};

export default useGetDocument;
