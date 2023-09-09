import { useQuery } from '@tanstack/react-query';
import { useClerk } from '@clerk/clerk-react';
import humps from 'humps';
import { Document } from '../../../interfaces';
import { useEffect, useRef } from 'react';

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
    const lastSessionRef = useRef(session);

    const query = useQuery<Document[], Error>(['documents', endpoint], async () => {
        const token = session ? await session.getToken() : 'none';
        return fetchDocuments(endpoint, token);
    }, {
        enabled: !!session,
    });

    useEffect(() => {
        if (session && session !== lastSessionRef.current) {
            query.refetch();
        }
        lastSessionRef.current = session;
    }, [session, query]);

    return {
        getDocuments: query.refetch,
        isLoading: query.isLoading,
        error: query.error,
        documents: query.data,
    };
};

export default useGetDocuments;
