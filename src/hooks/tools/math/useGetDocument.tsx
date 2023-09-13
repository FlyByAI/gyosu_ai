import { useQuery } from '@tanstack/react-query';
import { useClerk } from '@clerk/clerk-react';
import humps from 'humps';
import { Document } from '../../../interfaces';
import { useEffect, useRef } from 'react';

const fetchDocument = async (endpoint: string, documentId: number, token: string | null) => {
    const response = await fetch(`${endpoint}${documentId}/`, {
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
    const lastSessionRef = useRef(session);

    const query = useQuery<Document, Error>(['document', documentId], async () => {
        const token = session ? await session.getToken() : 'none';
        return fetchDocument(endpoint, documentId, token);
    }, {
        enabled: !!session && !isNaN(documentId) && documentId !== undefined,
    });

    useEffect(() => {
        if (session && session !== lastSessionRef.current) {
            query.refetch();
        }
        lastSessionRef.current = session;
    }, [session, query]);

    return {
        getDocument: query.refetch, // You can use this method to refetch manually if needed
        isLoading: query.isLoading,
        error: query.error,
        document: query.data,
    };
};

export default useGetDocument;
