import { useClerk } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import humps from 'humps';
import { DocumentDownload } from '../../../pages/Documents';
import fetchInterceptor from '../../../helpers/fetchInterceptor';

const fetchDocumentDownloads = async (endpoint: string, token: string | null) => {
    const response = await fetchInterceptor(`${endpoint}`, {
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

    return {
        isLoading: query.isLoading,
        error: query.error,
        documentDownloads: query.data,
    };
};

export default useGetDocumentDownloads;
