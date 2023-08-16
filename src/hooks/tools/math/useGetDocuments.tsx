import { useState, useCallback } from 'react';
import { useClerk } from '@clerk/clerk-react';
import humps from 'humps';
import { Document } from '../../../interfaces';

const useGetDocuments = (endpoint: string) => {
    const { session } = useClerk();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [documents, setDocuments] = useState<Document[] | null>(null);

    const getDocuments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = session ? await session.getToken() : "none";

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

            setDocuments(humps.camelizeKeys(responseData) as Document[]);
            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    }, [endpoint, session]);

    return { getDocuments, isLoading, error, documents };
};

export default useGetDocuments;
