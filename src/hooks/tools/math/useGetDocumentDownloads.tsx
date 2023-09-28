import { useQuery } from '@tanstack/react-query';
import { useClerk } from '@clerk/clerk-react';
import humps from 'humps';
import { useEffect } from 'react';
import { DocumentDownload } from '../../../pages/Documents';

const fetchDocumentDownloads = async (endpoint: string, token: string | null) => {
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
    return humps.camelizeKeys(responseData) as DocumentDownload[];
};

const useGetDocumentDownloads = (endpoint: string) => {
    const { session } = useClerk();

    const query = useQuery<DocumentDownload[], Error>(['documentDownloads', endpoint], async () => {
        const token = session ? await session.getToken() : 'none';
        return fetchDocumentDownloads(endpoint, token);
    }, {
        enabled: !!session,
    });

    useEffect(() => {
        if (session) {
            query.refetch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    return {
        getDocumentDownloads: query.refetch,
        isLoading: query.isLoading,
        error: query.error,
        documentDownloads: query.data,
    };
};

export default useGetDocumentDownloads;
