import { useQuery } from '@tanstack/react-query';
import { useClerk } from '@clerk/clerk-react';
import humps from 'humps';
import { Document } from '../../../interfaces';
import { useEffect } from 'react';

const fetchDocuments = async (endpoint: string, token: string | null) => {
    const response = await fetch(`${endpoint}`, {
        method: 'GET',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return humps.camelizeKeys(responseData) as Document[];
};

const useGetDocuments = (endpoint: string) => {
    const { session } = useClerk();

    const query = useQuery<Document[], Error>(['documents', endpoint], async () => {
        const token = session ? await session.getToken() : 'none';
        return fetchDocuments(endpoint, token);
    }, {
        // Optional configuration like staleTime, retry, etc.
        enabled: !!session, // This will run the query only if session is available
    });

    useEffect(() => {
        if (session) {
            query.refetch();
        }
    }, [session, query]);

    return {
        getDocuments: query.refetch, // You can use this method to refetch manually if needed
        isLoading: query.isLoading,
        error: query.error,
        documents: query.data,
    };
};

export default useGetDocuments;
