import { useCallback, useState } from 'react';
import { useClerk } from '@clerk/clerk-react';
import humps from 'humps';
import { Document } from '../../../interfaces';

const useGetDocument = (endpoint: string) => {
    const { session } = useClerk();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [document, setDocument] = useState<Document | null>(null);

    const getDocument = useCallback(async (documentId: number) => {
        setLoading(true);
        setError(null);
        try {
            const token = session ? await session.getToken() : "none";

            const response = await fetch(`${endpoint}/${documentId}`, {
                method: 'GET',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();

            console.log(responseData)

            setDocument(humps.camelizeKeys(responseData) as Document);
            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    }, [endpoint, session]);

    return { getDocument, isLoading, error, document };
};

export default useGetDocument;
