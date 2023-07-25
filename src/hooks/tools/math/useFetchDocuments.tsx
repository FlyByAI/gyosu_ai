import { useClerk } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';


import { Document } from '../../../interfaces';

const useFetchDocuments = (endpoint: string) => {
    const { session } = useClerk();
    const [isLoading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [documents, setDocuments] = useState<Document[] | null>(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = session ? await session.getToken() : "none";

                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token ? `Bearer ${token}` : '',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const responseData = await response.json();
                setDocuments(responseData);

                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [endpoint, session]);

    return { documents, isLoading, error };
};

export default useFetchDocuments;
